/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal } from 'antd';
import '../../style/HomePageModals.css';
import { LoginValidation, SignUpValidation, SecurityQuestionValidation } from './HomePageModalValidation';

function LoginError({ error }) {
  switch (error) {
    case 'empty':
      return (
        <div className="home-page-error">
          *Please fill out all fields
        </div>
      );
    case 'fail':
      return (
        <div className="home-page-error">
          *Invalid username or password
        </div>
      );
    default:
      return null;
  }
}

function LoginModal({
  visible,
  setVisible,
  handleLogin,
  handleSwitch,
}) {
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = LoginValidation(setError);
    if (err === '') {
      handleLogin(setError);
    }
  };
  const handleCancel = () => {
    setVisible(false);
    document.getElementById('login-modal-form')
      .reset();
    setError('');
  };
  return (
    <Modal width="40vw" centered visible={visible} footer={null} onCancel={() => handleCancel()}>
      <div className="modal-wrapper">
        <div className="log-in-big-txt">
          Login to ChitChat
        </div>
        <div className="login-err-wrapper">
          <LoginError error={error}/>
        </div>
        <form id="login-modal-form" onSubmit={(e) => handleSubmit(e)}>
          <br/>
          <input id="login-username" className="log-in-input-username" type="text"
                 placeholder="Username"/>
          <br/>
          <input id="login-password" className="log-in-input-password" type="password"
                 placeholder="Password"/>
          <br/>
          <button className="log-in-submit-btn" type="submit">
            Submit
          </button>
        </form>
        <div className="log-in-register-text">
          New to Chit Chat?
          {' '}
          <span className="log-in-txt-btn" role="button" tabIndex={0} onClick={() => handleSwitch(setError,'signup', document.getElementById('login-modal-form'))} aria-hidden="true">Sign Up</span>
        </div>
        <div className="forgot-password-text">
          Forgot Password?
          {' '}
          <span className="forgot-password-txt-btn" role="button" tabIndex={0} onClick={() => handleSwitch(setError, 'security', document.getElementById('login-modal-form'))} aria-hidden="true">Answer Security Question</span>
        </div>
      </div>
    </Modal>
  );
}

function SignUpError({ error }) {
  switch (error) {
    case 'empty':
      return (
        <div className="home-page-error">
          *Please fill out all fields
        </div>
      );
    case 'invalidUsername':
      return (
        <div className="home-page-error">
          *Invalid Username: Username must have a length between 6 and 16 characters
          {' '}
          and can only contain alphanumeric characters and the following characters: ._-
        </div>
      );
    case 'invalidPassword':
      return (
        <div className="home-page-error">
          *Invalid Password: Password must have a length between 6 and 16 characters
          {' '}
          and can only contain alphanumeric characters and the following characters: !?$%^*)(+=._-
        </div>
      );
    case 'badMatch':
      return (
        <div className="home-page-error">
          *Error: The passwords do not match
        </div>
      );
    case 'usernameTaken':
      return (
        <div className="home-page-error">
          *Error: This username has already been chosen. Please choose a different one.
        </div>
      );
      case 'invalidSecurityAnswer':
        return (
          <div className="home-page-error">
            *Error: The security question answer is invalid. Answers must be between 2 and 16 letters.
          </div>
        );
      case 'duplicate':
          return (
            <div className="home-page-error">
              *Error: The username you have chose has already been taken. Please choose a new one.
            </div>
          );
    case 'unknown':
          return (
            <div className="home-page-error">
              *Error: Please check your inputs.
            </div>
          );
    default:
      return null;
  }
}

