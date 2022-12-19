import styled from 'styled-components';
import ChitChatButton from '../common/ChitChatButton';
import Conversation from './Conversation';
import ContactList from './ContactList';
import { useContacts } from '../../utils/backendMessages';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const Wrapper = styled.div`
  height: 100%;
  margin: 0 auto;
`;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80vh;
  overflow: hidden;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: xxx-large;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  flex: 1 1 auto;
`;

const MessagePage = () => {
  let contacts = useContacts() || [];
  const [selectedUser, selectUser] = useState(null);
  if (contacts[0] && !selectedUser) {
    selectUser(contacts[0]._id);
  }
  let history = useHistory();
  return (
    <Wrapper>
      <Container>
        <HeaderBar>
          <Title>
            Messages
          </Title>
          <NavSection>
            <ChitChatButton onClick={() => {
              history.push('/main');
            }}>
              Back Home
            </ChitChatButton>
          </NavSection>
        </HeaderBar>
        <hr/>
        <ContentWrapper>
          <ContactList contacts={contacts} selectedUser={selectedUser} selectUser={selectUser}/>
          {selectedUser && <Conversation user={selectedUser}/>}
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default MessagePage;
