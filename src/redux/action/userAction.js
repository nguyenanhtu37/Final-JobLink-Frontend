export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";

export const doLogin = (data) => {
  return {
    type: FETCH_USER_LOGIN_SUCCESS,
    payload: data,
  };
};

export const DO_LOGOUT = "DO_LOGOUT";

export const doLogout = () => {
  return {
    type: DO_LOGOUT,
  };
};

export const UPDATE_USERNAME_SUCCESS = "UPDATE_USERNAME_SUCCESS";

export const updateUserSuccess = (username) => {
  return {
    type: UPDATE_USERNAME_SUCCESS,
    payload: username,
  };
};