function SignUpModal({
  visible,
  setVisible,
  handleSignUp,
  handleSwitch,
}) {
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = SignUpValidation(setError);
    if (err === '') {
      handleSignUp(setError);
    }
  };
  const handleCancel = () => {
    setVisible(false);
    document.getElementById('sign-up-modal-form')
      .reset();
    setError('');
  };
  
  // if (error === 'none') {
  //   handleSwitch(setError, 'login', document.getElementById('sign-up-modal-form'));
  //   setError('');
  // }
  
  return (
    <Modal width="40vw" centered visible={visible} footer={null} onCancel={() => handleCancel()}>
      <div className="sign-up-modal-wrapper">
        <div className="log-in-big-txt">
          Create a ChitChat Account
        </div>
        <div className="sign-up-err-wrapper">
          <SignUpError error={error}/>
        </div>
        <form id="sign-up-modal-form" onSubmit={(e) => handleSubmit(e)}>
          <input id="sign-up-username" className="sign-up-input-username" type="text" placeholder="Username" />
          <input id="sign-up-password" className="sign-up-input-password" type="password" placeholder="Password" />
          <input id="sign-up-confirm-password" className="sign-up-confirm-password" type="password" placeholder="Confirm Password" /> 
          <div className="security-q">Security Question</div>       
          <input id="sign-up-security-answer" className="sign-up-input-security-answer" type="text" placeholder="What is your favourite animal?" />

          <button className="log-in-submit-btn" type="submit">
            Submit
          </button>
        </form>
        <div className="log-in-register-text">
          Already Have an Account?
          {' '}
          <span className="log-in-txt-btn" role="button" tabIndex={0} onClick={() => handleSwitch(setError, 'login', document.getElementById('sign-up-modal-form'))} aria-hidden="true">Login</span>


        </div>
      </div>
    </Modal>
  );
}

function SecurityQuestionModal({
  visible, setVisible, handleSecurity, handleSwitch,
}) {
  const [error, setError] = useState('');
  const handleSubmit = (e) => {    
    e.preventDefault();
    const err = SecurityQuestionValidation(setError);  
    if (err === "") {
      handleSecurity(setError);
    }
  };
  
  const handleCancel = () => {
    setVisible(false);
    document.getElementById('password-forgot-modal-form').reset();
    setError('');
  };

  if (error === 'submit') {
    handleSwitch(setError, 'login', document.getElementById('password-forgot-modal-form'))
    setError('');
  }
  
  return (
    <Modal width="40vw" centered visible={visible} footer={null} onCancel={() => handleCancel()}>
      <div className="modal-wrapper">
        <div className="log-in-big-txt">
          Login to ChitChat
        </div>
        <div className="login-err-wrapper">
          <SecurityQError error={error} />
        </div>
        <form id="password-forgot-modal-form" onSubmit={(e) => handleSubmit(e)}>
          <br />
          <input id="forgot-username" className="log-in-input-username" type="text" placeholder="Username" />
          <br />
          <div className="security-q">Security Question</div>       
          <input id="forgot-security-answer" className="sign-up-input-security-answer" type="text" placeholder="What is your favourite animal?" />
          <div className="security-q">New Details:</div>   
          <input id="forgot-password" className="sign-up-input-password" type="password" placeholder="New Password" />
          <input id="change-confirm-password" className="sign-up-confirm-password" type="password" placeholder="Confirm Password" /> 
          <br />
          <button className="log-in-submit-btn" type="submit">
            Submit
          </button>
        </form>
        <div className="log-in-register-text">
          New to Chit Chat?
          {' '}
          <span className="log-in-txt-btn" role="button" tabIndex={0} onClick={() => handleSwitch(setError, 'signup', document.getElementById('password-forgot-modal-form'))} aria-hidden="true">Sign Up</span>
        </div>
        <div className="log-in-register-text">
          Already Have an Account?
          {' '}
          <span className="log-in-txt-btn" role="button" tabIndex={0} onClick={() => handleSwitch(setError, 'login', document.getElementById('password-forgot-modal-form'))} aria-hidden="true">Login</span>
        </div>
      </div>

    </Modal>
  );
  
}


function SecurityQError({ error }) {
  switch (error) {
      case 'empty':
        return (
          <div className="home-page-error">
            *Please fill out all fields
          </div>
        );
      case 'fail':
        return (
          <div className="home-page-error">
            *Invalid username or password
          </div>
        );
    case 'invalidPassword':
      return (
        <div className="home-page-error">
          *Invalid Password: Password must have a length between 6 and 16 characters
          {' '}
          and can only contain alphanumeric characters and the following characters: !?$%^*)(+=._-
        </div>
      );
    case 'invalidSecurityAnswer':
      return (
        <div className="home-page-error">
          *Invalid Username or Security Answer
          {' '}
        </div>
      );  
    case 'badMatch':
      return (
        <div className="home-page-error">
          *Error: new passwords do not match
        </div>
      );
    default:
      return null;
  }
}


export { LoginModal, SignUpModal, SecurityQuestionModal};