export type NumericField<ModelFields> = {
  name: keyof ModelFields;
  operator: '=' | '<' | '>' | '<=' | '>=';
  value: string | number | Date;
};

export type queryResponse<Data, Keys> = {
  key: Keys;
  data: Data;
  status: number;
};
