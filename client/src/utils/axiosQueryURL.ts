import { NumericField, queryResponse } from '../interfaces/query.interfaces';
import axios, { AxiosRequestConfig } from 'axios';
import axiosInstance from '../api/axios.instance';
import { API_URL } from '../config';

type QueryData<QueryID> = {
  key: QueryID;
  query: {};
  numericFields: NumericField<any>[];
  count: boolean;
  endPoint: string;
  config?: AxiosRequestConfig;
};

function isQueriesArray<QueryID>(
  queries: QueryData<QueryID>[] | QueryData<QueryID>
): queries is QueryData<QueryID>[] {
  return Array.isArray(queries);
}

export const fetchData = async <Data extends unknown, QueryID>({
  queries,
  signal
}: {
  queries: QueryData<QueryID>[] | QueryData<QueryID>;
  signal: AbortSignal;
}): Promise<queryResponse<Data, QueryID>[]> => {
  const queriesArray = isQueriesArray(queries) ? queries : [queries];

  const responses: queryResponse<Data, QueryID>[] = await Promise.all(
    queriesArray.map(
      async ({ query, numericFields, key, count, endPoint, config }) => {
        const queryURL = {
          endPoint: endPoint,
          query: query,
          numericFields: numericFields,
          key: key as QueryID,
          count: count,
          config: { ...config },
          signal: signal
        };
        try {
          const res = await axiosQueryUrl<Data, QueryID>(queryURL);
          return res;
        } catch (error) {
          return {
            key: key as QueryID,
            data: 0 as Data, // Default data value
            status: 500 // Default status code for errors
          } as queryResponse<Data, QueryID>;
        }
      }
    )
  );

  return responses;
};

export async function axiosQueryUrl<Data, QueryID>({
  endPoint,
  count,
  query,
  numericFields,
  config,
  key,
  signal
}: {
  endPoint: string;
  count: boolean;
  key: QueryID;
  query?: {};
  numericFields?: NumericField<any>[];
  config?: AxiosRequestConfig;
  signal: AbortSignal;
}): Promise<queryResponse<Data, QueryID>> {
  const url = new URL(`${API_URL}${endPoint}`);
  url.searchParams.append('query', JSON.stringify(query));
  if (numericFields && numericFields?.length > 0) {
    const joinedNumericFields = numericFields
      .map((param) => Object.values(param).join(''))
      .join(',');
    url.searchParams.append(
      'numericFields',
      JSON.stringify(joinedNumericFields)
    );
  }
  url.searchParams.append('count', JSON.stringify(count));
  config = {
    ...config,
    signal // Attach the abort signal
  };
  try {
    const response = await axiosInstance.get<Data>(`${url}`, config);
    const queryResponse: queryResponse<Data, QueryID> = {
      data: response.data,
      status: response.status,
      key: key
    };
    return queryResponse;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      console.error('Error fetching data:', error);
    }
    throw error;
  }
}
