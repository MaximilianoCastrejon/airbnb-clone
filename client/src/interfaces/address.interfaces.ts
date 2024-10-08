import { GeocoderAddressComponent } from './maps.interfaces';

export interface Address {
  street_name: string;
  street_number: number | null;
  accomodation_local_id?: string;
  postal_code: number | null;
  neighbourhood_description?: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  municipality: string;
  sublocality: string;
  state: string;
  city: string;
  place_id: string;
  active: boolean;
}

export const AddressState = {
  street_name: '',
  street_number: 0,
  accomodation_local_id: '',
  postal_code: 0,
  neighbourhood_description: '',
  country: '',
  latitude: 0,
  longitude: 0,
  municipality: '',
  sublocality: '',
  state: '',
  city: '',
  place_id: '',
  active: true
};

export type PlaceState = {
  place_id: string;
  lat: number;
  lng: number;
  address_components: GeocoderAddressComponent[] | []; // Can be empty array because the user can fill out the fields for the listing form
};

export type FetchLocationResponse = {
  placeDetails: PlaceState;
  loading: boolean;
  error: string;
};
