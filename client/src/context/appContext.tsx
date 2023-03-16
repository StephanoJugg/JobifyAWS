import { useReducer, createContext, useContext } from "react";
import axios from "axios";

import reducer from "./reducer";
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
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
} from "./actions";

import { ProviderType, UserType, LocalStrorageUser } from "./contextTypes";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("userLocation");

const initialState: UserType = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token ? token : "",
  userLocation: userLocation ? userLocation : "",
  jobLocation: userLocation ? userLocation : "",
  showSidebar: false,
  displayAlert: () => {},
  registerUser: (currentUser: any) => {},
  loginUser: (currentUser: any) => {},
  setupUser: (curentUser: any, endPoint: string, alertText: string) => {},
  toggleSidebar: () => {},
  logoutUser: () => {},
};

const AppContext = createContext<UserType>(initialState);

const AppProvider: React.FC<ProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({
    user,
    token,
    userLocation,
  }: LocalStrorageUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("userLocation", userLocation);
  };

  const removeUserToLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userLocation");
  };

  const registerUser = async (currentUser: any) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        currentUser
      );
      const {
        user,
        token,
        location,
      }: { user: any; token: string; location: string } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({
        user: user,
        token: token,
        userLocation: location,
      });
    } catch (error: any) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser: any) => {
    dispatch({ type: LOGIN_USER_BEGIN });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        currentUser
      );

      const { user, token, location } = response.data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });

      addUserToLocalStorage({
        user: user,
        token: token,
        userLocation: location,
      });
    } catch (error: any) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const setupUser = async (
    currentUser: any,
    endPoint: string,
    alertText: string
  ) => {
    dispatch({ type: SETUP_USER_BEGIN });

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, token, location } = response.data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });

      addUserToLocalStorage({
        user: user,
        token: token,
        userLocation: location,
      });
    } catch (error: any) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserToLocalStorage();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext, initialState };
