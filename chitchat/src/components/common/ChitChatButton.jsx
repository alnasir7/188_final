import styled from 'styled-components';
import { Button as AntButton } from 'antd';

// eslint-disable-next-line react/jsx-props-no-spreading
const ChitChatButton = styled((props) => <AntButton {...props} />)`
  color: black;
  background-color: #feaa48;
  border: black;
  border-radius: 20px;

  &:hover {
    background-color: #f4b56b;
    color: black;
  }
`;

export default ChitChatButton;
