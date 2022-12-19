import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  flex-basis: 400px;
  padding: 1em;
`;

const Header = styled.h2`
  font-size: xx-large;
`;

const TagList = styled.ul`
  font-size: x-large;
  text-align: right;
`;

const Tags = (props) => {
  const { tags } = props;
  return (
    <Wrapper>
      <Header>
        Related Tags
      </Header>
      <TagList>
        {tags.map((tag) => (
          <h3>
            {' '}
            {tag}
            {' '}
          </h3>
        ))}
      </TagList>
    </Wrapper>
  );
};

export default Tags;
