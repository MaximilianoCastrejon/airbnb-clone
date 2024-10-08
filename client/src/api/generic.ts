import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';
import { queryResponse } from '../interfaces/query.interfaces';

const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<queryResponse<T>> => {
  try {
    const res: AxiosResponse = await axiosInstance.get(`${url}`, config);
    const response: queryResponse<T> = { data: res.data, status: res.status };
    return response;
  } catch (error) {
    throw error;
  }
};

export default getRequest;
