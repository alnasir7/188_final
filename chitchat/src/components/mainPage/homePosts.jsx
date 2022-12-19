/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Post from '../common/post';
import { useFeed } from '../../utils/backendGroups';

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

// const dummyposts = [
//   {
//     author: 'mohamed',
//     text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
//     ups: 13,
//     downs: 21,
//     comments: [{ user: { pfp: `${process.env.PUBLIC_URL}/portait.jpeg` }, text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.' }],
//     title: 'This is a post',
//     image: `${process.env.PUBLIC_URL}/background.jpeg`,
//     avatar: `${process.env.PUBLIC_URL}/logo192.png`,
//     detailed: true,
//     tags: ['Tech', 'Finance', 'Art'],
//   },
//   {
//     author: 'mohamed',
//     text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
//     likes: 21,
//     comments: [{ user: { pfp: `${process.env.PUBLIC_URL}/background.jpeg` }, text: 'ballaala' }],
//     avatar: `${process.env.PUBLIC_URL}/logo192.png`,
//     title: 'This is a post',
//   },
//   {
//     author: 'mohamed',
//     text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti laudantium facilis, cupiditate vero officia explicabo quos sed corrupti nobis facere odit perspiciatis quae itaque aspernatur pariatur voluptate. Rem, veniam nihil.',
//     likes: 21,
//     comments: [{ user: { pfp: `${process.env.PUBLIC_URL}/background.jpeg` }, text: 'ballaala' }],
//     avatar: `${process.env.PUBLIC_URL}/logo192.png`,
//     title: 'This is a post',
//   },
// ];

// const AddWrapper = styled.div`
// margin-left:20px;
// cursor:pointer;
// display:inline-block;
// `;

const HomePosts = ({user}) => {
  const posts = useFeed();

  if (posts === null) {
    return (
      <div className="home-posts" style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '400px',
          margin: 'auto',
          marginBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '24px',
            display: 'inline-block'
          }} className="home-title">
            My Feed
          </h1>
        </div>
        <span>Loading...</span>
      </div>
    );
  }
  return (
    <div className="home-posts" style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '400px',
        margin: 'auto',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '24px',
          display: 'inline-block'
        }} className="home-title">
          My Feed
        </h1>
      </div>
      {(posts && posts.length > 0)
        ? posts.map((post) => <Post post={post} user={user} key={post._id}/>)
        : <span> Your groups have no posts</span>}
    </div>

  );
};

export default HomePosts;
