import { postData, putData, useFetch } from './backendCommon';
import { BACKEND_URL } from './constants';

export const useGroup = (groupName, page, hashtags, dependencies) => {
  let queries = '';
  if (page) {
    queries = `?page=${encodeURIComponent(JSON.stringify(page))}`;
  }
  if (hashtags && hashtags.length > 0) {
    if (queries.length > 0) {
      queries = `${queries}&hashtags=${encodeURIComponent(JSON.stringify(hashtags))}`;
    } else {
      queries = `&hashtags=${encodeURIComponent(JSON.stringify(hashtags))}`;
    }
  }
  return useFetch(`${BACKEND_URL}/group/group/${encodeURIComponent(groupName)}${queries}`, dependencies);
};
export const useGroupById = (groupName) => useFetch(`${BACKEND_URL}/group/byid/${groupName}`);

export const useUserGroups = (tags, order) => {
  let queries = '';
  const dependencies = [tags, order];
  if (tags && tags.length > 0) {
    queries = `?tags=${encodeURIComponent(JSON.stringify(tags))}`;
  }
  if (order === 'recent' || order === 'members' || order === 'posts') {
    if (queries.length > 0) {
      queries = `${queries}&order=${order}`;
    } else {
      queries = `?order=${order}`;
    }
  }
  return useFetch(`${BACKEND_URL}/group/groups/public${queries}`, dependencies);
};

export const useMyGroups = (dependencies = []) => {
  return useFetch(`${BACKEND_URL}/group/groups/me`, dependencies);
};

export const useRecommendedGroups = (dependencies = []) => {
  return useFetch(`${BACKEND_URL}/group/groups/recommended`, dependencies);
};

export const useFeed = () => useFetch(`${BACKEND_URL}/group/feed`);

export const changeAdmin = async (group, user) => putData(`${BACKEND_URL}/group/changeAdmin`, {
  group,
  user
});
export const leaveGroup = async (group) => putData(`${BACKEND_URL}/group/leave`, { group });

export const createGroup = async (group) => postData(`${BACKEND_URL}/group/create`, group);

