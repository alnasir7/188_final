function LoginValidation(setError) {
  const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{5,16}$/g;
  const usernameRegex = /[a-zA-Z0-9._-]{5,20}/g;
  const password = document.getElementById('login-password').value;
  const username = document.getElementById('login-username').value;
  if (!password || !username) {
    setError('empty');
    return 'empty';
  } else if (!password.match(passwordRegex) || !username.match(usernameRegex)) {
    setError('fail');
    return 'fail';
  } else {
    setError('');
    return '';
  }
}

function SignUpValidation(setError) {
  const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{6,16}$/g;
  const usernameRegex = /^[a-zA-Z0-9._-]{6,16}$/g;  
  const securityRegex = /^[a-zA-Z]{2,16}$/g;
  const password = document.getElementById('sign-up-password').value;
  const confirmPassword = document.getElementById('sign-up-confirm-password').value;
  const username = document.getElementById('sign-up-username').value;
  
  const securityAnswer = document.getElementById('sign-up-security-answer').value;
  console.log(username);
  console.log(confirmPassword);
  console.log(password);  
  console.log(securityAnswer);
  if (!password || !username || !confirmPassword || !securityAnswer) {
    setError('empty');
    return 'empty'
  } else if (!username.match(usernameRegex)) {
    setError('invalidUsername');
    return 'invalidUsername';
  } else if (!password.match(passwordRegex)) {
    setError('invalidPassword');
    return 'invalidPassword';
  } else if (!(confirmPassword === password)) {
    setError('badMatch');
    return 'badMatch';
  } else if (!securityAnswer.match(securityRegex)) {
    console.log('here');
    setError('invalidSecurityAnswer'); 
    return 'invalidSecurityAnswer';
  } else {
    setError('');
    return '';
  }
}





function SecurityQuestionValidation(setError) {
  const usernameRegex = /^[a-zA-Z0-9._-]{6,16}$/g;  
  const securityRegex = /^[a-zA-Z]{2,16}$/g;  
  const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{5,16}$/g;    
  const password = document.getElementById('forgot-password').value;
  const confirmPassword = document.getElementById('change-confirm-password').value;
  const username = document.getElementById('forgot-username').value;
  const securityAnswer = document.getElementById('forgot-security-answer').value;
  console.log(username);
  console.log(securityAnswer);
  if (!password || !securityAnswer || !password || !confirmPassword) {
    setError('empty');
    return 'empty';
  } else if (!password.match(passwordRegex) || !username.match(usernameRegex)) {
    setError('fail');
    return 'fail';
  } else if (!(confirmPassword === password)) {
    setError('badMatch');
    return 'badMatch';
  } else if (!securityAnswer.match(securityRegex)) {
    setError('invalidSecurityAnswer'); 
    return 'invalidSecurityAnswer';
  } else if (!password.match(passwordRegex)) {
    setError('invalidPassword');
    return 'invalidPassword';
  } else {
    setError('');
    return '';
  }
}
export { LoginValidation, SignUpValidation, SecurityQuestionValidation };