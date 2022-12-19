import React, { useState } from 'react';
import { useLoggedInUser } from '../../utils/backendUsers';
import { changeAdmin, leaveGroup, useGroupById } from '../../utils/backendGroups';
import { useHistory, useParams } from 'react-router-dom';
import {
  approve,
  handle_request,
  invite,
  useInvitations,
  useRequests
} from '../../utils/backendInvitations';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 20px;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InputField = styled.div`
  padding: 10px;
  margin-top: 10px;
`;

function getMemberStatus(group, user) {
  if (!group) {
    console.log('no group');
    return 'notJoined';
  }
  const status = user.groups.filter((g) => g.group.name === group.group.name)[0];
  if (status) {
    if (status.group.owner.toString() === user._id.toString()) {
      return 'owner';
    }
    if (status.admin) {
      return 'admin';
    }
    return 'member';
  }
  return 'notJoined';
}




const sampleNewUser = {
  id: 45678234,
  username: 'newUser',
  groups: ['not an actual group45675676787787'],
};

const GroupSettingsPage = () => {

  const [memberStatus, setMemberStatus] = useState('initial');
  const [toInvite, setToInvite] = useState(null);
  const [toPromote, setToPromote] = useState(null);
  const [promotionError, setPromotionError] = useState(null);
  const [inviteError, setInviteError] = useState(null);
  const [approveError, setApproveError] = useState(null);
  const [handleError, setHandleError] = useState(null);
  const [leaveError, setLeaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { groupName } = useParams();
  let group = 'placeholder';
  const history = useHistory();
  group = useGroupById(groupName);
  const groupInvitations = useInvitations(groupName, []);
  const groupRequests = useRequests(groupName, []);
  const user = useLoggedInUser() || sampleNewUser;

  if (group === undefined) {
    history.push('/main');
  }
  if (group === 'placeholder' || group === null) {
    return (<div>Loading..</div>);
  } else if (memberStatus === 'initial') {
    setMemberStatus(getMemberStatus(group, user));
    return (<div>Loading..</div>);
  }

  if (memberStatus === 'notJoined') {
    history.push('/main');
    return;
  }

  const handleOnInviteChange = (e) => {
    setInviteError(null);
    setToInvite(e.target.value);
  };

  const handleOnPromotChange = (e) => {
    setPromotionError(null);
    setToPromote(e.target.value);
  };

  const handleInvite = async () => {
    try {
      await invite(groupName, toInvite);
      setToInvite('');
      setSuccessMessage('Changes made successfully, please refresh the page to see updates');
    } catch (err) {
      console.log(err.message);
      setInviteError(err && err.message ? err.message : 'An error occured while inviting user, check the username again');
      setToInvite('');
    }
  };

  const handlePromote = async () => {
    try {
      await changeAdmin(group.group.name, toPromote);
      setToPromote('');
      setSuccessMessage('Changes made successfully, please refresh the page to see updates');
    } catch (err) {
      setPromotionError(err && err.message ? err.message : 'An error occured while changing status, check the username again');
      setToPromote('');
    }
  };

  const handleRequest = async (id, accept) => {
    try {
      await handle_request(id, accept);
      setSuccessMessage('Changes made successfully, please refresh the page to see updates');
    } catch (err) {
      setHandleError(err && err.message ? err.message : 'An error occured while changing status, check the username again');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approve(id);
      setSuccessMessage('Changes made successfully, please refresh the page to see updates');
    } catch (err) {
      setApproveError(err && err.message ? err.message : 'An error occured while changing status, check the username again');
    } 
  };

  const leave = async () => {
    try {
      await leaveGroup(group.group.name);
      history.push('/main');
    } catch (err) {
      setLeaveError(err && err.message ? err.message : 'An error occured while changing status, check the username again');
    }
  };

  return <Wrapper>
    { memberStatus !== 'owner' ?
      (<button onClick={leave} className="button is-danger" style={{
      position: 'absolute',
      top: '60px',
      right: '20px'
    }}>
      Leave group
    </button>) : null}
    {leaveError &&
      <span className="is-danger" style={{
        position: 'absolute',
        top: '60px',
        right: '200px'
      }}>
        {leaveError}
      </span>}
    <Title>
      <div>
        <h1>
          Settings for " {group.group.name} "
        </h1>
      </div>
    </Title>
    <div className="card" style={{ padding: '40px', borderRadius: '0px', boxShadow: 'none' }}>
      <Content>
          {successMessage && 
          <div className="tag is-success" style = {{fontSize:"24px", margin:"20px"}}>
          <h1 style ={{color:"white"}}>
            {successMessage}
          </h1>
          </div>
          }
        {(!group.group.public) &&
          <InputField>
            <input className="input" style={{ width: '50%' }} type="text" value={toInvite}
                   onChange={handleOnInviteChange}
                   placeholder="type a member username to invite..."/>
            <button className="custom-button" onClick={handleInvite} style={{
              marginLeft: '20px',
              borderRadius: '4px'
            }}>Invite to group
            </button>
            <div>
              {inviteError && <span style={{
                marginTop: '10px',
                color: 'red'
              }}>{inviteError}</span>}
            </div>
          </InputField>
        }
        {(memberStatus === 'admin' || memberStatus === 'owner') &&
          <>
            <>
              <InputField>
                <input className="input" style={{ width: '50%' }} type="text" value={toPromote}
                       onChange={handleOnPromotChange}
                       placeholder="type a member username to change their admin status..."/>
                <button className="custom-button" onClick={handlePromote} style={{
                  marginLeft: '20px',
                  borderRadius: '4px'
                }}>change admins status
                </button>
                <div>
                  {promotionError && <span style={{
                    marginTop: '10px',
                    color: 'red'
                  }}>{promotionError}</span>}
                </div>
              </InputField>
            </>
            <>
              {
                groupInvitations ?
                  <>
                    <h1 style={{
                      margin: '25px 0px',
                      fontSize: '24px'
                    }}>
                      All invitations to this group
                    </h1>
                    <div className="table-container">
                      <table className="table">

                        {groupInvitations.map(item => {
                          if (!item.receiver || item.approved == null || !item._id) {
                            return null;
                          }
                          return <>
                            <tr>
                              <td>
                                {item.receiver.username}
                              </td>
                              <td>
                                {item.approved ? 'approved' :
                                  <button onClick={() => handleApprove(item._id)}
                                          className="is-success button">
                                    Approve
                                  </button>}
                              </td>
                              {approveError &&
                                <td>
                                  <span style={{
                                    marginTop: '10px',
                                    color: 'red'
                                  }}>{approveError}</span>
                                </td>
                              }

                            </tr>
                          </>;
                        })}
                      </table>
                    </div>
                  </> :
                  <>
                    <div style={{ marginTop: '20px' }}>
                      {'No invitations for you to handle'}
                    </div>
                  </>
              }
              {
                groupRequests ?
                  <>
                    <h1 style={{
                      margin: '25px 0px',
                      fontSize: '24px'
                    }}>
                      All requests to this group
                    </h1>
                    <div className="table-container">
                      <table className="table">

                        {groupRequests.map(item => {
                          if (!item.sender || !item._id) {
                            return null;
                          }
                          return <>
                            <tr>
                              <td>
                                {item.sender.username}
                              </td>
                              <td>
                                <button onClick={() => handleRequest(item._id, true)}
                                        className="is-success button">
                                  Approve
                                </button>
                              </td>
                              <td>
                                <button onClick={() => handleRequest(item._id, false)}
                                        className="is-danger button">
                                  Decline
                                </button>
                              </td>
                              {handleError &&
                                <td>
                                  <span style={{
                                    marginTop: '10px',
                                    color: 'red'
                                  }}>{handleError}</span>
                                </td>
                              }
                            </tr>
                          </>;
                        })}
                      </table>
                    </div>
                  </> :
                  <>
                    {'No requests for you to handle'}
                  </>
              }
            </>
          </>

        }
      </Content>
    </div>

  </Wrapper>;
};

export default GroupSettingsPage;
