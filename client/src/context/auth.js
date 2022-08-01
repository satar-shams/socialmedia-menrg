import { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

export const Auth = createContext();

const initialState = {
  user: {},
};
if (localStorage.getItem('userData')) {
  const savedUser = JSON.parse(localStorage.getItem('userData'));
  const decodedToken = jwtDecode(savedUser.token);
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('userData');
  } else {
    initialState.user = savedUser;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOG_IN':
      return { ...state, user: action.payload };
    case 'LOG_OUT':
      localStorage.removeItem('userData');
      return { ...state, user: {} };

    default:
      return state;
  }
}
export function AuthProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Auth.Provider value={value}>{props.children}</Auth.Provider>;
}
