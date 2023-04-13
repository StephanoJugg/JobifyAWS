import { CognitoUser } from 'amazon-cognito-identity-js';

export interface User {
  username: string;
  cognitoUser: CognitoUser;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserFormData extends RegisterFormData {
  lastName: string;
  userLocation: string;
}

export interface AuthData {
  user: CognitoUser | null;
  isLoading: boolean;
  showAlert: boolean;
  alert: Alert;
  register: (formData: RegisterFormData) => Promise<void>;
  login: (formData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  autoLogin: () => Promise<void>;
  updateUser: (formData: UpdateUserFormData) => Promise<void>;
  displayAlert: () => void;
  getUserAttributes: (user: CognitoUser) => Promise<Map<any, any>>;
}

export interface Alert {
  alertType: string;
  alertMessage: string;
}

export interface CognitoUserAttribute {
  Name: string;
  Value: string;
}
