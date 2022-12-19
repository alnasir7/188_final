import { postData, putData, useFetch } from './backendCommon';
import { BACKEND_URL } from './constants';

// this is a hook, use it like one
export const useMessages = (user) => useFetch(`${BACKEND_URL}/message/${user}`);

export const useContacts = () => useFetch(`${BACKEND_URL}/message/contacts`);

export const readMessage = async (messageId) => postData(`${BACKEND_URL}/message/read/${messageId}`);
export const editMessage = async (messageId) => putData(`${BACKEND_URL}/message/${messageId}`);
export const sendMessage = async (messageContent) => postData(`${BACKEND_URL}/message`, messageContent);
