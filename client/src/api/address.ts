import { AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';
import { Address } from '../interfaces/address.interfaces';

export const postAddress = async (address: Address): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.post(`/address`, address);
    return res;
  } catch (error) {
    throw error;
  }
};
