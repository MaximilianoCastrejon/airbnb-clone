import { useEffect, useState } from 'react';
import { IPINFO_TOKEN } from '../config';

type SuccessCallback = (position: {
  coords: { latitude: number; longitude: number };
}) => void;
type ErrorCallback = (error: any) => void;

const getIPLocation = (
  successCallback: SuccessCallback,
  errorCallback: ErrorCallback
): void => {
  fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
    .then((response) => response.json())
    .then((data: { loc: string }) => {
      const [lat, lng] = data.loc.split(',');
      successCallback({
        coords: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      });
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const useCurrentLocation = () => {
  const [clientLocation, setClientLocation] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setClientLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      getIPLocation(
        (position) => {
          setClientLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error', error);
          throw new Error('Fetching of coordinates failed');
        }
      );
    }
  }, []);

  return clientLocation;
};

export default useCurrentLocation;
