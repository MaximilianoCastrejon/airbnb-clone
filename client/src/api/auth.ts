import { LoginCredentials, User } from '../interfaces/auth.interfaces';
import { AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `/auth/login`,
      credentials
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  credentials: FormData
): Promise<AxiosResponse<User>> => {
  try {
    const res: AxiosResponse<User> = await axiosInstance.post(
      `/auth/signup`,
      credentials
      // { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (
  token: string
): Promise<AxiosResponse<User>> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const res: AxiosResponse<User> = await axiosInstance.get(
      `/auth/verify`,
      config
    );
    return res;
  } catch (error) {
    throw error;
  }
};
