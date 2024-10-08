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
import useCustomError from '../hooks/useError.ts';
import { RequiredKeys } from '../interfaces/types.interfaces.ts';
import validateForm from '../utils/validateForm.ts';
import { ValidationError } from '../interfaces/error.interfaces.ts';

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
  const [loginError, setLoginError] = useCustomError();
  const [signupError, setSignupError] = useCustomError();
  const [validationError, setValidationError] = useCustomError();
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    request
      .loginUser(credentials)
      .then((res) => {
        if (res.status === 200) {
          setUserContext(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        setLoginError(error);
      });
    return isAuthenticated;
  };

  const signup = async (credentials: SignupCredentials) => {
    const form_data = new FormData();
    const RequiredCredentials: RequiredKeys<SignupCredentials>[] = [
      'email',
      'password',
      'profile_image',
      'username'
    ];
    try {
      const validatedCredentials = await validateForm<SignupCredentials>(
        credentials,
        RequiredCredentials
      );

      Object.keys(validatedCredentials).forEach((key) => {
        const field = key as keyof SignupCredentials;
        const value = validatedCredentials[field];
        if (value !== undefined) {
          console.log(value);
          form_data.append(key, value as string | Blob);
        }
      });
      for (const pair of form_data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const registered = await request.registerUser(form_data);
      if (registered.status === 200) {
        setUserContext(registered.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        setSignupError(error, { context: 'Required fields missing' });
      } else {
        setSignupError(error, {
          context: 'Failed registration. Try again later'
        });
      }
    }
  };

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
        setUserContext(null);
        setLoading(false);
        return;
      }
      request
        .verifyToken(cookiesList.token)
        .then((res) => {
          if (!res.data) {
            setIsAuthenticated(false);
            setUserContext(null);
            return;
          }
          setIsAuthenticated(true);
          setUserContext(res.data);
        })
        .catch((error) => {
          setValidationError(error, {
            context: 'Login unsuccessful. Token validation failed.'
          });
          setIsAuthenticated(false);
          setUserContext(null);
        })
        .finally(() => setLoading(false));
    };
    isLoggedIn();
  }, []);

  const contextValue: AuthContextType = {
    userContext,
    login,
    logout,
    signup,
    isAuthenticated,
    loginError,
    signupError,
    setLoginError,
    setSignupError,
    validationError,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
