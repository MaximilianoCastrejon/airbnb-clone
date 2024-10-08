import { AxiosRequestConfig } from 'axios';

export type NumericQueryParams<ModelFields> = {
  name: keyof ModelFields;
  operator: '=' | '<' | '>' | '<=' | '>=';
  value: string | number | Date;
};

export type queryResponse<Data> = {
  data: Data;
  status: number;
};

export type QueryBuilder<
  IdOptions,
  StringFields,
  NumericFields,
  StructureFields = void
> = {
  id: IdOptions;
  query: Partial<StringFields>;
  numericFields: NumericQueryParams<Partial<NumericFields>>[];
  count: boolean;
  endPoint: string;
  pagination?: { page: number; limit: number } | null;
  config: AxiosRequestConfig;
  sort?: (keyof StructureFields)[];
  projection?: (keyof StructureFields)[];
  populate?: (keyof StructureFields)[];
};

export type QueryFields = {
  query: {};
  numericFields: NumericQueryParams<any>[];
  count: boolean;
  endPoint: string;
};
