import { deleteData, postData, putData } from './backendCommon';
import { BACKEND_URL } from './constants';

// this is a hook, use it like one
//export const usePost = (group, postId) => useFetch(`${BACKEND_URL}/${group}/${postId}`);

export const createComment = async (comment) => postData(`${BACKEND_URL}/comment/${comment.parent}`, { text: comment.body });

export const editComment = async (comment) => putData(`${BACKEND_URL}/comment/${comment.id}`, { text: comment.body });

export const deleteComment = async (id) => deleteData(`${BACKEND_URL}/comment/${id}`, {});
