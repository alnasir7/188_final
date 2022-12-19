import { postData, useFetch } from './backendCommon';
import { BACKEND_URL } from './constants';

export const createRequest = async (groupId) => postData(`${BACKEND_URL}/invitations/request`, { group: groupId });

export const invite = async (group, receiver) => postData(`${BACKEND_URL}/invitations/invite`, {
  group,
  receiver
});

export const approve = async (id) => postData(`${BACKEND_URL}/invitations/invite/approve/${id}`, {});

export const handle_request = async (id, accept) => postData(`${BACKEND_URL}/invitations/handle_request/${id}`, { accept });

export const handle_invite = async (id, accept) => postData(`${BACKEND_URL}/invitations/handle_invite/${id}`, { accept });

export const useRequested = (groupId, dependencies) => useFetch(`${BACKEND_URL}/invitations/requested/${groupId}`, dependencies);

export const useRequests = (groupId, dependencies) => useFetch(`${BACKEND_URL}/invitations/request/${groupId}`, dependencies);

export const useInvitations = (groupId, dependencies) => useFetch(`${BACKEND_URL}/invitations/invite/${groupId}`, dependencies);

export const useMyInvitations = (dependencies) => useFetch(`${BACKEND_URL}/invitations/invite/`, dependencies);
