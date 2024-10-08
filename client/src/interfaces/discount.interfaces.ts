export type DiscountCode = {
  _id: string;
  name: string;
  code: string;
  discount: number;
  max_number_of_uses: number;
  current_uses: number;
  max_number_of_uses_per_user: number;
  max_number_of_uses_per_listing: number;
  startDate: Date;
  expirationDate: Date;
  criteria: Criterion[];
  not_applicable_message: string;
};

export type DiscountCodePreview = Pick<
  DiscountCode,
  'name' | 'code' | 'discount' | '_id' | 'max_number_of_uses' | 'current_uses'
>;

export type Criterion = {};
