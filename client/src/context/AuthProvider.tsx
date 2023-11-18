import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import {
  AuthContextType,
  User,
  SignupCredentials,
  LoginCredentials
} from '../interfaces/auth.interfaces';
import * as request from '../api/auth.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userContext, setUserContext] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to log in the user
  const login = async (credentials: LoginCredentials) => {
    // Implement your authentication logic here
    // Set the user if authentication is successful
    request
      .loginUser(credentials)
      .then((res) => {
        if (res.status === 200) {
          setUserContext(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        setErrors(error.response.data.message);
      });
  };
  const signup = async (credentials: SignupCredentials) => {
    // Implement your authentication logic here
    // Set the user if authentication is successful

    const form_data = new FormData();

    if (credentials.email && credentials.password && credentials.username) {
      form_data.append('email', credentials.email);
      form_data.append('password', credentials.password);
      form_data.append('username', credentials.username);
      form_data.append('image', credentials.profile_image);
    } else {
      return alert('Please fill out every field');
    }

    request
      .registerUser(form_data)
      .then((res) => {
        if (res.status === 200) {
          setUserContext(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        setErrors(error.response.data.message);
      });
  };

  // Function to log out the user
  const logout = () => {
    Cookies.remove('token');
    setUserContext(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      const cookiesList = Cookies.get();
      if (!cookiesList.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return true;
      }

      try {
        const res = await request.verifyToken(cookiesList.token);
        if (!res.data) {
          return setIsAuthenticated(false);
        }
        setIsAuthenticated(true);
        setUserContext(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    isLoggedIn();
  }, []);

  const contextValue: AuthContextType = {
    userContext,
    login,
    logout,
    signup,
    isAuthenticated,
    errors,
    loading
  };

  // function AuthProvider() {
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
