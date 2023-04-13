import * as Actions from './actions';

import {
  UserType,
  JobsType,
  AlertType,
  AllStatsType,
  SearchQueryParamsType,
} from './contextTypes';

import { initialState } from './appContext';

interface Action {
  type: string;
  payload?: any;
}

interface State
  extends UserType,
    JobsType,
    AlertType,
    AllStatsType,
    SearchQueryParamsType {
  showAlert: boolean;
  isLoading: boolean;
  showSidebar: boolean;
}

const reducer = (state: State, action: Action): State => {
  if (action.type === Actions.DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    };
  }

  if (action.type === Actions.CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertText: '',
      alertType: '',
    };
  }

  if (action.type === Actions.TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }

  if (action.type === Actions.HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === Actions.CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: '',
      position: '',
      company: '',
      jobType: 'full-time',
      status: 'pending',
    };

    return {
      ...state,
      ...initialState,
    };
  }

  if (action.type === Actions.CREATE_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === Actions.CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Job created successfully',
    };
  }

  if (action.type === Actions.CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === Actions.GET_JOBS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === Actions.GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      allJobs: action.payload.allJobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }

  if (action.type === Actions.SET_EDIT_JOB) {
    const job = state.allJobs.find((job) => job._id === action.payload.id);
    if (!job) {
      throw new Error(`no such job with id : ${action.payload.id}`);
    }
    const { _id, position, company, jobType, status } = job;

    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobType,
      status,
    };
  }

  if (action.type === Actions.DELETE_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === Actions.EDIT_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === Actions.EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'User updated successfully',
    };
  }

  if (action.type === Actions.EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === Actions.SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === Actions.SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }

  if (action.type === Actions.CLEAR_FILTERS) {
    return {
      ...state,
      search: '',
      searchStatus: 'all',
      searchType: 'all',
      sort: 'latest',
    };
  }

  if ((action.type = Actions.CHANGE_PAGE)) {
    return {
      ...state,
      page: action.payload.page,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
