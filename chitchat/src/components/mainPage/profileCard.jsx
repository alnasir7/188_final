/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { clearNotifications, logout, useNotifications } from '../../utils/backendUsers';
import { Button, Dropdown, Menu } from 'antd';

// import { lightGrey } from '../../colors';

const Avatar = styled.img`
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid black;
`;

// const ViewProfile = styled.span`
//   font-size: 20px;
//   font-weight: 500;
//   color: ${lightGrey};
//   height: 50px;
//   display: flex;
//   align-items: center;
// `;

const Container = styled.div`
  height: auto;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  padding: 15px 45px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  align-items: center;: auto;
`;

const Titlebar = styled.div`
  padding: 0;
  display: flex;
  flex-direction: row;
`;

const InfoDiv = styled.div`
  margin-bottom: 0;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 500;
  margin-left: 20px;
  color: black;
  @media screen and (max-width: 768px) {
    font-size: 13px;
    font-weight: 40;
  }
`;

// const Username = styled.span`
//   font-size: 14px;
//   font-weight: 500;
//   margin-left: 20px;
//   color: grey;
//   @media screen and (max-width: 768px) {
//     font-size: 13px;
//     font-weight: 40;
//   }
// `;

// const Text = styled.p`
//   text-align: start;
//   color: black;
//   font-size: 12px;
//   margin-top: 14px;
//   margin-left: 60px;
//   @media screen and (max-width: 768px) {
//     font-size: 11px;
//   }
// `;

const Actions = styled.div`
  text-align: start;
  display: flex;
  flex-direction: column;
  color: black;
  font-size: 14px;

`;

function Notifications({
  notifications,
  deleteNotifications
}) {
  const notificationItems = [];

  notifications = notifications || ['fourth', 'third', 'second', 'first'];

  for (let i = notifications.length - 1; i >= 0; i--) {
    notificationItems.push(
      <Menu.Item key={i} className="drop-down-notification">
        {notifications[i]}
      </Menu.Item>
    );
  }

  const menu = (
    <Menu>
      {notificationItems}
      <Menu.Item key="clear" style={{ color: 'red' }} onClick={deleteNotifications}>
        Clear All Notification
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button className="drop-down-notification-btn">
        Notifications ({notifications.length})
      </Button>
    </Dropdown>
  );
}

const ProfileCard = ({
  avatar,
  username
}) => {
  const [clear, publishClear] = useState(false);
  const notifications = useNotifications([clear]);
  let history = useHistory();
  const handleLogout = async () => {
    await logout();
    history.push('/');
  };
  const handleSetting = () => {
    history.push('/settings');
  };
  const handleMessage = () => {
    history.push('/messages');
  };

  const deleteNotifications = async () => {
    await clearNotifications();
    publishClear(!clear);
  };

  return (
    <Container>
      <Titlebar>
        <Avatar
          src={
            avatar
          }
        />
        <InfoDiv>
          <Title>{username}</Title>
          {/* <Username>{username}</Username> */}
        </InfoDiv>
      </Titlebar>
      <Actions>
        <div>
          <button type="button" className="custom-button" style={{ width: '180px' }}
                  onClick={handleLogout}>
            Log out
          </button>
        </div>
        <div>
          <button type="button" className="custom-button" style={{ width: '180px' }}
                  onClick={handleSetting}>
            Settings
          </button>
        </div>
        <div>
          <button type="button" className="custom-button" style={{ width: '180px' }}
                  onClick={handleMessage}>
            Messages
          </button>
        </div>
        <div>
          <Notifications notifications={notifications} deleteNotifications={deleteNotifications}/>
        </div>
      </Actions>
    </Container>
  );
};

export default ProfileCard;
