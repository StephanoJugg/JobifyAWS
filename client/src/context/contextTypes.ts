 export interface ProviderType  {
    children: React.ReactNode;
  };
  
  export interface UserType {
    _id: string;
    name: string;
    email?: string;
    lastName?: string;
    userLocation: string;
    jobLocation: string;
  }

  export interface AlertType {
    alertText: string;
    alertType: string;
  }

  export interface UserActions { 
    displayAlert: () => void;
    registerUser: (currentUser: UserType) => void;
    loginUser: (currentUser: UserType) => void;
    setupUser: (currentUser: any, endPoint: string, alertText: string ) => void;
    toggleSidebar: () => void;
    logoutUser: () => void;
    updateUser: (currentUser: UserType) => void;
    handleChange: ({name, value} : {name: string, value: string}) => void;
    clearValues: () => void;
    createJob: () => void;
    getJobs: () => void;
    setEditJob: (id: string) => void;
    deleteJob: (id: string) => void;
    editJob: () => void;
    showStats: () => void;
    clearFilters: () => void;
    changePage : (page: number) => void;
  }

  export interface UserContextType extends UserType, UserActions, AlertType, JobsType, AllStatsType, SearchQueryParamsType {
    user: UserType | null;
    token: string;
    showSidebar: boolean;
    isLoading: boolean;
    showAlert: boolean;
  };
  
  export interface LocalStrorageUser {
    user: UserType;
    token: string;
  }

  export interface JobsType extends JobType{
    isEditing: boolean;
    editJobId: string;
    jobTypeOptions: string[];
    statusOptions: string[];
    allJobs: Array<JobType>;
    totalJobs: number;
    numOfPages: number;
    page: number;
  }

  export interface JobType {
    _id: string;
    position: string;
    company: string;
    status: string;
    jobType: string;
    jobLocation: string;
    createdBy: string;
  }

  export interface StatsType {
    pending: number;
    declined: number;
    interview: number; 
  }

  export interface AllStatsType {
    stats: StatsType;
    monthlyApplications: Array<MonthlyApplicationType>;
  }

  export interface MonthlyApplicationType {
    date: string;
    count: number;
  }


  export interface SearchQueryParamsType {
    search: string;
    searchStatus: string;
    searchType: string;
    sort: string;
    sortOptions: string[];
  }
