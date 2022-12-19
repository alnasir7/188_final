/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import GroupCard from './groupCard';
import CreateGroup from '../common/createGroup';
import ModalContainer from '../common/ChitChatModal';
import { useMyGroups, useRecommendedGroups } from '../../utils/backendGroups';

const HomeGroupsContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

// const LoadMore = styled.span`
//   font-size: 20px;
//   font-weight: 500;
//   color: ${lightGrey};
//   height: 40px;
//   display: flex;
//   align-items: center;
// `;

// const TitleWrapper = styled.div`
// width:400px;
// margin: auto;
// margin-buttom: 20px;
// `;

const Title = styled.h1`
  font-size: 24px;
`;

// const styles = {
//   control: ({ background, ...base }) => ({
//     ...base,
//     boxShadow: 'none',
//     color: 'black',
//     background: miscGrey,
//     margin: 'auto',
//     marginTop: '10px',
//     borderRadius: '5px',
//   }),
//   option: ({ background, ...base }) => ({
//     ...base,
//   }),
//
//   singleValue: (base) => ({
//     ...base,
//     color: 'red',
//   }),
// };

// const ValueContainer = ({ children, ...props }) => {
//   const { getValue, hasValue } = props;
//   const nbValues = getValue().length;
//   if (!hasValue) {
//     return (
//       <components.ValueContainer {...props}>
//         {children}
//       </components.ValueContainer>
//     );
//   }
//   return (
//     <components.ValueContainer {...props}>
//       {nbValues === 1 ? 'One Item Selected' : `${nbValues} items selected`}
//     </components.ValueContainer>
//   );
// };

// const customeComponents = {
//   IndicatorSeparator: () => null,
//   ValueContainer,
// };

// const options = [
//   { value: 'Technology', label: 'Technology' },
//   { value: 'Music', label: 'Music' },
//   { value: 'Sports', label: 'Sports' },
//   { value: 'History', label: 'History' },
//   { value: 'Gaming', label: 'Gaming' },
//   { value: 'Physics', label: 'Physics' },
//   { value: 'Mental Health', label: 'Mental Health' },
//   { value: 'Work', label: 'Work' },
//   {
//     value: 'Travel',
//     label: 'Travel',
//   },
// ];

const MyGroups = ({ groups1 }) => {
  const [modal, changeModal] = useState(false);
  const [creation, publishCreation] = useState(false);

  const groups = useMyGroups([creation]);

  const handleOpenModal = () => {
    changeModal(true);
  };

  const handleCloseModal = () => {
    changeModal(false);
  };

  const handleCreation = () => {
    publishCreation(!creation);
    changeModal(false);
  };

  if (groups === null) {
    return (
      <div>
        <ModalContainer ModalState={modal} changeModal={changeModal} Content={CreateGroup}
                        contentProps={{
                          closeModal: handleCloseModal,
                          handleCreation: handleCreation
                        }}/>
        <Title>
          Your groups
        </Title>
        <br/>
        <div>
          <button type="button" className="custom-button" onClick={handleOpenModal}>
            Add a new group
          </button>
        </div>
        <br/>
        <div>
          Loading...
        </div>
      </div>
    );
  }

  if (groups === undefined) {
    return (
      <div>
        <ModalContainer ModalState={modal} changeModal={changeModal} Content={CreateGroup}
                        contentProps={{
                          closeModal: handleCloseModal,
                          handleCreation: handleCreation
                        }}/>
        <Title>
          Your groups
        </Title>
        <br/>
        <div>
          <button type="button" className="custom-button" onClick={handleOpenModal}>
            Add a new group
          </button>
        </div>
        <br/>
        <div>
          Please refresh the page
        </div>
      </div>
    );
  }

  console.log({ groups });
  return (
    <div>
      <ModalContainer ModalState={modal} changeModal={changeModal} Content={CreateGroup}
                      contentProps={{
                        closeModal: handleCloseModal,
                        handleCreation: handleCreation
                      }}/>
      <Title>
        Your groups
      </Title>
      <br/>
      <div>
        <button type="button" className="custom-button" onClick={handleOpenModal}>
          Add a new group
        </button>
      </div>
      <br/>
      {groups.length > 0
        ? (groups.map((group) => (
          <>
            {group &&
              <GroupCard
                group={group}
              />
            }
          </>
        )))
        : 'No groups found, add new groups'}
    </div>
  );
};

const RecommendedGroups = ({ groups2 }) => {

  const [refresh, publishRefresh] = useState(false);

  const handleRefresh = () => {
    publishRefresh(!refresh);
  };

  const groups = useRecommendedGroups([refresh]);

  if (groups === null) {
    return (
      <div>
        <Title>
          Suggested Groups
          <button type="button" className="custom-button" onClick={handleRefresh}
                  style={{ float: 'right' }}>
            Refresh
          </button>
        </Title>
        <div>
          Loading...
        </div>
      </div>
    );
  }

  if (groups === undefined) {
    return (
      <div>
        <Title>
          Suggested Groups
          <button type="button" className="custom-button" onClick={handleRefresh}
                  style={{ float: 'right' }}>
            Refresh
          </button>
        </Title>
        <div>
          Please refresh the page
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title>
        Suggested Groups
        <button type="button" className="custom-button" onClick={handleRefresh}
                style={{ float: 'right' }}>
          Refresh
        </button>
      </Title>
      {groups.length > 0
        ? (groups.map((group) => (
          <>
            <GroupCard
              group={group}
              key={group._id}
              notMember
            />
          </>
        )))
        : 'No groups found, add new groups'}
    </div>
  );
};

const MyGroupsWrapper = ({
  groups1,
  groups2
}) => {

  return (
    <div className="home-groups">
      <HomeGroupsContainer>
        <MyGroups groups1={groups1}/>
        <RecommendedGroups groups2={groups2}/>
      </HomeGroupsContainer>
    </div>
  );
};

export default MyGroupsWrapper;
