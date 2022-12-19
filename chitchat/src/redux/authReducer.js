import { clearAuth, setAuth } from './actions';

const initial_state = null;

function authReducer(state = initial_state, {
  type,
  payload
}) {
  switch (type) {
    case setAuth:
      return payload;
    case clearAuth:
      return null;
    default:
      return state;
  }
}

export default authReducer;
