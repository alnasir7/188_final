/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import '../../style/settings.css';
import {
  changeAvatar,
  changePassword,
  deactivateUser,
  logout,
  useLoggedInUser
} from '../../utils/backendUsers';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ReactS3Uploader from 'react-s3-uploader';

const mime = require('mime-types');

function getFileMimeType(file) {
  return file.type || mime.lookup(file.name);
}

const Avatar = styled.img`
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid black;
`;

const Title = styled.p`
  padding-top: 50px;
  font-size: 30px;
  font-family: "Raleway", sans-serif;
`;

const { confirm } = Modal;

const showConfirmDeactivate = ((leaveGroup) => {
  confirm({
    title: 'Are you sure you want to deactive this account?',
    icon: <ExclamationCircleOutlined/>,
    content: 'You will lose all content related to this account and will not be able to access it ever again',
    onOk() {
      leaveGroup();
    },
    onCancel() {
    },
  });
});

function DeactivateButton() {
  const history = useHistory();
  const deactivateAccount = (async () => {
    await deactivateUser();
    history.push('/');
  });
  return (
    <button className="custom-button" onClick={() => showConfirmDeactivate(deactivateAccount)}
            size="small" shape="round" type="primary">
      Deactivate Account
    </button>
  );
}

function Settings() {
  const history = useHistory();
  const [attachedImageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const user = useLoggedInUser([attachedImageUrl]);

  if (user === undefined) {
    logout()
      .then(() => history.push('/'));
    return;
  }

  const handleChangePassword = () => {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{5,16}$/g;
    setErrorMessage('');
    if (oldPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) {
      setErrorMessage('Error: Please fill out all fields');
      return;
    }
    if (!newPassword.match(passwordRegex)) {
      setErrorMessage('Error: Password must have a length between 6 and 16 characters and can only contain alphanumeric characters and the following characters: !?$%^*)(+=._-');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Error: The passwords do not match');
      return;
    }
    changePassword(oldPassword, newPassword)
      .then(() => setErrorMessage('Success: Passwords Changed Succcesfully'))
      .catch((e) => {
        if (e.message === 'invalid password') {
          setErrorMessage('Error: The old password is incorrect');
        } else {
          setErrorMessage('Error: Please Refresh the Page');
        }
      });
  };

  if (user === null) {
    return (
      <div>
        <p className="title">
          Settings
        </p>
        <p>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#E5E5E5' }}>
      <div style={{
        paddingTop: '30px',
        width: '60%',
        margin: 'auto',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: 'initial'
      }}>
        <div style={{
          paddingTop: '30px',
          marginLeft: '5%'
        }}>
          <div>
            <p style={{
              fontSize: '36px',
              fontWeight: 'bold'
            }}>
              Settings
            </p>
          </div>
          <div className="home-container">
            <div>
              <Title>
                My Details
              </Title>
              <div>
                <Avatar
                  src={
                    user.avatar
                  }
                />
                <p>
                  Profile Picture
                </p>
                <ReactS3Uploader signingUrl={'/api/s3/sign'}
                                 server={''}
                                 uploadRequestHeaders={{
                                   'x-amz-acl': 'private'
                                 }}
                                 accept={'image/*,video/*,audio/*'}
                                 preprocess={(file, next) => {
                                   if (file.size > 15728640) {
                                     alert('Error file larger than 15mb!');
                                     setImageUrl(null);
                                   } else {
                                     next(file);
                                   }
                                 }}
                                 onFinish={async (signResult, file) => {
                                   const fileType = getFileMimeType(file);
                                   if (fileType.startsWith('image')) {
                                     await changeAvatar('https://chitchat-cis557.s3.us-east-2.amazonaws.com/' + signResult.filename);
                                     setImageUrl('https://chitchat-cis557.s3.us-east-2.amazonaws.com/' + signResult.filename);
                                   }
                                 }}>
                </ReactS3Uploader>
                <p>
                  Username:
                  {' '}
                  <i>{user.username}</i>
                  {' '}
                </p>
                <p>
                  Registration Date:
                  {' '}
                  <i>{(new Date(user.registrationDate)).toLocaleDateString('en-US')}</i>
                  {' '}
                </p>
              </div>
            </div>
            <div>
              <Title>
                Actions
              </Title>
              {errorMessage.length > 0 ? <div>{errorMessage} </div> : null}
              <br/>
              <input id="old-password" type="password" placeholder="Old Password" style={{
                width: '250px',
                height: '36px',
                marginBottom: '10px'
              }}/>
              <br/>
              <input id="new-password" type="password" placeholder="New Password" style={{
                width: '250px',
                height: '36px',
                marginBottom: '10px'
              }}/>
              <br/>
              <input id="confirm-new-password" type="password" placeholder="Confirm New Password"
                     style={{
                       width: '250px',
                       height: '36px',
                       marginBottom: '10px'
                     }}/>
              <br/>
              <div>
                <button className="custom-button" onClick={handleChangePassword}>
                  Change Password
                </button>
              </div>
              <DeactivateButton/>
            </div>
          </div>
          <Link to={`/invites`}>
            View All my invitations
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;
