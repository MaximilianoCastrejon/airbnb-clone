import { NumericKeys, StringKeys } from './types.interfaces';

export interface Listing {
  title: string;
  host_id: string;
  description: string;
  reservation_type: ReservationType;
  subcategory: string;
  address: string;
  bedroom_count: number; // ReservationType: Entire place & Private rooms
  bed_count: number; // ReservationType: Entire place & Shared rooms & Private rooms
  bathrooms: number; // ReservationType: Entire place & Shared rooms
  lockOnEveryBedroom?: boolean; // ReservationType: Private rooms -
  private_bathroom_count: number;
  dedicated_bathroom_count: number;
  shared_bathroom_count: number;
  encounter_type: 'host' | 'family' | 'other_guests' | 'roommates';
  // - Private rooms
  price_per_night: number;
  price_currency: string;
  show_exact_location: boolean;
  accomodates_count: number;
  availability_type: 'AVAILABLE' | 'BLOCKED' | 'UNDER_MAINTENANCE';
  booking_acceptance_type: 'immediate' | 'under_approval';
  minimum_stay_duration: number;
  maximum_stay_duration: number;
  accepted_guest_type: 'Any' | 'Experienced';
  security_cameras: boolean;
  weapons_around: boolean;
  dangerous_animals_around: boolean;
  start_date_ISO: Date;
  cleaning_fees?: number;
  cleaning_fees_percentage?: number;
  end_date_ISO?: Date;
  unavailable_period_ISO?: {
    from: Date;
    to: Date;
  };
  refund_type?:
    | 'flexible'
    | 'moderate'
    | 'strict'
    | 'super_strict_30'
    | 'super_strict_60'
    | 'super_strict_long_term'
    | 'grace_period';
  checkin_time?: string;
  checkout_time?: string;
  weekend_custom_price?: number;
  applicable_discounts?: string[]; // Assuming these are discount code IDs
  checkin_method?: string; // Assuming this is a reference to a check-in method
  wifi_network_name?: string;
  wifi_password?: string;
  house_manual?: string;
}

export type ReservationTypeNames =
  | 'Entire place'
  | 'Private room'
  | 'Shared room';

export interface ReservationType {
  _id: string;
  name: ReservationTypeNames | '';
  description: string;
  svg_icon_paths: string[];
  active: boolean;
}
export const ReservationTypeInitialState: ReservationType = {
  _id: '',
  name: '',
  description: '',
  svg_icon_paths: [''],
  active: true
};

export const ListingInitial: Listing = {
  title: '',
  host_id: '',
  description: '',
  reservation_type: ReservationTypeInitialState,
  subcategory: '',
  address: '',
  price_per_night: 0,
  price_currency: '',
  show_exact_location: false,
  bedroom_count: 0,
  bed_count: 0,
  bathrooms: 0,
  lockOnEveryBedroom: false,
  private_bathroom_count: 0,
  dedicated_bathroom_count: 0,
  shared_bathroom_count: 0,
  encounter_type: 'host',
  accomodates_count: 0,
  availability_type: 'AVAILABLE',
  booking_acceptance_type: 'immediate',
  start_date_ISO: new Date(),
  minimum_stay_duration: 0,
  maximum_stay_duration: 0,
  checkin_time: '',
  checkout_time: '',
  accepted_guest_type: 'Any',
  security_cameras: false,
  weapons_around: false,
  dangerous_animals_around: false,
  applicable_discounts: []
};

export interface ListingSubCategory {
  _id: string;
  name: string;
  description: string;
  icon_svg?: string;
  icon_image_url: string;
  active: boolean;
}
export const ListingSubCategoryInitialState: ListingSubCategory = {
  _id: '',
  name: '',
  description: '',
  icon_image_url: '',
  icon_svg: '',
  active: true
};

export type EntirePlaceFields = Pick<
  Listing,
  'bedroom_count' | 'bed_count' | 'bathrooms'
>;
export type PrivateRoomFields = Pick<
  Listing,
  | 'bedroom_count'
  | 'bed_count'
  | 'lockOnEveryBedroom'
  | 'private_bathroom_count'
  | 'dedicated_bathroom_count'
  | 'shared_bathroom_count'
  | 'encounter_type'
>;
export type SharedRoomFields = Pick<Listing, 'bed_count' | 'bathrooms'>;

const CurrencyStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  UNDER_REVIEW: 3,
  SUSPENDED: 4,
  OBSOLETE: 5,
  PENDING_ACTIVATION: 6
} as const;

type CurrencyStatusType = (typeof CurrencyStatus)[keyof typeof CurrencyStatus];

export type Currency = {
  _id: string;
  name: string;
  iso_code: string;
  icon: string;
  status: CurrencyStatusType;
};

// Create an object type with keys of type string from Booking interface
export type StringFieldsOfListing = Pick<Listing, StringKeys<Listing>>;
export type NumericFieldsOfListing = Pick<Listing, NumericKeys<Listing>>;
