import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserFormData extends RegisterFormData {
  lastName: string;
  userLocation: string;
}

interface AuthData {
  user: CognitoUser | null;
  register: (formData: RegisterFormData) => Promise<void>;
  login: (formData: RegisterFormData) => Promise<void>;
  autoLogin: () => Promise<void>;
  updateUser: (formData: UpdateUserFormData) => Promise<void>;
}

const AuthContext = createContext<AuthData>({
  user: null,
  login: async (formData) => {},
  register: async (formData) => {},
  autoLogin: async () => {},
  updateUser: async (formData) => {},
});

const useAuth = (): AuthData => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const isAuthenticated = !!user;

  const autoLogin = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log("user is ", user);

      setUser(user);
    } catch (err) {
      console.log(err);
    }
  };

  const login = async (formData: RegisterFormData) => {
    try {
      const user: CognitoUser = await Auth.signIn(
        formData.email,
        formData.password
      );
      setUser(user);
    } catch (err) {
      throw err;
    }
  };

  const register = async (formData: RegisterFormData) => {
    try {
      await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          "custom:name": formData.name,
          "custom:last_name": "Smith",
          "custom:userLocation": "USA",
        },
      });
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (formData: UpdateUserFormData) => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, {
        username: formData.email,
        "custom:name": formData.name,
        "custom:last_name": formData.lastName,
        "custom:userLocation": formData.userLocation,
      });
    } catch (err) {
      throw err;
    }
  };

  return {
    user,
    login,
    register,
    autoLogin,
    updateUser,
  };
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.autoLogin().then(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
