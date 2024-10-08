import { GOOGLE_API_KEY } from '../config';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
import ServiceUnavailable from './ServiceUnavailable';
import { useEffect, useMemo, useState } from 'react';
import {
  MapComponentProps,
  AutocompletePrediction
} from '../interfaces/maps.interfaces';
import { GOOGLE_MAPS_LIBRARIES } from '../config.ts';
import useCurrentLocation from '../hooks/useCurrentLocation.ts';
import { PlaceState } from '../interfaces/address.interfaces.ts';
import GoogleMapsListingPin from './GoogleMapsListingPin.tsx';
import { InputEvent } from '../interfaces/input.interfaces.ts';
import { getLocationDetails } from '../utils/fetchPlaceDetails.ts';
import paths from '../assets/svg_paths.js';
import useDebounce from '../utils/debounce.ts';

interface GoogleMapComponentProps {
  getDetails?: (details: PlaceState) => void;
  coords?: (LatLng: { lat: number; lng: number }) => void;
}

const GoogleMapComponent = ({
  getDetails,
  coords
}: GoogleMapComponentProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });
  const [showNavigateArrow, setShowNavigateArrow] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [displayPredictions, setDisplayPredictions] = useState(false);
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [addressInput, setAddressInput] = useState('');
  const [isAutocompleteServiceLoading, setIsAutocompleteServiceLoading] =
    useState(false);
  const initialPosition = useCurrentLocation();

  useEffect(() => {
    addressInput && autocompleteService(addressInput);
  }, [addressInput]);

  useEffect(() => {
    if (map && map.getCenter()) {
      const center = map.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();

        if (coords) {
          coords({ lat, lng });
        }
      }
    }
  }, [map?.getCenter()?.lat(), map?.getCenter()?.lng()]);

  const autocompleteService = useDebounce((inputValue: string) => {
    if (map && inputValue) {
      const bounds = map.getBounds();
      AutocompleteService.getPlacePredictions(
        {
          input: inputValue,
          locationBias: bounds || null,
          types: ['geocode', 'establishment']
        },
        (predictions) => {
          setPredictions(predictions || []);
          setDisplayPredictions(true);
          setIsAutocompleteServiceLoading(false);
        }
      );
    } else {
      setPredictions([]);
      setIsAutocompleteServiceLoading(false);
    }
  }, 1000);

  const MapComponent: React.FC<MapComponentProps> = ({ ...props }) => {
    return (
      <div></div>
      // <GoogleMap
      //   mapContainerStyle={{ width: '100%', height: '100%' }}
      //   options={{
      //     zoomControl: true,
      //     scrollwheel: false,
      //     streetViewControl: false,
      //     mapTypeControl: false,
      //     fullscreenControl: false,
      //     styles: [
      //       {
      //         featureType: 'poi',
      //         stylers: [{ visibility: 'off' }]
      //       }
      //     ]
      //   }}
      //   {...props}
      // />
    );
  };
  const memoizedMapComponent = useMemo(() => {
    return (
      <MapComponent
        center={initialPosition}
        zoom={13}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onLoad={(map) => {
          setMap(map);
          map.addListener('wheel', (event: WheelEvent) => {
            if (event.ctrlKey) {
              event.preventDefault();
            }
          });
          map.addListener('touchstart', (event: TouchEvent) => {
            event.preventDefault();
          });
        }}
      />
    );
  }, [initialPosition]);

  if (!isLoaded || loadError) return <div>Loading...</div>;
  // LOAD AUTOCOMPLETE SERVICE
  const AutoService = google.maps.places.AutocompleteService;
  const AutocompleteService = new AutoService();

  //TODO: Fix loading and navigation arrow when user deletes input
  const handleInputChange = (event: InputEvent) => {
    const value = event.target.value;
    setShowNavigateArrow(value.length > 0);
    const inputValue = event.target.value;
    setAddressInput(inputValue);
    setIsAutocompleteServiceLoading(true);
  };

  const setPlace = async ({
    id,
    coords
  }: {
    id?: string;
    coords: { lat: number; lng: number };
  }) => {
    setLoadingData(true);
    setPredictions([]);
    try {
      let details: PlaceState;
      details = id
        ? await getLocationDetails({ id, coords })
        : await getLocationDetails({ coords });

      if (!details || !details.lat || !details.lng || !map)
        throw new Error('Coordinates cannot be processed on the map');
      if (getDetails) getDetails(details);
      map.setZoom(18);
      map.panTo({ lat: details.lat, lng: details.lng });
    } catch (error) {
      console.log(error);
    }
    setLoadingData(false);
    setShowNavigateArrow(false);
  };

  const handlePredictionClick = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setAddressInput(prediction.description);
    setPlace({
      id: prediction.place_id,
      coords: {
        lat: map?.getCenter()?.lat() || initialPosition.lat,
        lng: map?.getCenter()?.lng() || initialPosition.lng
      }
    });
  };

  return (
    <div className="h-[50vh] mt-[10vh] w-full flex flex-row">
      <div className="w-full rounded-lg overflow-hidden relative">
        {isLoaded && (
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
                <Autocomplete className="flex-1">
                  <input
                    type="text"
                    className="w-full border-none outline-none"
                    placeholder="Type your address"
                    value={addressInput}
                    onFocus={() => {
                      predictions.length > 0
                        ? setDisplayPredictions(true)
                        : setShowNavigateArrow(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        !loadingData && setShowNavigateArrow(false);
                        setDisplayPredictions(false);
                      }, 200);
                    }}
                    onChange={(e) => handleInputChange(e)}
                  ></input>
                </Autocomplete>
              </div>
              {showNavigateArrow && addressInput.length === 0 && (
                <div
                  className="p-2 mt-4 hover:bg-neutral-300 hover:cursor-pointer "
                  onClick={() => {
                    setPlace({
                      coords: {
                        lat: initialPosition.lat,
                        lng: initialPosition.lng
                      }
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
                        <path d={paths.NAVIGATION_ARROW}></path>
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
                          handlePredictionClick(prediction);
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
                                <path fill="#000" d={paths.BUILDINGS} />
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
          {isLoaded && (
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
