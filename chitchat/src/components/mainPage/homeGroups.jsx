/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import GroupCard from './groupCard';
import { lightGrey } from '../../colors';
import AddTags from '../common/addTags';
import { useUserGroups } from '../../utils/backendGroups';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const HomeGroupsContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

const LoadMore = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: ${lightGrey};
  height: 40px;
  display: flex;
  align-items: center;
`;

const TitleWrapper = styled.div`
  width: 400px;
  margin: auto;
  margin-buttom: 20px;
`;

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

function FilterDropDown({
  setOrder,
  order
}) {
  let message = order;
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setOrder('recent')}>
        Recent Activity
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setOrder('posts')}>
        Number of Posts
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setOrder('members')}>
        Number of Members
      </Menu.Item>
    </Menu>
  );
  if (message === '') {
    message = 'Filter by';
  } else if (message === 'members') {
    message = 'Number of Members';
  } else if (message === 'posts') {
    message = 'Number of Post';
  } else if (message === 'recent') {
    message = 'Recent Activity';
  }
  return (
    <Dropdown overlay={menu}>
      <Button className="drop-down-btn">
        {message}
        <DownOutlined/>
      </Button>
    </Dropdown>
  );
}

const HomeGroups = () => {
  const [tags, setTags] = useState([]);
  const [order, setOrder] = useState('');
  const [expandedView, setExpandedView] = useState(false);

  const groups = useUserGroups(tags, order);

  if (groups === null) {
    return (
      <div className="home-groups">
        <TitleWrapper style={{
          width: '400px',
          margin: 'auto',
          marginBottom: '20px'
        }}>
          <Title>
            Public Groups
          </Title>
          <br/>
          <div style={{ height: '40px' }}>
            Search by Tags
            <FilterDropDown style={{ float: 'right' }} setOrder={setOrder} order={order}/>
          </div>
          <AddTags tags={tags} setTags={setTags}/>
        </TitleWrapper>
        <div>
          Loading...
        </div>
      </div>
    );
  }

  if (groups === undefined) {
    return (
      <div className="home-groups">
        <TitleWrapper style={{
          width: '400px',
          margin: 'auto',
          marginBottom: '20px'
        }}>
          <Title>
            Public Groups
          </Title>
          <br/>
          <div style={{ height: '40px' }}>
            Search by Tags
            <FilterDropDown style={{ float: 'right' }} setOrder={setOrder} order={order}/>
          </div>
          <AddTags tags={tags} setTags={setTags}/>
        </TitleWrapper>
        <div>
          Please Refresh the Page
        </div>
      </div>
    );
  }

  if (groups.length < 1) {
    return (
      <>
        <div className="home-groups">
          <TitleWrapper style={{
            width: '400px',
            margin: 'auto',
            marginBottom: '20px'
          }}>
            <Title>
              Public Groups
            </Title>
            <br/>
            <div style={{ height: '40px' }}>
              Search by Tags
              <FilterDropDown style={{ float: 'right' }} setOrder={setOrder} order={order}/>
            </div>
            <AddTags tags={tags} setTags={setTags}/>
          </TitleWrapper>
        </div>
        <div>
          There are no groups. Create the first one.
        </div>
      </>
    );
  }

  return (
    <div className="home-groups">
      <TitleWrapper style={{
        width: '400px',
        margin: 'auto',
        marginBottom: '20px'
      }}>
        <Title>
          Public Groups
        </Title>
        {/* <Select
          isMulti
          hideSelectedOptions={false}
          components={customeComponents}
          styles={styles}
          onChange={handleTagChange}
          name="colors"
          options={options}
          placeholder="Filter by Tags"
          className="basic-multi-select"
          classNamePrefix="select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: orange,
            },
          })}
        /> */}
        <br/>
        <div style={{ height: '40px' }}>
          Search by Tags
          <FilterDropDown style={{ float: 'right' }} setOrder={setOrder} order={order}/>
        </div>
        <AddTags tags={tags} setTags={setTags}/>
      </TitleWrapper>
      {expandedView || groups.length <= 10
        ? (
          <HomeGroupsContainer>
            {groups.map((group) => (
              <>
                <GroupCard
                  group={group}
                  key={group._id}
                  notMember
                />
              </>
            ))}
          </HomeGroupsContainer>
        ) :
        <HomeGroupsContainer>
          {groups.slice(0, 10)
            .map((group) => (
              <>
                <GroupCard
                  group={group}
                  key={group._id}
                  notMember
                />
              </>
            ))}
          <div className="is-pulled-right is-clickable">
            <div>
              <LoadMore onClick={() => setExpandedView(true)}>Load More ...</LoadMore>
            </div>
          </div>
        </HomeGroupsContainer>}
    </div>
  );
};

export default HomeGroups;
