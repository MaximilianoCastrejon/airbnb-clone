import { NumericKeys, StringKeys } from './types.interfaces';

export interface Booking {
  listing_id: string;
  guest_id: string;
  host_id: string;
  cohosts: string[];
  check_in_date_UTC: Date;
  check_out_date_UTC: Date;
  price_per_night: number;
  total_reservation_cost: number;
  tax_paid: number;
  site_fees: number;
  amount_paid: number;
  total_discounted_reservation_cost?: number;
  is_refund?: boolean;
  cancel_date_UTC?: Date;
  refund_paid?: number;
  transaction_id?: string;
  effective_amount?: number;
  discount_codes?: string[];
  booking_date_UTC: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  canceled_by_host?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Reservations {
  reservations: Booking[];
}

export type TabKey =
  | 'checking_out'
  | 'current'
  | 'upcoming'
  | 'upcoming_soon'
  | 'pending';

export type Reservations_Count = {
  [key in TabKey]: number;
} & {
  totalCount: number;
};

// Create an object type with keys of type string from Booking interface
export type StringFieldsOfBooking = Pick<Booking, StringKeys<Booking>>;
export type NumericFieldsOfBooking = Pick<Booking, NumericKeys<Booking>>;
