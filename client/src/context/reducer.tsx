import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
} from "./actions";

interface Action {
  type: string;
  payload?: any;
}

interface State {
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
  user: any;
  token: string;
  userLocation: string;
  jobLocation: string;
}

const reducer = (state: State, action: Action): State => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertText: "Please enter a valid email address",
      alertType: "danger",
    };
  }

  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertText: "",
      alertType: "",
    };
  }

  if (action.type === REGISTER_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: "User registered successfully",
      isLoading: false,
    };
  }

  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
      isLoading: false,
    };
  }

  if (action.type === LOGIN_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: "User logged in successfully",
      isLoading: false,
    };
  }

  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
      isLoading: false,
    };
  }

  if (action.type === SETUP_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: action.payload.alertText,
      isLoading: false,
    };
  }

  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
      isLoading: false,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
