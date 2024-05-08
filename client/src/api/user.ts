import { AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';

export const getUserProfile = async (
  userid: string
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.get(
      `user/profile?user_id=${userid}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};
