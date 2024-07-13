import { GOOGLE_API_KEY } from '../config';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
import ServiceUnavailable from './ServiceUnavailable';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapComponentProps,
  AutocompletePrediction
} from '../interfaces/maps.interfaces';
import { GOOGLE_MAPS_LIBRARIES } from '../config.ts';
import useCurrentLocation from '../hooks/useCurrentLocation.ts';
import {
  FetchLocationResponse,
  PlaceState
} from '../interfaces/address.interfaces.ts';
import GoogleMapsListingPin from './GoogleMapsListingPin.tsx';
import { InputEvent } from '../interfaces/input.interfaces.ts';
import { fetchLocationDetails } from '../utils/fetchPlaceDetails.ts';
import debounce from 'lodash.debounce';

const GoogleMapComponent = ({
  setPlaceDetails
}: {
  setPlaceDetails?: {
    FullAddress: (place: PlaceState) => void;
    LatLng: (LatLng: { lat: number; lng: number }) => void;
  };
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });
  const [displayUseCurrentPositionButton, setDisplayUseCurrentPositionButton] =
    useState(false);
  const [displayPredictions, setDisplayPredictions] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [addressInput, setAddressInput] = useState(String);
  const [isAutocompleteServiceLoading, setIsAutocompleteServiceLoading] =
    useState(false);
  const initialPosition = useCurrentLocation();
  const requestCount = useRef(0);
  const currentRequestId = useRef(0); // Ref to keep track of the current request ID

  useEffect(() => {
    if (map && map.getCenter()) {
      const center = map.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();

        if (setPlaceDetails) {
          setPlaceDetails.LatLng({ lat, lng });
        }
      }
    }
  }, [map?.getCenter()?.lat(), map?.getCenter()?.lng()]);

  const MapComponent: React.FC<MapComponentProps> = ({ center, zoom }) => {
    return (
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: true,
          scrollwheel: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
        onLoad={(map) => {
          setMap(map);
          // Add a listener to prevent zooming with the touchpad
          map.addListener('wheel', (event: WheelEvent) => {
            if (event.ctrlKey) {
              event.preventDefault(); // Prevent zooming with Ctrl + mouse wheel
            }
          });

          // Optional: Disable pinch-to-zoom
          map.addListener('touchstart', (event: TouchEvent) => {
            event.preventDefault(); // Prevent zooming with touch gestures
          });
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    );
  };

  // initialPosition included as dependency for when the position is fetched
  const memoizedMapComponent = useMemo(() => {
    return <MapComponent center={initialPosition} zoom={13} />;
  }, [initialPosition]);

  if (!isLoaded || loadError) return <div>Loading...</div>;
  const AutoService = google.maps.places.AutocompleteService;
  const AutocompleteService = new AutoService();

  const autocompleteService = debounce((inputValue: string) => {
    if (map) {
      const bounds = map.getBounds();

      const requestId = ++currentRequestId.current; // Increment and get the new request ID
      console.log(`Input Value: ${inputValue}`); // Log the request ID for debugging
      if (inputValue) {
        AutocompleteService.getPlacePredictions(
          {
            input: inputValue,
            locationBias: bounds || null,
            types: ['geocode', 'establishment']
          },
          (predictions) => {
            if (currentRequestId.current === requestId) {
              setPredictions(predictions || []);
              setDisplayPredictions(true);
              setIsAutocompleteServiceLoading(false); // Set loading to false after fetching predictions
            }
          }
        );
      } else {
        setPredictions([]);
        setIsAutocompleteServiceLoading(false);
      }
    }
    setIsAutocompleteServiceLoading(false);
  }, 1000);

  const handleInputChange = (event: InputEvent) => {
    const isUserTyping = event.target.value.length > 0;

    isUserTyping
      ? setDisplayUseCurrentPositionButton(false)
      : setDisplayUseCurrentPositionButton(true);

    const inputValue = event.target.value;
    setAddressInput(inputValue);
    setIsAutocompleteServiceLoading(true);
    autocompleteService(inputValue);
  };

  const setPlace = async ({
    lat,
    lng,
    place_id
  }: {
    lat?: number;
    lng?: number;
    place_id?: string;
  }) => {
    if (!setPlaceDetails)
      return console.log(
        'Set state action in the following shape required: {address_components: google.maps.GeocoderAddressComponent[], lat: number, lng: number};'
      );

    let place: PlaceState = {} as PlaceState;

    setLoadingData(true);
    setPredictions([]);
    try {
      if (place_id) {
        const response: FetchLocationResponse =
          await fetchLocationDetails.PlaceId(place_id);
        if (!response.loading && response.error) {
          throw new Error('Error fetching data for current location');
        }
        const location =
          response.placeDetails.lat && response.placeDetails.lng
            ? {
                lat: response.placeDetails.lat,
                lng: response.placeDetails.lng
              }
            : undefined;
        const mapCenter =
          map?.getCenter() != undefined
            ? { lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }
            : initialPosition;

        const center = location ? { ...location } : mapCenter;
        const address_components = response.placeDetails.address_components;

        if (!address_components || !response.placeDetails.place_id) return;
        place = {
          place_id: response.placeDetails.place_id,
          address_components: address_components,
          lat: center.lat,
          lng: center.lng
        };
      }
      if (lat && lng) {
        const response = await fetchLocationDetails.currentLocation(lat, lng);
        if (!response.loading && response.error) {
          throw new Error('Error fetching data for current location');
        }
        const address_components = response.placeDetails.address_components;
        if (!address_components || !response.placeDetails.place_id) return;
        place = {
          place_id: response.placeDetails.place_id,
          address_components: address_components,
          lat: lat,
          lng: lng
        };
      }
      setPlaceDetails.FullAddress(place);

      if (!place.lat || !place.lng || !map) return;
      map.setZoom(18);
      map.panTo({ lat: place.lat, lng: place.lng });
    } catch (error) {
      console.log(error);
      throw new Error('Geocoding API request failed');
    }
    setLoadingData(false);
    setDisplayUseCurrentPositionButton(false);
  };

  return (
    <div className="h-[50vh] mt-[10vh] w-full flex flex-row">
      <div className="w-full rounded-lg overflow-hidden relative">
        {isLoaded && setPlaceDetails && (
          <>
            <div className="absolute right-0 left-0 items-center mx-4 mt-6 bg-white menu-shadow rounded-lg z-20 ">
              <div className="flex focus-within:outline p-4 rounded-lg">
                <div className="h-6 w-12 mr-2">
                  <svg
                    className="mr-2 ml-4 block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    id="bell-icon"
                    height="24px"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      className="justify-center"
                      d="M8 .5C4.96.5 2.5 3 2.5 6s1.83 6.08 5.5 9.25C11.67 12.08 13.5 9 13.5 6A5.5 5.5 0 0 0 8 .5zM8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    ></path>
                  </svg>
                </div>
                <Autocomplete
                  // onLoad={(el) => setAutocomplete(el)}
                  className="flex-1"
                >
                  <input
                    type="text"
                    className="w-full border-none outline-none"
                    placeholder="Type your address"
                    value={addressInput}
                    onFocus={() => {
                      predictions.length > 0
                        ? setDisplayPredictions(true)
                        : setDisplayUseCurrentPositionButton(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        !loadingData &&
                          setDisplayUseCurrentPositionButton(false);
                        setDisplayPredictions(false);
                      }, 200);
                    }}
                    onChange={(e) => handleInputChange(e)}
                  ></input>
                </Autocomplete>
              </div>
              {displayUseCurrentPositionButton && predictions.length <= 0 && (
                <div
                  className="p-2 mt-4 hover:bg-neutral-300 hover:cursor-pointer "
                  onClick={() => {
                    setPlace({
                      lat: initialPosition.lat,
                      lng: initialPosition.lng
                    });
                  }}
                >
                  <div className="w-full flex ">
                    <div className="flex justify-center items-center p-3 mr-3 bg-white rounded-full">
                      <svg
                        className="block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 18 18"
                        id="bell-icon"
                        height="18px"
                        width="18px"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M10.84 16.35c-.17.41-.61.72-1.05.64A1.04 1.04 0 0 1 9 16V9H1.94a.94.94 0 0 1-.36-1.8l13.1-5.12a.95.95 0 0 1 1.04.2c.28.27.36.67.2 1.03z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className="font-normal text-sm">
                        Use my current location
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {predictions &&
                displayPredictions &&
                !isAutocompleteServiceLoading && (
                  <div className="mt-4">
                    {predictions.map((prediction) => (
                      <div
                        className="p-2 hover:bg-neutral-300 hover:cursor-pointer"
                        key={prediction.place_id}
                        onClick={() => {
                          setAddressInput(prediction.description);
                          setPlace({ place_id: prediction.place_id });
                        }}
                      >
                        <div className="w-full flex ">
                          <div className="flex justify-center items-center p-3 mr-3 bg-white rounded-full">
                            <svg
                              width={18}
                              height={18}
                              viewBox="-1000 -1000 1000 1000"
                              id="shadowEllipse"
                              xmlns="http://www.w3.org/2000/svg"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <g transform="translate(0, 0) scale(0.2) rotate(180)">
                                <path
                                  fill="#000"
                                  d="M1448 4202 l-928 -155 0 -1874 0 -1873 -260 0 -260 0 0 -150 0 -150
                                  2560 0 2560 0 0 150 0 150 -260 0 -260 0 0 1680 0 1680 -945 0 -945 0 0 -1680
                                  0 -1680 -150 0 -150 0 0 2030 c0 1927 -1 2030 -17 2029 -10 -1 -435 -71 -945
                                  -157z m542 -392 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z
                                  m-732 -732 l3 -148 -161 0 -160 0 0 150 0 151 158 -3 157 -3 3 -147z
                                  m730 0 l3 -148 -161 0 -160 0 0 150 0 151 158 -3 157 -3 3 -147z
                                  m1462 2 l0 -150 -160 0 -160 0 0 143 c0 79 3 147 7 150 3 4 75 7 160 7
                                  l153 0 0 -150z m730 0 l0 -150 -160 0 -160 0 0 143 c0 79 3 147 7 150
                                  3 4 75 7 160 7 l153 0 0 -150z m-2922 -737 l-3 -148 -157 -3 -158 -3
                                  0 151 0 150 160 0 161 0 -3 -147z m730 0 l-3 -148 -157 -3 -158 -3 0 151
                                  0 150 160 0 161 0 -3 -147z m1462 -3 l0 -151 -157 3 -158 3 -3 148 -3 147
                                  161 0 160 0 0 -150z m730 0 l0 -151 -157 3 -158 3 -3 148 -3 147 161 0
                                  160 0 0 -150z m-2922 -727 l-3 -148 -157 -3 -158 -3 0 151 0 150 160 0
                                  161 0 -3 -147z m732 -3 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0
                                  0 -150z m1460 0 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z
                                  m730 0 l0 -151 -157 3 -158 3 -3 148 -3 147 161 0 160 0 0 -150z m-2200 -945
                                  l0 -365 -150 0 -150 0 0 215 0 215 -215 0 -215 0 0 -215 0 -215 -150 0 -150 0
                                  0 365 0 365 515 0 515 0 0 -365z m1470 215 l0 -150 -160 0 -160 0 0 150 0 150
                                  160 0 160 0 0 -150z m730 0 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0
                                  0 -150z"
                                />
                              </g>
                            </svg>
                          </div>
                          <div className="flex-1 flex items-start flex-col">
                            <p className="font-normal text-sm">
                              {prediction.structured_formatting.main_text}
                            </p>
                            <p className="font-normal text-sm">
                              {prediction.structured_formatting.secondary_text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              {/* Show the loading animation while fetching predictions */}
              {isAutocompleteServiceLoading && (
                <div className="loading-container py-8 px-5 flex justify-center items-center mt-2">
                  <div className="dot dot1"></div>
                  <div className="dot dot2"></div>
                  <div className="dot dot3"></div>
                </div>
              )}
            </div>
          </>
        )}
        <>
          {isLoaded && (
            <div className="w-full h-full">{memoizedMapComponent}</div>
          )}
          {isLoaded && setPlaceDetails && (
            <div
              id="pin-container"
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none ${
                isDragging ? 'dragging' : 'not-dragging'
              }`}
            >
              <GoogleMapsListingPin version={1} isDragging={isDragging} />
            </div>
          )}
        </>
        {loadError && <ServiceUnavailable />}
      </div>
    </div>
  );
};

export default GoogleMapComponent;
