import React from 'react';
// import styled from 'styled-components';
import HomeGroups from './homeGroups';
import HomePosts from './homePosts';
import ProfileCard from './profileCard';
import { logout, useLoggedInUser } from '../../utils/backendUsers';
import MyGroupsWrapper from './myGroups';
import { useHistory } from 'react-router-dom';

const groups1 = [
  {
    name: 'team 22',
    avatar: `${process.env.PUBLIC_URL}/logo2.png`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, similique! Reprehenderit, eligendi nobis delectus nisi.'
  },
  {
    name: 'team 22',
    avatar: `${process.env.PUBLIC_URL}/logo3.jpeg`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, similique! Reprehenderit, eligendi nobis delectus nisi.'
  },
];

const groups2 = [
  {
    name: 'team 22',
    avatar: `${process.env.PUBLIC_URL}/logo4.png`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, similique! Reprehenderit, eligendi nobis delectus nisi.'
  },
  {
    name: 'team 22',
    avatar: `${process.env.PUBLIC_URL}/logo5.jpeg`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, similique! Reprehenderit, eligendi nobis delectus nisi.'
  },
];

const MainPage = () => {
  const user = useLoggedInUser();
  const history = useHistory();
  if (user === undefined) {
    logout()
      .then(() => history.push('/'));
    return;
  }
  if (user === null) {
    return (
      <div>
        <ProfileCard
          username="Loading"
          avatar={`${process.env.PUBLIC_URL}/portait.jpeg`}
        />
        <div className="home-containter">
          <div className="flex-item" style={{ width: '34%' }}>
            <HomePosts/>
          </div>

          <div className="flex-item" style={{ width: '33%' }}>
            <HomeGroups/>
          </div>

          <div className="flex-item" style={{ width: '33%' }}>
            <MyGroupsWrapper/>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <ProfileCard
        username={user.username}
        avatar={user.avatar}
      />
      <div className="home-containter">
        <div className="flex-item" style={{ width: '34%' }}>
          <HomePosts user={user}/>
        </div>

        <div className="flex-item" style={{ width: '33%' }}>
          <HomeGroups groups1={groups1} groups2={groups2}/>
        </div>

        <div className="flex-item" style={{ width: '33%' }}>
          <MyGroupsWrapper groups1={groups1} groups2={groups2}/>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
