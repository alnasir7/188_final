/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';
import AddTags from './addTags';
import { createGroup } from '../../utils/backendGroups';

const Title = styled.div`
  margin-bottom: 20px;
`;

const Spacer = styled.div`
  height: 20px;
`;

const Text = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 20px;
  margin: 0px;
  border: none;
  outline: none;
  resize: none;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  justify-content: space-between;
`;

const CreateGroup = ({ props }) => {
  const {
    closeModal,
    handleCreation
  } = props;
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameTakenError, setNameTakenError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const save = async () => {
    try {
      const title = document.getElementById('input-title').value;
      const isPrivate = document.getElementById('input-private').checked;
      const description = document.getElementById('input-description').value;
      setNameTakenError(false);
      setNameError(false);
      setDescriptionError(false);
      if (!title.match(/^([a-zA-Z0-9'_]+( [[a-zA-Z0-9'_])*){3,24}$/g)) {
        return setNameError(true);
      }
      if (description.length > 500 || description.length < 1) {
        return setDescriptionError(true);
      }
      await createGroup({
        name: title,
        isPublic: !isPrivate,
        description: description,
        tags: tags
      })
        .then(() => {
          if (handleCreation) {
            handleCreation();
          } else {
            closeModal();
          }
        })
        .catch((_error) => {
          setNameTakenError(true);
        });
    } catch (err) {
      console.error(err);
    }
  };
  // const removeTags = indexToRemove => {
  // 	setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  // };
  // const addTags = event => {
  //   event.preventDefault();
  //   const tag = event.target.value;
  // 	if (tag !== "") {
  //     if (!tag.match(/^[a-zA-Z0-9]{1,24}$/g)){
  //       setTagError(true);
  //       event.stopPropagation();
  //     } else {
  //       setTags([...tags, event.target.value]);
  //       setTagError(false);
  //       event.target.value = "";
  //     }
  // 	}
  // };
  return (
    <div>
      <div>
        <TitleWrapper>
          <Title>
            <div>
              <h1>
                New Group
              </h1>
            </div>
          </Title>
          <div>
            <button onClick={closeModal} type="button" className="custom-button">
              Close
            </button>
          </div>
        </TitleWrapper>
      </div>
      {nameTakenError ?
        <div style={{ color: 'red' }}>Name has already been taken. Please choose a different
          name.</div> : null}
      {nameError ?
        <div style={{ color: 'red' }}>Names must be between 3 and 24 characters and can only
          contains alphanumeric characters, spaces between words, and the following characters:
          _'</div> : null}
      <Spacer/>
      <input className="input" type="text" id="input-title" placeholder="Group Title"/>
      <Spacer/>
      <div className="is-pulled-left" style={{ marginBottom: '10px' }}>
        <input type="checkbox" className="form-check-input" id="input-private"/>
        <label className="form-check-label" style={{ marginLeft: '10px' }} htmlFor="exampleCheck1">Set
          the group to private</label>
      </div>
      <Spacer/>
      <Spacer/>
      {descriptionError ? <div style={{ color: 'red' }}>Descriptions must be between 1 and 500
        characters</div> : null}
      <Spacer/>
      <div className="card">
        <div className="card-content" style={{ padding: '0px' }}>
          <div className="content" style={{ padding: '0px' }}>
            <Text rows={3} placeholder="Type group description here " id="input-description"/>
          </div>
        </div>
      </div>
      <Spacer/>
      <Spacer/>
      {tagError ?
        <div style={{ color: 'red' }}>Tags can only contain alphanumeric characters and must be less
          or equal to 24 characters</div> : null}
      <AddTags tags={tags} setTags={setTags} setTagError={setTagError}/>
      <Spacer/>
      <div className="is-pulled-right">
        <button onClick={save} type="button" className="custom-button">
          Create
        </button>
      </div>
      <Spacer/>

    </div>
  );
};

export default CreateGroup;
