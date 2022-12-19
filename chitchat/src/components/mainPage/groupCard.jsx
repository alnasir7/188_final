/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { lightGrey, miscGrey } from '../../colors';
import { Link } from 'react-router-dom';
import { createRequest, useRequested } from '../../utils/backendInvitations';

const Avatar = styled.img`
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const ViewGroup = styled(Link)`
  font-size: 20px;
  font-weight: 500;
  color: ${lightGrey};
  height: 50px;
  display: flex;
  align-items: center;
`;

const GroupContainer = styled.div`
  border-radius: 15px;
  background-color: ${miscGrey};
  height: auto;
  overflow: hidden;
  cursor: pointer;
  width: 360px;
  padding: 4px 10px;
  padding-bottom: 0px;
  justify-content: center;
  margin-bottom: 20px;
  align-items: center;: auto;
}
`;

const Titlebar = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: row;
`;

const InfoDiv = styled.div`
  margin-bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 500;
  margin-left: 20px;
  max-width: 160px;
  color: black;
  @media screen and (max-width: 768px) {
    font-size: 13px;
    font-weight: 40;
  }
`;
const Text = styled.p`
  text-align: start;
  color: black;
  font-size: 12px;
  margin-top: 14px;
  margin-left: 0px;
  @media screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const PublicDiv = styled.p`
  text-align: start;
  color: black;
  font-size: 11px;
  margin-top: 0px;
  margin-left: 20px;
  @media screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const GroupCard = ({
  group,
  notMember
}) => {
  const [requested, publishRequested] = useState(false);
  const found = useRequested(group._id, [requested]);

  const handleRequest = async () => {
    await createRequest(group._id);
    publishRequested(!requested);
  };
  if (!notMember || found === null || found === undefined) {
    return (
      <GroupContainer>
        <Titlebar>
          <Avatar
            src={`${process.env.PUBLIC_URL}/logo2.png`}/>
          <InfoDiv>
            <Title>{group.name}</Title>
            <PublicDiv>
              {group.public ? 'Public' : 'Private'}
            </PublicDiv>
          </InfoDiv>
        </Titlebar><Text>
        {group.description}
      </Text>
        <div className="is-pulled-left is-clickable">
          <div>
            <ViewGroup to={`/group/${group._id.toString()}`}>View Group</ViewGroup>
          </div>
        </div>
      </GroupContainer>
    );
  }
  return (
    <GroupContainer>
      <Titlebar>
        <Avatar
          src={`${process.env.PUBLIC_URL}/logo2.png`}/>
        <InfoDiv>
          <Title>{group.name}</Title>
          <PublicDiv>
            {group.public ? 'Public' : 'Private'}
          </PublicDiv>
        </InfoDiv>
        {
          found.found
            ?
            <div style={{
              width: 'auto',
              flexGrow: '1'
            }}>
              <button type="button" style={{
                fontSize: '10px',
                background: 'grey',
                borderColor: 'grey',
                cursor: 'default',
                padding: 'none',
                marginBottom: 'none',
                float: 'right'
              }} className="custom-button">
                Requested
              </button>
            </div>
            :
            <div style={{
              width: 'auto',
              flexGrow: '1'
            }}>
              <button onClick={handleRequest} type="button" style={{
                fontSize: '10px',
                padding: 'none',
                marginBottom: 'none',
                float: 'right'
              }} className="custom-button">
                Request to Join
              </button>
            </div>
        }
      </Titlebar><Text>
      {group.description}
    </Text>
      <div className="is-pulled-left is-clickable">
        <div>
          <ViewGroup to={`/group/${group._id.toString()}`}>View Group</ViewGroup>
        </div>
      </div>
    </GroupContainer>
  );
};
export default GroupCard;
