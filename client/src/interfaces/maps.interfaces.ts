import { GoogleMapProps } from '@react-google-maps/api';

export interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface IPInfoResponse {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}
export type Position = { coords: { latitude: number; longitude: number } };
export type SuccessCallback = (position: Position) => void;
export type ErrorCallback = (error: Error) => void;
export type LatLngLiteral = google.maps.LatLngLiteral;
export type GeocoderAddressComponent = google.maps.GeocoderAddressComponent;
export type AutocompleteType = google.maps.places.Autocomplete;
export type AutocompletePrediction = google.maps.places.AutocompletePrediction;
export type MapComponentProps = {
  center: LatLngLiteral;
  zoom: number;
} & GoogleMapProps;

export type Library =
  | 'core'
  | 'maps'
  | 'places'
  | 'geocoding'
  | 'routes'
  | 'marker'
  | 'geometry'
  | 'elevation'
  | 'streetView'
  | 'journeySharing'
  | 'drawing'
  | 'visualization';
export type Libraries = Library[];
