import styled from 'styled-components';
import { Input } from 'antd';
import ChitChatButton from '../common/ChitChatButton';
import SpeechBubble from './SpeechBubble';
import { sendMessage, useMessages } from '../../utils/backendMessages';
import { useRef, useState } from 'react';
import ReactS3Uploader from 'react-s3-uploader';

const mime = require('mime-types');

function getFileMimeType(file) {
  return file.type || mime.lookup(file.name);
}

const { TextArea } = Input;

const ConversationWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background-color: #dedede;
  justify-content: flex-end;
  border-radius: 25px;
  height: 100%;
  width: 100%;
  padding: 10px 20px;
  overflow-y: hidden;
`;

const MessageListContainer = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: column-reverse;
  min-height: 0;
  overflow-y: auto;
`;

const NewMessageContainer = styled.div`
  flex: 0 1 content;
  display: flex;
  flex-direction: row;
  margin: 10px;
  justify-content: space-around;
`;

const Spacer = styled.div`
  width: 12px;
`;

const Conversation = (props) => {
  const inputBox = useRef(null);
  const [messages, setMessages] = useState(null);
  const [attachedImageUrl, setImageUrl] = useState(null);
  const [attachedAudioUrl, setAudioUrl] = useState(null);
  const [attachedVideoUrl, setVideoUrl] = useState(null);
  const { user } = props;
  const messagesFromBackend = useMessages(user);
  if (messagesFromBackend && (messages !== messagesFromBackend) && (!messages || messages.length <= messagesFromBackend.length
    || (messages[0].sender !== user && messages[0].receiver !== user))) {
    setMessages(messagesFromBackend);
  }
  const messageContainer = useRef(null);
  const send = async () => {
    const text = inputBox.current.resizableTextArea.props.value;
    const newMessage = {
      receiver: user,
      body: text,
      ...(attachedImageUrl && { img: attachedImageUrl }),
      ...(attachedAudioUrl && { audio: attachedAudioUrl }),
      ...(attachedVideoUrl && { video: attachedVideoUrl }),
    };
    const result = await sendMessage(newMessage);
    setMessages([result, ...messages]);
    messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
  };
  if (messageContainer.current) {
    messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
  }
  return (
    <ConversationWrapper>
      {user && messages &&
        <MessageListContainer ref={messageContainer}>
          {messages.map(
            (message) => <SpeechBubble message={message} incoming={message.sender === user}
                                       key={message._id}/>,
          )}
        </MessageListContainer>
      }
      <NewMessageContainer>
        <ReactS3Uploader signingUrl={'/api/s3/sign'}
                         server={''}
                         uploadRequestHeaders={{
                           'x-amz-acl': 'private'
                         }}
                         accept={'image/*,video/*,audio/*'}
                         preprocess={(file, next) => {
                           if (file.size > 15728640) {
                             alert('file larger than 15mb!');
                             setImageUrl(null);
                             setVideoUrl(null);
                             setAudioUrl(null);
                           } else {
                             next(file);
                           }
                         }}
                         onFinish={(signResult, file) => {
                           const fileType = getFileMimeType(file);
                           if (fileType.startsWith('image')) {
                             setImageUrl('https://chitchat-cis557.s3.us-east-2.amazonaws.com/' + signResult.filename);
                             setVideoUrl(null);
                             setAudioUrl(null);
                           } else if (fileType.startsWith('video')) {
                             setVideoUrl('https://chitchat-cis557.s3.us-east-2.amazonaws.com/' + signResult.filename);
                             setImageUrl(null);
                             setAudioUrl(null);
                           } else if (fileType.startsWith('audio')) {
                             setAudioUrl('https://chitchat-cis557.s3.us-east-2.amazonaws.com/' + signResult.filename);
                             setImageUrl(null);
                             setVideoUrl(null);
                           }
                         }}>
        </ReactS3Uploader>
        <TextArea autoSize ref={inputBox}/>
        <Spacer/>
        <ChitChatButton onClick={send}> Send </ChitChatButton>
      </NewMessageContainer>
    </ConversationWrapper>
  );
};

export default Conversation;
