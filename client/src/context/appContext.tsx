import { useReducer, createContext, useContext, useEffect } from "react";
import axios from "axios";

import reducer from "./reducer";
import * as Actions from "./actions";

import {
  ProviderType,
  UserType,
  LocalStrorageUser,
  UserActions,
  UserContextType,
  StatsType,
  MonthlyApplicationType,
} from "./contextTypes";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("userLocation");

const initialState: UserContextType = {
  _id: "",
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  name: user ? JSON.parse(user).name : "",
  token: token ? token : "",
  userLocation: userLocation ? userLocation : "",
  showSidebar: false,
  displayAlert: () => {},
  registerUser: (currentUser: UserType) => {},
  loginUser: (currentUser: UserType) => {},
  setupUser: (curentUser: any, endPoint: string, alertText: string) => {},
  toggleSidebar: () => {},
  logoutUser: () => {},
  updateUser: (user: UserType) => {},
  handleChange: () => {},
  clearValues: () => {},
  createJob: () => {},
  getJobs: () => {},
  setEditJob: (id) => {},
  deleteJob: (id) => {},
  editJob: () => {},
  showStats: () => {},
  clearFilters: () => {},
  changePage: () => {},
  jobLocation: userLocation ? userLocation : "",
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobTypeOptions: ["full-time", "part-time", "contract", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  allJobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  createdBy: user ? JSON.parse(user)._id : "",
  stats: {} as StatsType,
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = createContext<UserContextType>(initialState);

const AppProvider: React.FC<ProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "http://localhost:4000/api/v1",
  });

  //request interceptor to add token to every request
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //response interceptor to refresh token on receiving token expired error

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        dispatch({ type: Actions.LOGOUT_USER });
        removeUserToLocalStorage();
      }

      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: Actions.DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: Actions.CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token }: LocalStrorageUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("id", user._id!);
    localStorage.setItem("userLocation", user.userLocation);
  };

  const removeUserToLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("userLocation");
  };

  const registerUser = async (currentUser: UserType) => {
    dispatch({ type: Actions.REGISTER_USER_BEGIN });
    try {
      const response = await authFetch.post("/auth/register", currentUser);
      const {
        user,
        token,
        location,
      }: { user: UserType; token: string; location: string } = response.data;
      dispatch({
        type: Actions.REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({
        user: user,
        token: token,
      });
    } catch (error: any) {
      dispatch({
        type: Actions.REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser: UserType) => {
    dispatch({ type: Actions.LOGIN_USER_BEGIN });

    try {
      const response = await authFetch.post("/auth/login", currentUser);

      const { user, token, location } = response.data;

      dispatch({
        type: Actions.LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });

      addUserToLocalStorage({
        user: user,
        token: token,
      });
    } catch (error: any) {
      dispatch({
        type: Actions.LOGIN_USER_ERROR,
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
    dispatch({ type: Actions.SETUP_USER_BEGIN });
    try {
      const response = await authFetch.post(`/auth/${endPoint}`, currentUser);

      const { user, token }: { user: any; token: string } = response.data;

      dispatch({
        type: Actions.SETUP_USER_SUCCESS,
        payload: { user, token, alertText },
      });

      addUserToLocalStorage({
        user: user,
        token: token,
      });
    } catch (error: any) {
      dispatch({
        type: Actions.SETUP_USER_ERROR,
        payload: { msg: error.message },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: Actions.TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: Actions.LOGOUT_USER });
    removeUserToLocalStorage();
  };

  const updateUser = async (currentUser: UserType) => {
    dispatch({ type: Actions.UPDATE_USER_BEGIN });

    try {
      const response = await authFetch.patch("/auth/update", currentUser);
      const { user, token }: { user: UserType; token: string } = response.data;
      dispatch({
        type: Actions.UPDATE_USER_SUCCESS,
        payload: { user, token },
      });
      addUserToLocalStorage({
        user: user,
        token: token,
      });
    } catch (error: any) {
      if (error.response.status !== 401) {
        dispatch({
          type: Actions.UPDATE_USER_ERROR,
          payload: { msg: error.message },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    dispatch({ type: Actions.HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: Actions.CLEAR_VALUES });
  };

  const createJob = async () => {
    dispatch({ type: Actions.CREATE_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.post("/jobs", {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });

      dispatch({ type: Actions.CREATE_JOB_SUCCESS });

      dispatch({ type: Actions.CLEAR_VALUES });
    } catch (error: any) {
      if (error.response.status !== 401) {
        dispatch({
          type: Actions.CREATE_JOB_ERROR,
          payload: { msg: error.message },
        });
      }
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&type=${searchType}&sort=${sort}`;

    if (search) url = url.concat(`&search=${search}`);

    dispatch({ type: Actions.GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { allJobs, totalJobs, numOfPages } = data;

      dispatch({
        type: Actions.GET_JOBS_SUCCESS,
        payload: { allJobs, totalJobs, numOfPages },
      });
    } catch (error: any) {
      logoutUser();
    }

    clearAlert();
  };

  const setEditJob = (id: string) => {
    dispatch({ type: Actions.SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: Actions.EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: Actions.EDIT_JOB_SUCCESS });
      dispatch({ type: Actions.CLEAR_VALUES });
    } catch (error: any) {
      if (error.response.status !== 401) {
        dispatch({
          type: Actions.EDIT_JOB_ERROR,
          payload: { msg: error.message },
        });
      }
    }
    clearAlert();
  };

  const deleteJob = async (id: string) => {
    dispatch({ type: Actions.DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${id}`);
      getJobs();
    } catch (error: any) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: Actions.SHOW_STATS_BEGIN });

    try {
      const { data } = await authFetch.get("/jobs/stats");
      dispatch({
        type: Actions.SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.formatedMonthlyApplication,
        },
      });
    } catch (error: any) {
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: Actions.CLEAR_FILTERS });
  };

  const changePage = (page: number) => {
    dispatch({ type: Actions.CHANGE_PAGE, payload: { page } });
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
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
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
