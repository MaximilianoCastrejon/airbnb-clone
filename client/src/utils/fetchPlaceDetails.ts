import axios, { AxiosResponse } from 'axios';
import { GOOGLE_API_KEY } from '../config';
import {
  FetchLocationResponse,
  PlaceState
} from '../interfaces/address.interfaces';

export const fetchLocationDetails = {
  PlaceId: async (placeId: string): Promise<FetchLocationResponse> => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    let placeResult: google.maps.places.PlaceResult =
      {} as google.maps.places.PlaceResult;
    let loading: boolean = true;
    let error = '';
    let placeDetails: Partial<PlaceState> = {};

    try {
      await new Promise<void>((resolve, reject) => {
        service.getDetails({ placeId }, (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            placeResult = result;
            resolve(); // Resolve the Promise here
          } else {
            error = `Failed to fetch place details: ${status}`;
            resolve(); // Resolve even on error to allow for setting default value
          }
          loading = false;
        });
      });
    } catch (err) {
      error = `Error occurred: ${err}`;
      loading = false;
    }
    if (
      placeResult.address_components &&
      placeResult.address_components.length > 0
    ) {
      placeDetails.address_components = [...placeResult.address_components];
    }
    if (placeResult.geometry && placeResult.geometry.location) {
      placeDetails = {
        ...placeDetails,
        lat: placeResult.geometry.location.lat(),
        lng: placeResult.geometry.location.lng()
      };
    }
    placeDetails.place_id = placeId;

    return { placeDetails, loading, error };
  },

  currentLocation: async (
    lat: number,
    lng: number
  ): Promise<FetchLocationResponse> => {
    const url = new URL(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    // let placeDetails: google.maps.GeocoderResult | null = null;
    let placeDetails: Partial<PlaceState> = {};

    let loading: boolean = true;
    let error = '';

    try {
      const result: AxiosResponse = await axios.get(`${url}`);
      if (result.status === 200) {
        const data: google.maps.GeocoderResponse = result.data;
        const results = data.results[0];
        placeDetails = {
          place_id: results.place_id,
          address_components: results.address_components,
          lat: lat,
          lng: lng
        };
      } else {
        error = `Failed to fetch place details: ${result.status}`;
      }
    } catch (err) {
      error = `Error occurred: ${err}`;
    } finally {
      loading = false;
    }
    return { placeDetails, loading, error };
  }
};

// import axios from 'axios';
// import { GOOGLE_API_KEY } from '../config';

// type PlaceIdReturnType = {
//   placeDetails: google.maps.places.PlaceResult;
//   loading: boolean;
//   error: string;
// };

// type LocationReturnType = {
//   placeDetails: google.maps.GeocoderResult;
//   loading: boolean;
//   error: string;
// };

// export const fetchLocationDetails = {
//   PlaceId: async (placeId: string): Promise<PlaceIdReturnType> => {
//     const service = new google.maps.places.PlacesService(
//       document.createElement('div')
//     );
//     let placeDetails: google.maps.places.PlaceResult =
//       {} as google.maps.places.PlaceResult;
//     let loading: boolean = true;
//     let error = '';

//     try {
//       await new Promise<void>((resolve, reject) => {
//         service.getDetails({ placeId }, (result, status) => {
//           if (status === google.maps.places.PlacesServiceStatus.OK && result) {
//             placeDetails = result;
//             console.log(placeDetails);
//             resolve(); // Resolve the Promise here
//           } else {
//             error = `Failed to fetch place details: ${status}`;
//             resolve(); // Resolve even on error to allow for setting default value
//           }
//           loading = false;
//         });
//       });
//     } catch (err) {
//       error = `Error occurred: ${err}`;
//       loading = false;
//     }
//     return { placeDetails, loading, error };
//   },

//   currentLocation: async (
//     lat: number,
//     lng: number
//   ): Promise<LocationReturnType> => {
//     const url = new URL(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
//     );
//     // let placeDetails: google.maps.GeocoderResult | null = null;
//     let placeDetails: google.maps.GeocoderResult =
//       {} as google.maps.GeocoderResult;

//     let loading: boolean = true;
//     let error = '';

//     try {
//       const result = await axios.get(`${url}`);
//       if (result.status === 200) {
//         placeDetails = result.data.results[0];
//         console.log(placeDetails);
//       } else {
//         error = `Failed to fetch place details: ${result.status}`;
//       }
//     } catch (err) {
//       error = `Error occurred: ${err}`;
//     } finally {
//       loading = false;
//     }
//     return { placeDetails, loading, error };
//   }
// };
