 export interface ProviderType  {
    children: React.ReactNode;
  };
  
  export interface UserType {
    isLoading: boolean;
    showAlert: boolean;
    alertText: string;
    alertType: string;
    user: any;
    token: string;
    userLocation: string;
    jobLocation: string;
    showSidebar: boolean;
    displayAlert: () => void;
    registerUser: (currentUser: any) => void;
    loginUser: (currentUser: any) => void;
    setupUser: (currentUser: any, endPoint: string, alertText: string ) => void;
    toggleSidebar: () => void;
    logoutUser: () => void;
  }
  
  export interface LocalStrorageUser {
    user: any;
    token: string;
    userLocation: string;
  }
