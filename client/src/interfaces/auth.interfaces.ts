import { CustomError } from './error.interfaces';
import { UpdateFunction } from '../hooks/useError';

export interface AuthContextType {
  userContext: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loginError: CustomError | null;
  signupError: CustomError | null;
  setLoginError: UpdateFunction;
  setSignupError: UpdateFunction;
  validationError: CustomError | null;
  loading: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile_image: File | string;
  listings: Boolean;
}

export interface UserDetails {
  refered_by?: string;
  username: string;
  middle_name?: string;
  first_last_name?: string;
  second_last_name?: string;
  email: string;
  password: string;
  profile_image_url: string;
  isSuperHost?: boolean;
  referal_code?: string;
  address?: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  profile_image: File | string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
