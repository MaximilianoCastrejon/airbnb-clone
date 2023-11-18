import { LoginCredentials, VerifiedUser } from '@interfaces/auth.interfaces';
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
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.post(
      `/auth/signup`,
      credentials
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<VerifiedUser> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const res: VerifiedUser = await axiosInstance.get(`/auth/verify`, config);
    return res;
  } catch (error) {
    throw error;
  }
};
