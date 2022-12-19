import { deleteData, postData, putData } from './backendCommon';
import { BACKEND_URL } from './constants';

// this is a hook, use it like one
// export const usePost = (group, postId) => useFetch(`${BACKEND_URL}/${group}/${postId}`);

export const createPost = async (post) => postData(`${BACKEND_URL}/post`, post);

export const getPosts = async (id) => putData(`${BACKEND_URL}/post/group/${id}`, {});

export const getSpecificPost = async (id) => putData(`${BACKEND_URL}/post/specific/${id}`, {});

export const flagPost = async (id) => postData(`${BACKEND_URL}/post/flag/${id}`);

export const deletePost = async (id) => deleteData(`${BACKEND_URL}/post/${id}`);

export const hidePost = async (id) => postData(`${BACKEND_URL}/post/hide/${id}`);


