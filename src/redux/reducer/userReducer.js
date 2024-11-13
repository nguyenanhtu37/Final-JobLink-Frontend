import {
  DO_LOGOUT,
  FETCH_USER_LOGIN_SUCCESS,
  UPDATE_USERNAME_SUCCESS,
} from "../action/userAction";

const INITIAL_STATE = {
  account: {
    email: "",
    access_token: "",
    refresh_token: "",
    username: "",
    role: "",
    id: "",
    isBlock: "",
  },
  isAuthenticated: false,
};
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN_SUCCESS:
      return {
        ...state,
        account: {
          access_token: action?.payload?.access_token,
          refresh_token: action?.payload?.refresh_token,
          username: action?.payload?.user?.username,
          role: action?.payload?.user?.role?.name,
          email: action?.payload?.user?.email,
          id: action?.payload?.user?._id, 
          isBlock: action?.payload?.user?.isBlock,
        },
        isAuthenticated: true,
      };
    case UPDATE_USERNAME_SUCCESS:
      return {
        ...state,
        account: {
          ...state.account,
          username: action.payload, // Update the username in state
        },
      };
    case DO_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
