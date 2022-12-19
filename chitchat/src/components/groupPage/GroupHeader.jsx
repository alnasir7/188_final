/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import 'antd/dist/antd.css';
import '../../style/GroupHeader.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const showConfirmLeave = ((leaveGroup) => {
  confirm({
    title: 'Are you sure you want to leave this group?',
    icon: <ExclamationCircleOutlined/>,
    content: 'All group privileges will be lost. If you wish to rejoin the group, you will have to request to join again or be invited.',
    onOk() {
      leaveGroup();
    },
    onCancel() {
    },
  });
});

function StatusButton({
  memberStatus,
  setMemberStatus
}) {
  function RequestButton() {
    const handleClick = (() => {
      setMemberStatus('requested');
    });
    return (

      <Button className="request" onClick={handleClick} size="small" shape="round" type="primary">
        Request to Join
      </Button>
    );
  }

  function LoadingButton() {
    return (
      <Button className="loading" size="small" shape="round" type="primary" loading="true">
        Loading
      </Button>
    );
  }

  function AlreadyRequested() {
    return (
      <Button className="requested" size="small" shape="round" type="primary" disabled="true">
        <CheckCircleOutlined/>
        Request Sent
      </Button>
    );
  }

  function LeaveButton() {
    const leaveGroup = (() => setMemberStatus('notJoined'));
    return (
      <Button className="leave" onClick={() => showConfirmLeave(leaveGroup)} size="small"
              shape="round" type="primary">
        Leave Group
      </Button>
    );
  }

  function GroupSettingsButton() {
    const { groupName } = useParams();
    return (
      <Link to={`/groupSettings/${groupName}`}>
        <Button className="settings" size="small" shape="round" type="primary">
          <SettingOutlined/>
          Group Preferences
        </Button>
      </Link>
    );
  }

  console.log(memberStatus);
  switch (memberStatus) {
    case 'notJoined':
      return <RequestButton/>;
    case 'requested':
      return <AlreadyRequested/>;
    case 'loading':
      return <LoadingButton/>;
    case 'member':
      return <GroupSettingsButton/>;
    case 'admin':
      return <GroupSettingsButton/>;
    case 'owner':
      return <GroupSettingsButton/>;
    default:
      return null;
  }
}

function GroupHeader({
  group,
  memberStatus,
  setMemberStatus
}) {
  let g = group.group;
  let banner;
  let icon;
  const title = g.name;
  const count = g.memberCount;
  const privacy = g.public ? 'Public' : 'Private';
  if (!g || !g.banner) {
    banner = '/default/defaultBanner.png';
  } else {
    banner = g.banner;
  }
  if (!g || !g.icon) {
    icon = '/default/defaultIcon.png';
  } else {
    icon = g.icon;
  }
  return (
    <div className="headerWrapper">
      <div className="banner" style={{ backgroundImage: `url('${banner}')` }}>
        <img className="icon" src={icon} alt="icon"/>
      </div>
      <div className="groupTitle">
        {title}
      </div>
      <div className="count">
        {privacy}
        {' '}
        Group
        {' '}
        •
        {' '}
        {count}
        {' '}
        members
      </div>
      <StatusButton id="status-button" memberStatus={memberStatus}
                    setMemberStatus={setMemberStatus}/>
      <hr className="line"/>
    </div>
  );
}

export default GroupHeader;
