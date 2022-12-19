/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ModalContainer from '../common/ChitChatModal';
import CreatePost from '../common/createPost';
import '../../style/ActionBar.css';

function SearchBar({ setHashtags }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const val = document.getElementById('search-bar-input').value;
    if (val) {
      console.log(val);
      setHashtags(val.split(' '));
    }
  };
  return (
    <form className="search-bar" onSubmit={(e) => handleSubmit(e)}>
      <SearchOutlined className="search-icon"/>
      <input id="search-bar-input" className="search-bar-input" type="text"
             placeholder="Search Posts by Hashtags"/>
    </form>
  );
}

// function FilterDropDown({ setOrder }) {
//
//   const menu = (
//     <Menu>
//       <Menu.Item key="1" onClick={() => alert('Sort by Recent Date')}>
//         Recent
//       </Menu.Item>
//       <Menu.Item key="2" onClick={() => alert('Sort by Most Likes')}>
//         Popular
//       </Menu.Item>
//       <Menu.Item key="3" onClick={() => alert('Sort by Most Flags for Deletion')}>
//         Controversial
//       </Menu.Item>
//     </Menu>
//   );
//   return (
//
//     <Dropdown overlay={menu}>
//       <Button className="drop-down-btn">
//         Filter by
//         {' '}
//         <DownOutlined />
//       </Button>
//     </Dropdown>
//
//   );
// }

function AddPostButton({ handleOpenModal }) {
  return (
    <Button className="add-post-btn" onClick={() => {
      handleOpenModal();
    }} icon={<PlusOutlined/>} type="primary">
      Add Post
    </Button>
  );
}

function ActionBar({
  memberStatus,
  setHashtags,
  publishChange,
  groupId
}) {
  const [modal, changeModal] = useState(false);

  const handleOpenModal = () => {
    changeModal(true);
  };

  return (
    <div className="action-bar">
      <ModalContainer ModalState={modal} changeModal={changeModal} Content={CreatePost}
                      contentProps={{
                        changeModal,
                        groupId,
                        publishChange: publishChange
                      }}/>
      {/* <FilterDropDown setOrder={setOrder} /> */}
      <SearchBar setHashtags={setHashtags}/>
      {(memberStatus === 'member' || memberStatus === 'admin' || memberStatus === 'owner') ?
        <AddPostButton handleOpenModal={handleOpenModal}/> : null}
    </div>
  );
}

export default ActionBar;
