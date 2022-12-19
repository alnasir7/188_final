/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { lightGrey } from '../../colors';
// import AddTags from './addTags';
import { createPost } from '../../utils/backendPosts';

const Title = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 20px;
`;

const Spacer = styled.div`
  height: 20px;
`;

const AttatchmentWrapper = styled.div`
  display: flex;
  height: 40px;
  flex-dircection: column;
  justify-content: center;
  align-items: center;
`;

const Attatchment = styled.div`
  height: 24px;
  width: 24px;
  margin-right: 12px;
  cursor: pointer;
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

const UploadDiv = styled.div`
  margin-bottom: 20px;
`;

const CreatePost = ({ props }) => {
  const [displayUploadField, setDisplayUploadFiled] = useState(
    {
      video: false,
      audio: false,
      image: false
    },
  );
  const {
    publishChange,
    changeModal
  } = props;
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const [imgFile, setImgFile] = useState('');
  const [imgError, setImgError] = useState('');
  const [imgSrc, setImgSrc] = useState('');

  const [vidFile, setVidFile] = useState('');
  const [vidError, setVidError] = useState('');
  const [vidSrc, setVidSrc] = useState('');

  const [audFile, setAudFile] = useState('');
  const [audError, setAudError] = useState('');
  const [audSrc, setAudSrc] = useState('');

  const handelShowField = (type) => {
    setDisplayUploadFiled({
      ...displayUploadField,
      [type]: !displayUploadField[type]
    });
  };

  const handleDiscard = () => {
    clear();
    changeModal(false);
  };

  useEffect(() => {
    const uploadVideo = () => {
      console.log(vidFile.type);
      var allowedTypes = ['video/mp4', 'video/avi', 'video/mpg', 'video/m4v'];
      if (!vidFile.type || !allowedTypes.includes(vidFile.type)) {
        setVidError(`invalid video size or type. allowed types are
        ${JSON.stringify(allowedTypes.map((type) => type.split('/')[1]))}`);
        setVidFile(null);
        return;
      }
      setVidError(null);
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        setVidSrc(srcData);
      };
      fileReader.readAsDataURL(vidFile);
    };
    const uploadAudio = () => {
      const allowedTypes = ['audio/mpeg', 'audio/ogg', 'audio/mpeg', 'audio/mp3', 'audio/aiff', 'audio/m4a'];
      if (!audFile.type || !allowedTypes.includes(audFile.type)) {
        setAudError(`invalid audio size or type. allowed types are 
        ${JSON.stringify(allowedTypes.map((type) => type.split('/')[1]))}`);
        return;
      }
      setAudError(null);
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result; // <--- data: base64
        setAudSrc(srcData);
      };
      fileReader.readAsDataURL(audFile);
    };
    const uploadImg = () => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!imgFile.type || !allowedTypes.includes(imgFile.type)) {
        setImgError(`invalid image size or type. allowed types are 
        ${JSON.stringify(allowedTypes.map((type) => type.split('/')[1]))}`);
        setImgFile(null);
        return;
      }
      setImgError(null);
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result; // <--- data: base64
        setImgSrc(srcData);
      };
      fileReader.readAsDataURL(imgFile);
    };

    if (imgFile) {
      uploadImg();
    }
    if (audFile) {
      uploadAudio();
    }
    if (vidFile) {
      uploadVideo();
    }
  }, [imgFile, vidFile, audFile]);

  // const [tags, setTags] = useState([]);
  // const [tagError, setTagError] = useState(false);
  const [postError, setPostError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const clear = () => {
    setTitle('');
    setText('');
    // setTags([])
    // setTagError("")
  };

  const handleSave = async () => {
    // make the request
    try {
      const post = {
        // tags,
        text,
        title,
        group: props.groupId
      };
      if (imgSrc && imgSrc.length > 0) {
        post.image = imgSrc;
      }
      if (vidSrc && vidSrc.length > 0) {
        post.video = vidSrc;
      }
      if (audSrc && audSrc.length > 0) {
        post.audio = audSrc;
      }

      await createPost(post);
      setPostError(false);
      if (publishChange) {
        publishChange();
      }
      clear();
      changeModal(false);
    } catch (err) {
      if (err && err.message) {
        setPostError(err.message);
      } else {
        setPostError('unknown error');
      }
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
    <>
      <Title>
        <div>
          <h1>
            New Post
          </h1>
        </div>
      </Title>
      {postError ? <div style={{
        color: 'red',
        marginBottom: '12px'
      }}>Error posting: Make sure to include a title and text to your post</div> : null}

      <input value={title} onChange={handleTitleChange} className="input" type="text"
             placeholder="Post title"/>
      <Spacer/>
      <Spacer/>
      <div className="card">
        <header className="card-header" style={{
          background: lightGrey,
          position: 'relative',
          padding: '0px 10px'
        }}>
          <AttatchmentWrapper>
            <Attatchment>
              <img onClick={() => handelShowField('audio')}
                   src={`${process.env.PUBLIC_URL}/icons/volume-2.svg`} alt="audio"/>
            </Attatchment>
            <Attatchment>
              <img onClick={() => handelShowField('image')}
                   src={`${process.env.PUBLIC_URL}/icons/image.svg`} alt="audio"/>
            </Attatchment>
            <Attatchment>
              <img onClick={() => handelShowField('video')}
                   src={`${process.env.PUBLIC_URL}/icons/video.svg`} alt="audio"/>
            </Attatchment>

          </AttatchmentWrapper>
        </header>
        <div className="card-content" style={{ padding: '0px' }}>
          <div className="content" style={{ padding: '0px' }}>
            <Text value={text} onChange={handleTextChange} rows={6}
                  placeholder="Start typing ... "/>
          </div>
        </div>
        <footer className="card-footer">
          <span style={{ cursor: 'pointer' }} onClick={handleSave}
                className="card-footer-item">Save </span>
          <span style={{ cursor: 'pointer' }} onClick={handleDiscard}
                className="card-footer-item">Discard </span>
        </footer>
      </div>
      <Spacer/>
      {/* <AddTags tags={tags} setTags={setTags} setTagError={setTagError}/>
      {tagError ? <div style={{ color: 'red' }}>Tags can only contain alphanumeric characters and must be less or equal to 24 characters</div> : null} */}
      <Spacer/>


      <Spacer/>
      {

        Object.keys(displayUploadField)
          .map((key) => displayUploadField[key] && (
            <UploadDiv>
              <FileSelector
                onLoadFile={(files) => {
                  if (key === 'image') {
                    setImgFile(files[0]);
                  }
                  if (key === 'video') {
                    setVidFile(files[0]);
                  }
                  if (key === 'audio') {
                    setAudFile(files[0]);
                  }
                }}
                file={key === 'image' ? imgFile : key === 'audio' ? audFile : vidFile}
                name={key === 'image' ? 'Image' : key === 'audio' ? 'Audio' : 'Video'}
              />

              {key === 'image' && imgError ?
                <div style={{ color: 'red' }}>{imgError}</div> : null}
              {key === 'video' && vidError ?
                <div style={{ color: 'red' }}>{vidError}</div> : null}
              {key === 'audio' && audError ?
                <div style={{ color: 'red' }}>{audError}</div> : null}
            </UploadDiv>

          ))

      }
    </>
  );
};

const FileSelector = (props) => {
  return (
    <div className="file has-name is-boxed">
      <label className="file-label">
        <input
          className="file-input"
          type="file"
          name="file"
          onChange={(e) =>
            props.onLoadFile(e.target.files)
          }
        />
        <span className="file-cta">
          <span className="file-icon">
            <i className="fas fa-upload"></i>
          </span>
          <span className="file-label">Choose a {props.name}</span>
        </span>
        <span className="file-name">
          {props && props.file && props.file.name
            ? props.file.name
            : 'Upload file here ...'}
        </span>
      </label>
    </div>
  );
};

export default CreatePost;
