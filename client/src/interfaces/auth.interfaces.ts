import { AxiosResponse } from 'axios';

// Define the type for your authentication context value
export interface AuthContextType {
  userContext: User | null; // The authenticated user or null if not authenticated
  login: (credentials: LoginCredentials) => Promise<AxiosResponse | void>; // Function to log in
  signup: (credentials: SignupCredentials) => Promise<void>; // Function to sign up
  clearErrors: () => void; // Function to sign up
  logout: () => void; // Function to log out
  isAuthenticated: boolean;
  errors: string[];
  loading: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile_image: File | string;
  listings: [String];
  // Other user-related fields
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
export interface ApiError {
  status: string;
  statusCode: number;
  message: string;
}

export interface ApiResponse {
  data: any; // Define the structure based on your API response
}

export interface VerifiedUser extends AxiosResponse {
  username: string;
  email: string;
  password: string;
  profile_image: File | string;
  // data: {
  //   user: User;
  //   [key: string]: any;
  // };
}
