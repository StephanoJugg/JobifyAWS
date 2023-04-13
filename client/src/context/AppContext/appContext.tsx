import { useReducer, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

import reducer from './reducer';
import * as Actions from './actions';
import { useAuthContext } from '../AuthContext/AuthContext';
import { API } from 'aws-amplify';

import {
  ProviderType,
  UserType,
  UserContextType,
  StatsType,
} from './contextTypes';

const initialState: UserContextType = {
  _id: '',
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,
  displayAlert: () => {},
  toggleSidebar: () => {},
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
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'contract', 'internship'],
  jobType: 'full-time',
  jobLocation: '',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  allJobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {} as StatsType,
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = createContext<UserContextType>(initialState);

const AppProvider: React.FC<ProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { logout, user, getUserAttributes } = useAuthContext();

  const init = {
    headers: {
      Authorization: `Bearer ${user
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()}`,
    },
  };
  console.log('user', user);
  const displayAlert = () => {
    dispatch({ type: Actions.DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: Actions.CLEAR_ALERT });
    }, 3000);
  };

  const toggleSidebar = () => {
    dispatch({ type: Actions.TOGGLE_SIDEBAR });
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
      const { position, company, jobType, status, jobLocation } = state;
      const createdBy = user?.getUsername();

      await API.post('jobs', '/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
        createdBy,
        ...init,
      });

      dispatch({ type: Actions.CREATE_JOB_SUCCESS });

      dispatch({ type: Actions.CLEAR_VALUES });
    } catch (error: any) {
      dispatch({
        type: Actions.CREATE_JOB_ERROR,
        payload: { msg: error.message },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    dispatch({ type: Actions.GET_JOBS_BEGIN });
    try {
      const data = await API.get('jobs', '/jobs', init);
      console.log(JSON.stringify(data));
      console.log(user?.getSignInUserSession());

      dispatch({
        type: Actions.GET_JOBS_SUCCESS,
      });
    } catch (error: any) {
      logout();
    }

    clearAlert();
  };

  const setEditJob = (id: string) => {
    dispatch({ type: Actions.SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: Actions.EDIT_JOB_BEGIN });
    try {
      const { position, company, jobType, status } = state;

      await API.patch('jobs', `/jobs/${state.editJobId}`, {
        company,
        position,
        jobType,
        status,
        ...init,
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
      await API.del('jobs', `/jobs/${id}`, init);
      getJobs();
    } catch (error: any) {
      logout();
    }
  };

  const showStats = async () => {
    dispatch({ type: Actions.SHOW_STATS_BEGIN });

    try {
      const { data } = await API.get('jobs', '/jobs/stats', init);
      dispatch({
        type: Actions.SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.formatedMonthlyApplication,
        },
      });
    } catch (error: any) {
      logout();
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
        toggleSidebar,
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
