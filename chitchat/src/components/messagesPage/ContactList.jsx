import styled from 'styled-components';
import { orange } from '../../colors';

const ContactListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 30vh;
  overflow-y: auto;
  background-color: #dedede;
  border-radius: 25px;
  padding: 10px;
  margin-right: 15px;
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-style: solid;
  border-color: #feaa48;
  border-width: 2px;
  border-radius: 25px;
  background-color: ${props => props.selected ? orange : 'white'};
  margin: 5px 0;
`;

const AvatarContainer = styled.div`
  margin: 12px;
`;

const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const ContactList = (props) => {
  const {
    contacts,
    selectedUser,
    selectUser
  } = props;
  return (
    <ContactListWrapper>
      {contacts.map((contact) => (
        <ContactContainer key={contact._id}
                          onClick={() => {
                            selectUser(contact._id);
                          }}
                          selected={selectedUser === contact._id}>
          <AvatarContainer>
            <Avatar src={contact.avatar} alt="avatar"/>
          </AvatarContainer>
          <p>{contact.username}</p>
        </ContactContainer>
      ))}
    </ContactListWrapper>
  );
};

export default ContactList;
