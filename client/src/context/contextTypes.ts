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
    displayAlert: () => void;
    registerUser: (currentUser: any) => void;
    loginUser: (currentUser: any) => void;
    setupUser: (currentUser: any, endPoint: string, alertText: string ) => void;
  }
  
  export interface LocalStrorageUser {
    user: any;
    token: string;
    userLocation: string;
  }
