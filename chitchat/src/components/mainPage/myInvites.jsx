import React, { useState } from 'react';
import { handle_invite, useMyInvitations } from '../../utils/backendInvitations';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 20px;
  height: 100%
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

// const InputField = styled.div`
// padding: 10px;
// margin-top: 10px;
// `

const MyInvites = () => {

  const invites = useMyInvitations([]);

  const [handleError, setHandleError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInvite = async (id, accept) => {
    try {
      await handle_invite(id, accept);
      setSuccessMessage('Changes made successfully, please refresh the page to see updates');
    } catch (err) {
      setHandleError(err && err.message ? err.message : 'some error occured');
    }
  };

  return <Wrapper>

    <Title>
      <div>
        <h1>
          View and handle all your current invites
        </h1>
      </div>
    </Title>
    <div className="card" style={{ padding: '40px' }}>
      <Content>
      {successMessage && 
          <div className="tag is-success" style = {{fontSize:"24px", margin:"20px"}}>
          <h1 style ={{color:"white"}}>
            {successMessage}
          </h1>
          </div>
      }
        <div className="table-container">
          {invites ?
            <table className="table">
              {invites.map(item => {
                if (!item.group || !item._id) {
                  return null;
                }
                return <>
                  <tr>
                    <td>
                      {item.group.name}
                    </td>
                    <td>
                      <button onClick={() => handleInvite(item._id, true)}
                              className="is-success button">
                        Approve
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleInvite(item._id, false)}
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
            </table> :
            <h1>
              Nothing to do here
            </h1>

          }
        </div>


      </Content>
    </div>

  </Wrapper>;
};

export default MyInvites;
