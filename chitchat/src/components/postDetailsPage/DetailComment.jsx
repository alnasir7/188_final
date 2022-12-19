import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { deleteComment, editComment } from '../../utils/backendComments';

const Container = styled.div`
  display: flex;
  margin: 10px;
`;

const Avatar = styled.img`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid black;
`;

const Text = styled.textarea`
  border-style: none;
  border-color: Transparent;
  overflow: auto;
`;

const TextWrapper = styled.div`
  display: inline-block;
  border-radius: 20px;
  background: white;
  margin-left: 20px;
  padding: 5px 10px;
`;

const DetailComment = (props) => {

  const {
    avatar,
    text,
    _id,
    publishChange
  } = props;

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setContent(text);
  }, [text]);

  const [content, setContent] = useState(text);
  const [, setCommentError] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const dComment = async (event) => {
    try {
      event.target.disabled = true;
      await deleteComment(_id);
      if (publishChange) {
        publishChange();
      }
    } catch (err) {
      event.target.disabled = false;
    }
  };

  //const { id } = useParams();
  const save = async () => {
    // make the request
    try {

      const comment = {
        body: content,
        id: _id
      };
      await editComment(comment);
      setEdit(false);
      if (publishChange) {
        publishChange();
      }
    } catch (err) {
      if (err && err.message) {
        setCommentError(err.message);
      } else {
        setCommentError('unknown error');
      }
    }

  };

  return (
    <>
      <Container>
        <div className="pfpContainer">
          <Avatar src={avatar} alt={''}/>
        </div>
        <TextWrapper>
          {edit ?
            <>
              <Text value={content} onChange={handleContentChange} rows="3"/>
            </>
            :
            <p>
              {text}
            </p>
          }
        </TextWrapper>
        <div style={{ flexGrow: '1' }}>
          <button onClick={() => {
            setEdit(!edit);
          }} className="custom-button  is-pulled-right" style={{ float: 'right' }}>
            {edit ? 'close' : 'edit'}
          </button>
          {edit &&
            <button onClick={save} className="custom-button  is-pulled-right">
              save
            </button>
          }
          <button onClick={(event) => dComment(event)} className="custom-button  is-pulled-right">
            delete
          </button>
        </div>
      </Container>

    </>
  );
};

export default DetailComment;
