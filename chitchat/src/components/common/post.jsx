/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Tags from './tags';
import Comment from '../postDetailsPage/NewComment';
import CommentList from '../postDetailsPage/CommentList';
import { lightGrey, miscGrey } from '../../colors';
import { Link } from 'react-router-dom';
import { deletePost, flagPost, hidePost } from '../../utils/backendPosts';

const Container = styled.div`
  border-radius: 10px;
  height: auto;
  overflow: hidden;
  width: 400px;
  padding: 10px;
  background-color: ${miscGrey};
  justify-content: center;
  margin: auto;
  align-items: center;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.2);
    transition-duration: 0.5s;
  }

  @media screen and (max-width: 768px) {
    padding: 8px;
    width: auto;
    margin: auto;
  }
`;

const Spacer = styled.div`
  height: 50px;
`;

const Titlebar = styled.div`
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const InfoDiv = styled.div`
  display: inline-block;
  margin-bottom: 8px;
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-bottom: 6px;
  }
`;

const Image = styled.img`
  display: inline;
  width: 400px;
  height: 400px;
  border: 1px solid black;
`;

const Author = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: grey;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: black;
`;
const Text = styled.p`
  text-align: start;
  color: black;
  font-size: 12px;
  margin-bottom: 12px;
`;

const PostWrapper = styled.div`
  margin-bottom: 20px;
  margin-left: 2px;
  margin-right: 10px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`;

const Video = styled.video`
  display: inline;
  width: 400px;
  height: 400px;
  border: 1px solid black;
`;

const ViewPost = styled(Link)`
  font-size: 20px;
  font-weight: 500;
  color: ${lightGrey};
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Post = ({
  post,
  publishChange,
  user
}) => {
  const {
    title,
    author,
    tags,
    group,
    detailed,
    text,
    image,
    video,
    audio,
    _id,
  } = post;

  const handleDelete = async (event) => {
    try {
      event.target.disabled = true;
      await deletePost(_id);
      if (publishChange) {
        publishChange();
      }
    } catch (err) {
      event.target.disabled = false;
    }
  };
  const handleFlag = async () => {
    try {
      await flagPost(_id);
      if (publishChange) {
        publishChange();
      }
    } catch (err) {

    }
  };
  const handleHide = async (event) => {
    try {
      event.target.disabled = true;
      await hidePost(_id);
      if (publishChange) {
        publishChange();
      }
    } catch (err) {
      event.target.disabled = false;
    }
  };
  let dots;
  if (text) {
    dots = text.length > 150 ? '...' : '';
  } else {
    dots = '';
  }
  return (
    <PostWrapper>
      <Container>
        <div>
          <Titlebar>

            <div className="flex-item">
              <InfoDiv>
                <Title>{title}</Title>
                <Author>
                  by:
                  {' '}
                  {author.username}
                </Author>
                <Author>
                  group:
                  {' '}
                  {group && group.name && group.name}
                </Author>
              </InfoDiv>
            </div>
            <div className="flex-item">
              {
                tags && (
                  <div>
                    <Tags tags={tags}/>
                  </div>
                )
              }
            </div>
          </Titlebar>
          <Text>{detailed ? text : `${text.substring(0, 150)}${dots}`}</Text>
        </div>
        {detailed
          && (
            <>
              {image
                && (
                  <ImageWrapper>
                    <Image src={image}/>
                  </ImageWrapper>
                )}
                {audio
                && (
                  <ImageWrapper>
                    <audio controls>
                      <source src={audio}/>
                    </audio>
                  </ImageWrapper>
                )}
              {video
                // Since it has the same style as imageWrapper,
                // no need for a new styled component for videoWrapper
                && (
                  <ImageWrapper>
                    <Video>
                      <source type="video/mp4" src={video}/>
                    </Video>
                  </ImageWrapper>
                )}
              <hr/>
            </>
          )}
        <div className="is-pulled-right">
          <button type="button" onClick={() => handleFlag()} className="custom-button" style={{
            fontSize: '12px',
            marginLeft: '5px'
          }}>flag for deletion
          </button>
          {( post.admin || (user && user._id.toString() === author._id.toString()))
            ?
            <button type="button" onClick={(event) => handleDelete(event)} className="custom-button"
                    style={{
                      fontSize: '12px',
                      marginLeft: '5px'
                    }}>delete</button>
            : null
          }
          <button type="button" onClick={(event) => handleHide(event)} className="custom-button"
                  style={{
                    fontSize: '12px',
                    marginLeft: '5px'
                  }}>hide
          </button>
          {(post.admin || (user && user._id.toString() === author._id.toString())) && <button type="button" className="custom-fake-button" style={{
            fontSize: '12px',
            marginLeft: '5px'
          }}>{post.flags ? post.flags : 0} flags for deletion</button>}
        </div>
        <Spacer/>
        {detailed
          ? (
            <>
              {/*
              <div style={{ height: '30px' }}>
                <div className="is-pulled-left">
                  <Votes up={post.ups} down={post.downs} />
                </div>
                <div className="is-pulled-right" />
              </div>
            */}
              <CommentList comments={post.comments} avatar={author.avatar}
                           publishChange={publishChange}/>
              <hr/>
              <Comment image={author.avatar} publishChange={publishChange}/>

            </>
          )
          : <ViewPost to={`/post/${_id}`}>View post</ViewPost>}
      </Container>
    </PostWrapper>
  );
};

export default Post;
