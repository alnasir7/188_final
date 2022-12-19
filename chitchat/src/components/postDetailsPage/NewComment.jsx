import React, { useState } from 'react';
import styled from 'styled-components';
import Votes from '../common/upvote';
import { useParams } from 'react-router-dom';
import { createComment } from '../../utils/backendComments';

const Avatar = styled.img`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  @media screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const TextWrapper = styled.div`
  display: inline-block;
  border-radius: 20px;
  background: white;
  padding: 5px 10px;
  margin-left: 20px;
`;

const Text = styled.textarea`
  border-style: none;
  border-color: Transparent;
  overflow: auto;
`;

const NewComment = ({
  image,
  text,
  up,
  down,
  publishChange
}) => {

  const [content, setContent] = useState('');
  const [commentError, setCommentError] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const { id } = useParams();
  const save = async () => {
    // make the request
    try {

      const comment = {
        body: content,
        parent: id
      };
      await createComment(comment);
      setContent('');
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

  return <>
    <div style={{ marginLeft: '35px' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      >
        <div>
          <Avatar src={image}/>
        </div>
        <div>
          <TextWrapper>
            {text
              ? (
                <p>
                  {text}
                </p>
              )
              : <Text value={content} onChange={handleContentChange} rows="2"/>}
          </TextWrapper>
          <button onClick={save} style={{
            display: 'block',
            marginLeft: '10px'
          }} className="custom-button is-pulled-right">
            send
          </button>
          {commentError ? <div style={{
            color: 'red',
            marginBottom: '12px'
          }}>Error commenting: {commentError}</div> : null}
        </div>
        {text
          && (
            <div
              className="is-pulled-right"
              style={{
                width: '100px',
                height: '60px',
                marginLeft: '20px',
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}
                >
                  <Votes up={up} down={down}/>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  </>;
};

export default NewComment;
