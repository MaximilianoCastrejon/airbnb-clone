import { AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';
import { Listing } from '../interfaces/listing.interfaces';

export const postListing = async (listing: Listing): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axiosInstance.post(`/listings`, listing);
    return res;
  } catch (error) {
    throw error;
  }
};
