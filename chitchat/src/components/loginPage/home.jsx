/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../../style/Home.css';
import { LoginModal, SignUpModal, SecurityQuestionModal } from './HomePageModals';
import { useHistory } from 'react-router-dom';
import { login, registerNewUser, resetPassword } from '../../utils/backendUsers';

function Home() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [securityQuestionVisible, setSecurityQuestionVisible] = useState(false);
  let history = useHistory();
  const handleSwitch = (setError, type, form) => {
    setError('');
    form.reset();  
    if (type === 'signup') {
      setLoginVisible(false);
      setSignUpVisible(true);  
      setSecurityQuestionVisible(false);
    } else if (type === 'security') {
      setLoginVisible(false);
      setSignUpVisible(false);  
      setSecurityQuestionVisible(true);
    } else if (type === 'login') {
      setLoginVisible(true);
      setSignUpVisible(false);  
      setSecurityQuestionVisible(false);
    } else {      
      setLoginVisible(!loginVisible);
      setSignUpVisible(!signUpVisible);  
      setSecurityQuestionVisible(!securityQuestionVisible);
    }
  };
  const handleSignUp = async (setError) => {
    const username = document.getElementById('sign-up-username').value;
    const password = document.getElementById('sign-up-password').value;    
    const securityAnswer = document.getElementById('sign-up-security-answer').value;
    await registerNewUser(username, password, securityAnswer).then(() => {
      history.push('/main');
    }).catch((error) => {
      if (error.message === 'Username already taken') {
        setError('duplicate');
      } else {
        setError('unknown');
      }
    });
  };
  const handleLogin = async (setError) => {
    const password = document.getElementById('login-password').value;
    const username = document.getElementById('login-username').value;
    await login(username, password)
      .then((_result) => {
        history.push('/main');
      })
      .catch((_error) => {
        setError('fail')
      });
  };

  const handleSecurity = async (setError) => {
    const password = document.getElementById('forgot-password').value;
    const username = document.getElementById('forgot-username').value;
    const securityAnswer = document.getElementById('forgot-security-answer').value;
    await resetPassword(username, securityAnswer, password).then((result) => {
      document.getElementById('login-modal-form');
      history.push('/');
    }).catch((_error) => {
      setError('fail');
    });
  };
  return (
    <div className="home-wrapper">
      <div className="home-welcome">
        Welcome to ChitChat!
      </div>
      <button className="sign-up-btn-home" type="button" onClick={() => setLoginVisible(true)}>
        Sign In
      </button>
      <LoginModal
        visible={loginVisible}
        setVisible={setLoginVisible}
        handleSwitch={handleSwitch}
        handleLogin={handleLogin}
      />
      <SignUpModal
        visible={signUpVisible}
        setVisible={setSignUpVisible}
        handleSwitch={handleSwitch}
        handleSignUp={handleSignUp}
      />
      <SecurityQuestionModal
        visible={securityQuestionVisible}
        setVisible={setSecurityQuestionVisible}
        handleSwitch={handleSwitch}
        handleSecurity={handleSecurity}
      />
    </div>
  );
}

export default Home;