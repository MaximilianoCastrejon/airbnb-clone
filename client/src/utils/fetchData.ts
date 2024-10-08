import { QueryFields, queryResponse } from '../interfaces/query.interfaces';
import { AxiosRequestConfig } from 'axios';
import getRequest from '../api/generic';
import buildURL from './buildURL';

const fetchData = async <T>(
  query: QueryFields,
  config?: AxiosRequestConfig | undefined | {}
): Promise<queryResponse<T>> => {
  try {
    const url = buildURL({ ...query });
    const res = await getRequest<T>(`${url}`, config);
    return res;
  } catch (error: any) {
    console.error(`Error fetching data for endpoint: ${query.endPoint}`, error);
    throw error;
  }
};

export default fetchData;
