import styled from 'styled-components';
import { readMessage } from '../../utils/backendMessages';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60%;
  align-self: ${({ incoming }) => (incoming ? 'start' : 'end')};
`;

const SpeechBubbleContainer = styled.div`
  padding: 5px 10px;
  flex-grow: 1;
  border-radius: 25px;
  background-color: ${({ incoming }) => (incoming ? '#c4c4c4' : '#DEBD96')};
`;

const StatusContainer = styled.div`
  font-size: small;
  display: flex;
  justify-content: flex-end;
`;

const getStatus = (message) => {
  const {
    notFromServer,
    read,
  } = message;
  if (read) {
    return 'Read';
  }
  if (notFromServer) {
    return 'Sent';
  }
  return 'Delivered';
};

const SpeechBubble = (props) => {
  const {
    message,
    incoming
  } = props;
  if (incoming && !message.read) {
    message.read = true;
    readMessage(message._id);
  }
  return (
    <Wrapper incoming={incoming}>
      <SpeechBubbleContainer incoming={incoming}>
        {message.body}
      </SpeechBubbleContainer>
      {message.img && <img src={message.img} alt={'attachment'}/>}
      {message.video && <video controls>
        <source src={message.video}/>
      </video>}
      {message.audio && <audio controls>
        <source src={message.audio}/>
      </audio>}
      <StatusContainer>
        {getStatus(message)}
      </StatusContainer>
    </Wrapper>
  );
};

export default SpeechBubble;
