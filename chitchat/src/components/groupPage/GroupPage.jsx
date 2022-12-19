/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import GroupHeader from './GroupHeader';
import ActionBar from './ActionBar';
import GroupPosts from './GroupPosts';
import { Redirect, Link, useHistory } from 'react-router-dom';
import About from './About';
import '../../style/GroupPage.css';
import { useGroup, useGroupById } from '../../utils/backendGroups';
import { useParams } from 'react-router-dom';
import { useLoggedInUser } from '../../utils/backendUsers';

const sampleOwner = {
  id: 567890,
  username: 'owner',
  groups: [{ admin: true, owner: true, title: 'Sample Group' }],
};

const sampleNewUser = {
  id: 45678234,
  username: 'newUser',
  groups: ['Sample Group'],
};

const sampleGroup = {
  id: 253465665643,
  name: 'Sample Group',
  owner: 'owner',
  admin: ['owner'],
  members: ['owner', 'newUser'],
  public: true,
  description: 'This is a sample description for the about page. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel lacus rutrum, viverra sapien nec, mollis ex. Vestibulum ac sem sed nibh sodales dignissim vel id turpis. Praesent quis nibh neque. Curabitur lacinia, ex lacinia condimentum auctor, odio sapien blandit mauris, at rhoncus nisi sem laoreet urna. Praesent sit amet purus ut mauris cursus mattis maximus id nisl. Proin lectus ex, euismod et cursus et, sollicitudin finibus mauris. Quisque eget nunc risus. Vestibulum aliquam sapien eu nisi scelerisque aliquam. Donec a tempus eros, nec consequat nunc. Donec pellentesque purus in rutrum porttitor. Nullam at quam ex. Integer dignissim ipsum ut enim interdum gravida. Praesent vel dui iaculis, gravida lectus et, semper nisi. Mauris venenatis odio urna, in sollicitudin purus rhoncus lacinia.',
};

function getMemberStatus(group, user) {
  if (!group) {
    console.log('no group');
    return 'notJoined';
  }
  const status = user.groups.filter((g) => g.group && g.group.name === group.group.name)[0];
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

function GroupPage() {
  const { groupName } = useParams();
  //const group = useGroup(groupName) || sampleGroup;
  //const group = useGroupById(groupName) || sampleGroup;
  let group = "placeholder";
  const history = useHistory();
  group = useGroupById(groupName);
  const user = useLoggedInUser() || sampleNewUser;

  // const [loading, setLoading] = useState(false)

  const [memberStatus, setMemberStatus] = useState('initial');

  // useEffect(()=>{
  //   async function retrieveMemberStatus(group, user) {
  //     const status = await getMemberStatus(group, user)
  //     console.log(`here: ${status}`);
  //     return status
  //   };
  //   retrieveMemberStatus(group, user).then((status) => setMemberStatus(status));
  // },[group])

  if (group === undefined) {
    history.push('/main');
  }
  if (group === "placeholder" || group === null) {
    return (<div>Loading..</div>);
  } else if (memberStatus === 'initial') {
      setMemberStatus(getMemberStatus(group, user));
      return (<div>Loading..</div>);
  }


  if (!(group && group.group && (group.group.public || memberStatus !== 'notJoined'))) {
    history.push('/main');
    return (<div>Loading..</div>);
  }


  return (
    <>    <div className="group-wrapper">
      <GroupHeader
        memberStatus={memberStatus}
        setMemberStatus={setMemberStatus}
        group={group}
      />
      <About group={group} />
      <GroupPosts groupName={group.group.name} groupId={groupName}  memberStatus={memberStatus} />
    </div>
    </>
  );
}

export default GroupPage;
