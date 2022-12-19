/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import styled from 'styled-components';

const Remove = styled.img`
  position: absolute;
  top: 10px;
  right: 0.5px;
  width: 12px;
  height: 12px;
  cursor: pointer;
`;

export const Tag = styled.span`
  margin: 0 4px 7px 0;
  font-weight: 300;
  padding: 30px;
  position: relative;

  &.tag {
    color: black;
    background: ${(props) => props.colors};
    white-space: normal;
    display: inline-block;
    height: auto;
    padding-top: 0.1em;
    padding-bottom: 0.1em;
    border-radius: 5px;
  }
`;

const Tags = ({
  tags,
  colors,
  removable,
  removeTag,
}) => (
  <div>
    {tags.map((tag) => (
      <span>
        <Tag colors={colors || 'white'} className="tag is-small" key={tag}>
          {tag}
          {removable && <Remove src={`${process.env.PUBLIC_URL}/icons/x.svg`} onClick={() => {
            removeTag(tag);
          }} alt="plus"/>}
        </Tag>
      </span>
    ))}
  </div>
);

export default Tags;
