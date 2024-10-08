import axios, { AxiosResponse } from 'axios';
import { GOOGLE_API_KEY } from '../config';
import { PlaceState } from '../interfaces/address.interfaces';

/**
 * Get location details based on place ID or coordinates.
 *
 * @typedef {Object} CoordsParams - Coordinates from the current location or fallback coordinates if Place doesn't provide geometry object.
 * @property {number} lat - Latitude value.
 * @property {number} lng - Longitude value.
 *
 * @typedef {Object} GetLocationDetailsParams - Parameters for getting location details.
 * @property {string} [id] - The place ID to fetch details for (optional).
 * @property {CoordsParams} coords - The coordinates to fetch details for.
 *
 * @param {GetLocationDetailsParams} fields - The parameters to fetch location details.
 * @returns {Promise<Partial<PlaceState>>} A promise that resolves to the place details (PlaceState).
 */
export async function getLocationDetails(
  {
    id,
    coords
  }: {
    id?: string;
    coords: { lat: number; lng: number };
  },
  type?: string
): Promise<PlaceState> {
  if (id) {
    try {
      // Fetch
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      let placeResult: google.maps.places.PlaceResult =
        {} as google.maps.places.PlaceResult;
      let error = '';
      let placeDetails = {} as PlaceState;

      await new Promise<void>((resolve) => {
        service.getDetails(
          { placeId: id, fields: ['type'] },
          (result, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              result
            ) {
              console.log(result);
              placeResult = result;
              resolve();
            } else {
              error = `Failed to fetch place details: ${status}`;
              resolve();
            }
          }
        );
      });
      const { address_components, geometry } = placeResult;
      const lat =
        geometry && geometry.location ? geometry.location.lat : coords.lat;
      const lng =
        geometry && geometry.location ? geometry.location.lng : coords.lng;

      placeDetails = {
        address_components: address_components || [],
        lat: lat as number,
        lng: lng as number,
        place_id: id
      };

      return placeDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    const url = new URL(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`
    );
    try {
      // Fetch
      const response: AxiosResponse<google.maps.GeocoderResponse> =
        await axios.get(`${url}`);

      if (response.status !== 200 || !response.data.results[0])
        throw new Error(
          `Place not found for coordinates: {lat:${coords.lat}, lng:${coords.lng}`
        );
      const geocoderResponse = response.data.results[0];
      const { place_id, address_components, geometry } = geocoderResponse;
      const lat =
        geometry && geometry.location ? geometry.location.lat : coords.lat;
      const lng =
        geometry && geometry.location ? geometry.location.lng : coords.lng;

      return {
        place_id: place_id,
        address_components: address_components,
        lat: lat as number,
        lng: lng as number
      };
    } catch (error) {
      throw error;
    }
  }
}

export const getCountryCenter = async ({
  lat,
  lng
}: {
  lat: number;
  lng: number;
}): Promise<{ lat: number; lng: number }> => {
  try {
    const countryCenterRes: AxiosResponse<google.maps.GeocoderResponse> =
      await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}}&key=${GOOGLE_API_KEY}`
      );
    if (countryCenterRes.status !== 200 || !countryCenterRes.data)
      throw new Error('Country component not found in geocoding response.');

    const countryComponent = countryCenterRes.data.results.find((component) =>
      component.types[0].includes('country')
    );
    const ROME_COORDS = { lat: 41.90278, lng: 12.496366 };

    const location = {
      lat: countryComponent?.geometry.location.lat || ROME_COORDS.lat,
      lng: countryComponent?.geometry.location.lng || ROME_COORDS.lng
    };
    // Fallback value. "All roads lead to Rome"
    const countryLat = location.lat as number;
    const countryLng = location.lng as number;
    const countryCenter = { lat: countryLat, lng: countryLng };
    return countryCenter;
  } catch (error) {
    throw error;
  }
};
