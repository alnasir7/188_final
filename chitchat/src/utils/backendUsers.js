import { putData, useFetch } from './backendCommon';
import { BACKEND_URL } from './constants';

export const login = async (username, password) => putData(`${BACKEND_URL}/user/login`, {
  username,
  password
});
export const logout = async () => putData(`${BACKEND_URL}/user/logout`, {});

export const changePassword = async (oldPass, newPass) => putData(`${BACKEND_URL}/user/password`, {
  oldPassword: oldPass,
  newPassword: newPass
});
export const resetPassword = async (username, securityQuestionAnswer, newPass) => putData(`${BACKEND_URL}/user/reset`, {
  username,
  securityQuestionAnswer,
  newPassword: newPass
});
export const changeAvatar = async (avatarUrl) => putData(`${BACKEND_URL}/user/edit/avatar`, { avatar: avatarUrl });

export const deactivateUser = async () => putData(`${BACKEND_URL}/user/deactivate`);

export const registerNewUser = async (username, password, securityQuestionAnswer) => putData(`${BACKEND_URL}/user/register`, {
  username,
  password,
  securityQuestionAnswer
});

export const useUserProfileInfo = (userName) => useFetch(`${BACKEND_URL}/user/profile/${userName}`);
export const useLoggedInUser = (dependencies) => useFetch(`${BACKEND_URL}/user/profile`, dependencies);

export const useNotifications = (dependencies) => useFetch(`${BACKEND_URL}/user/notifications`, dependencies);

export const clearNotifications = async () => putData(`${BACKEND_URL}/user/notifications/clear`);
