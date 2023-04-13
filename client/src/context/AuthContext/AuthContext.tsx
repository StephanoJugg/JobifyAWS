import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  RegisterFormData,
  UpdateUserFormData,
  AuthData,
  Alert,
  User,
  CognitoUserAttribute,
} from './contextTypes';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk/lib/credentials';

const initialState: AuthData = {
  user: null,
  isLoading: false,
  showAlert: false,
  alert: {
    alertType: '',
    alertMessage: '',
  },
  login: async (formData) => {},
  register: async (formData) => {},
  logout: async () => {},
  autoLogin: async () => {},
  updateUser: async (formData) => {},
  displayAlert: () => {},
  getUserAttributes: async (user: CognitoUser) => Promise.resolve(new Map()),
};

const AuthContext = createContext<AuthData>(initialState);

// const useAuth = (): AuthData => {

// };

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const auth = useAuth();
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [alert, setAlert] = useState<Alert>({} as Alert);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const getAWSTemporaryCreds = async (user: CognitoUser) => {
    const cognitoIdentityPool = `cognito-idp.eu-central-1.amazonaws.com/eu-central-1_kU37rZIY8`;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: 'eu-central-1:e69c969a-a989-42a2-a924-d6cd56468094',
        Logins: {
          [cognitoIdentityPool]: user
            .getSignInUserSession()!
            .getIdToken()
            .getJwtToken(),
        },
      },
      {
        region: 'eu-central-1',
      }
    );
    await refreshCredentials();
  };

  const refreshCredentials = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      (AWS.config.credentials as Credentials).refresh((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const displayAlert = () => {
    setShowAlert(true);
    console.log(
      'HEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEE' + showAlert
    );
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const autoLogin = async () => {
    setIsLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
      setIsLoading(false);
      console.log(user);
      console.log(user?.getSignInUserSession()?.getIdToken().getJwtToken());

      await getAWSTemporaryCreds(user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    console.log('auto login' + user);
    autoLogin().then(() => setIsLoading(false));
  }, []);

  const login = async (formData: RegisterFormData) => {
    setIsLoading(true);
    try {
      const user: CognitoUser = await Auth.signIn(
        formData.email,
        formData.password
      );
      setUser(user);
      setAlert({
        alertType: 'success',
        alertMessage: 'You are logged in',
      });
      setIsLoading(false);
      await getAWSTemporaryCreds(user);
    } catch (err) {
      throw err;
    }
  };

  const register = async (formData: RegisterFormData) => {
    setIsLoading(true);
    try {
      await Auth.signUp({
        username: formData.email,
        password: formData.password!,
        attributes: {
          email: formData.email,
          'custom:name': formData.name,
          'custom:last_name': 'Smith',
          'custom:userLocation': 'USA',
        },
      });
      setAlert({
        alertType: 'success',
        alertMessage: 'User registered successfully',
      });
      setIsLoading(false);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async (formData: UpdateUserFormData) => {
    setIsLoading(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, {
        email: formData.email,
        'custom:name': formData.name,
        'custom:last_name': formData.lastName,
        'custom:userLocation': formData.userLocation,
      });
      setAlert({
        alertType: 'success',
        alertMessage: 'User updated successfully',
      });
      setIsLoading(false);
    } catch (err) {
      throw err;
    }
  };

  const getUserAttributes = async (user: CognitoUser) => {
    //const result: CognitoUserAttribute = ;
    const userAttributes = await Auth.userAttributes(user);
    const newMap = new Map();
    userAttributes.forEach((item) => {
      newMap.set(item.Name, item.Value);
    });

    return newMap;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        alert,
        showAlert,
        isLoading,
        login,
        register,
        logout,
        autoLogin,
        updateUser,
        displayAlert,
        getUserAttributes,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
