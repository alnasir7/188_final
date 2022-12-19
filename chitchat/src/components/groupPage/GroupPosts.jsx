/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Pagination } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import ActionBar from './ActionBar';
import Post from '../common/post';
import '../../style/GroupPosts.css';
import { useGroup } from '../../utils/backendGroups';

const dummyposts = [
  {
    author: 'mohamed',
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
    likes: 21,
    comments: [1, 2, 3, 5],
    avatar: `${process.env.PUBLIC_URL}/logo192.png`,
    title: 'This is a post',
    id: 12,
  },
  {
    author: 'mohamed',
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
    likes: 21,
    comments: [1, 2, 3, 5],
    avatar: `${process.env.PUBLIC_URL}/logo192.png`,
    title: 'This is a post',
    id: 12,
  },
  {
    author: 'mohamed',
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
    ups: 13,
    downs: 21,
    comments: [1, 2, 3, 5],
    title: 'This is a post',
    image: `${process.env.PUBLIC_URL}/logo192.png`,
    avatar: `${process.env.PUBLIC_URL}/logo192.png`,
    tags: ['Tech', 'Finance', 'Art'],
    id: 12,
  },

];

function CurrentPosts({
  posts,
  setPage,
  numPerPage,
  total,
  user,
  publishChange
}) {
  if (posts.length === 0) {
    return (
      <div id="no-posts-error">
        <FrownOutlined id="search-fail-icon"/>
        <br/>
        No Posts Found
      </div>
    );
  }
  const postList = [];
  posts.forEach((p) =>
    postList.push(<Post className="group-post" post={p} user={user} publishChange={publishChange}/>
    ));
  return (
    <div>
      <div id="post-wrapper">
        {postList}
      </div>

      <div id="group-pagination">
        <Pagination
          defaultCurrent={1}
          pageSize={numPerPage}
          total={total}
          onChange={(page) => (setPage(page))}
        />
      </div>
    </div>
  );
}

function GroupPosts({
  memberStatus,
  groupName,
  user,
  groupId
}) {
  const [page, setPage] = useState(1);
  const [hashtags, setHashtags] = useState([]);
  const numPerPage = 5;
  const start = (page - 1) * numPerPage;
  const [change, setChange] = useState(false);
  const [err, setErr] = useState(false);
  const groupAndCount = useGroup(groupName, page, hashtags, [page, change, hashtags]);
  // const [fetchedPosts, setFetchedPosts] = useState([])
  // const { groupName } = useParams();
  // const fetchData = async() => {
  //   try {
  //   const res = await getPosts(groupName)
  //   setFetchedPosts(res)}
  //   catch(err) {
  //     setErr(err)
  //   }
  // }

  const publishChange = () => {
    setChange(!change);
  };

  // useEffect(() => {
  //     console.log('change');
  //     //make axios request here retrieve data and then setPosts here
  //     fetchData()
  // }, [page, hashtags])

  return (
    <>
      <div id="group-posts-wrapper">
        <ActionBar memberStatus={memberStatus} setHashtags={setHashtags}
                   publishChange={publishChange} groupId={groupId}/>
        {groupAndCount ?
          <CurrentPosts
            group={groupAndCount.group}
            posts={memberStatus === 'admin' || memberStatus === 'owner' ? groupAndCount.group.posts.map(p => {
              return {
                ...p,
                admin: true
              };
            }) : groupAndCount.group.posts}
            setPage={setPage}
            numPerPage={numPerPage}
            total={groupAndCount.postCnt}
            user={user}
            publishChange={publishChange}
          />
          :
          <div>Loading...</div>
        }
      </div>
    </>
  );
}

export default GroupPosts;
