import { GOOGLE_API_KEY } from '../config';
import Header_HostHomes from '../components/Header_HostHomes';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_LIBRARIES } from '../config.js';
import ServiceUnavailable from '../components/ServiceUnavailable';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleAddressComponent } from '../interfaces/maps.interfaces.js';
import axios from 'axios';

function HostHomes() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });
  // TODO: change into a custom hook

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0
  });
  // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          centerCountry(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  const centerCountry = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = response.data;

      if (data.status != 'OK') throw new Error('Geocoding API request failed');

      const countryComponent = data.results[0].address_components.find(
        (component: GoogleAddressComponent) =>
          component.types.includes('country')
      );
      if (!countryComponent)
        throw new Error('Country component not found in geocoding response.');

      const isoCountry = countryComponent.short_name;
      const countryCenterRes = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${isoCountry}&key=${GOOGLE_API_KEY}`
      );
      const countryCenter = countryCenterRes.data.results[0].geometry.location;
      setMapCenter({ lat: countryCenter.lat, lng: countryCenter.lng });
    } catch (error) {
      console.error('Error positioning map center:', error);
    }
  };
  return (
    <div>
      <Header_HostHomes />
      <div className="h-[calc(90vh-5rem)] mt-[10vh] flex flex-row px-20">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <p className="text-primary text-5xl font-semibold mb-2">Airbnb it.</p>
          <p className="text-5xl font-semibold mb-6">Your could earn</p>
          <p className="text-7xl font-semibold align-middle justify-center  text-center items-center m-3">
            $4,941 MXN
          </p>
          <p>
            <span className="underline cursor-pointer font-semibold">
              7 nights
            </span>{' '}
            at an estimated $706 MXN a night
          </p>
          <div>Slider</div>
        </div>
        <div className="w-1/2 rounded-lg overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              center={mapCenter}
              zoom={8}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
              }}
            />
          ) : (
            <ServiceUnavailable />
          )}
        </div>
      </div>
      <div className="flex flex-col px-20 mb-20">
        <Link to={''} className="font-semibold text-4xl my-28 text-center">
          Airbnb it easily with Airbnb Setup
        </Link>
        <img
          src={'../src/assets/host-homes-super-hosts.webp'}
          className="w-full h-full"
        ></img>
        <div className="flex flex-row justify-between mt-10">
          <div className="flex flex-col max-w-xs">
            <p className="font-medium text-lg ">
              One-to-one guidance from a Superhost
            </p>
            <p className="font-normal text-base text-left text-neutral-500">
              We{'’'}ll match you with a Superhost in your area, who{'’'}ll
              guide you from your first question to your first guest—by phone,
              video call, or chat.
            </p>
          </div>
          <div className="flex flex-col max-w-xs">
            <p className="font-medium text-lg ">
              An experienced guest for your first booking
            </p>
            <p className="font-normal text-base text-left text-neutral-500">
              For your first booking, you can choose to welcome an experienced
              guest who has at least three stays and a good track record on
              Airbnb.
            </p>
          </div>
          <div className="flex flex-col max-w-xs">
            <p className="font-medium text-lg ">
              Specialized support from Airbnb
            </p>
            <p className="font-normal text-base text-left text-neutral-500">
              New Hosts get one-tap access to specially trained Community
              Support agents who can help with everything from account issues to
              billing support.
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 ">
          <p className="font-bold text-5xl text-center font-poppins">
            <span className="text-primary ">air</span>cover
          </p>
          <p className="text-center font-medium  text-lg">for Hosts</p>
        </div>
        <p className="text-4xl mb-16 text-center font-semibold">
          Airbnb it with top-to-bottom protection
        </p>
        <div className="mx-auto md:w-[804px] mb-20">
          <table className="border-collapse w-full border-neutral-500">
            <thead>
              <tr className="h-12 pb-6">
                <th></th>
                <th
                  scope="col"
                  className="pb-6 min-w-[148px] text-xl align-middle"
                >
                  Airbnb
                </th>
                <th
                  scope="col"
                  className="pb-6 min-w-[148px] text-xl align-middle"
                >
                  Competitors
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-semibold">
                  Guest identity verification
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="check" />
              </tr>
              <tr className="">
                <td colSpan={1} className="pb-6 text-base text-neutral-500">
                  Our comprehensive verification system checks details such as
                  name, address, government ID and more to confirm the identity
                  of guests who book on Airbnb.
                </td>
                <td colSpan={2}></td>
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-semibold">
                  Reservation screening{' '}
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="">
                <td colSpan={1} className="pb-6 text-base text-neutral-500">
                  Our proprietary technology analyzes hundreds of factors in
                  each reservation and blocks certain bookings that show a high
                  risk for disruptive parties and property damage.
                </td>
                <td colSpan={2}></td>
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-semibold">
                  $3M damage protection{' '}
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="">
                <td colSpan={1} className="pb-6 text-base text-neutral-500">
                  Airbnb reimburses you for damage caused by guests to your home
                  and belongings and includes these specialized protections:
                </td>
                <td colSpan={2}></td>
              </tr>

              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-normal">
                  Art & valuables{' '}
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-normal">
                  Auto & boat{' '}
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-normal">
                  Pet damage{' '}
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-normal">
                  Income loss
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-normal">
                  Deep cleaning
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>

              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-semibold">
                  $1M liability insurance
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="check" />
              </tr>
              <tr className="">
                <td colSpan={1} className="pb-6 text-base text-neutral-500">
                  You{'’'}re protected in the rare event that a guest gets hurt
                  or their belongings are damaged or stolen.
                </td>
                <td colSpan={2}></td>
              </tr>
              <tr className="border-t-2 border-neutral-200 h-20">
                <th className="text-left tracking-tight text-xl font-semibold">
                  24-hour safety line
                </th>
                <CheckSVG svgType="check" />
                <CheckSVG svgType="cross" />
              </tr>
              <tr className=" border-b-2 border-neutral-200">
                <td colSpan={1} className="pb-6 text-base text-neutral-500">
                  If you ever feel unsafe, our app provides one-tap access to
                  specially-trained safety agents, day or night.
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 mb-10">
            <p className="text-neutral-500 mt-2">
              Comparison is based on public information and free offerings by
              top competitors as of 10/22. Find details and exclusions{' '}
              <Link
                to={''}
                className="underline font-medium text-neutral-800 cursor-pointer"
              >
                here
              </Link>
              .
            </p>
          </div>
          <div className="flex justify-center">
            <button className=" bg-inherit border border-neutral-800 rounded-lg py-2 px-3 font-medium">
              Learn more
            </button>
          </div>
        </div>
        <div className="px-20 mb-20 flex flex-row">
          <div className="flex flex-col w-full px-12 gap-10">
            <p className="text-4xl text-center font-semibold">
              Introducing Airbnb-friendly apartments
            </p>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <img
                  src={'../src/assets/park_12_apartments.webp'}
                  alt="Park_12_Apartments.jpg"
                  className="h-72 w-72 rounded-xl"
                />
                <p className="text-xs text-center pt-3 font-medium">
                  Park 12 Apartments
                </p>
                <p className="text-xs text-center">San Diego, California</p>
              </div>
              <div className="flex flex-col">
                <img
                  src={'../src/assets/old_town_apartments.webp'}
                  alt="Park_12_Apartments.jpg"
                  className="h-72 w-72 rounded-xl"
                />
                <p className="text-xs text-center pt-3 font-medium">
                  Old Town Apartments
                </p>
                <p className="text-xs text-center">Scottsdale, Arizona</p>
              </div>
              <div className="flex flex-col">
                <img
                  src={'../src/assets/525_olive_apartments.webp'}
                  alt="Park_12_Apartments.jpg"
                  className="h-72 w-72 rounded-xl"
                />
                <p className="text-xs text-center pt-3 font-medium">
                  525 Olive Apartments{' '}
                </p>
                <p className="text-xs text-center">San Diego, California</p>
              </div>
            </div>
            <p className="text-xl leading-8 text-center">
              We{'’'}ve partnered with apartment buildings across the US that
              let you rent a place to live and Airbnb it part-time. Explore
              available apartments and find out what you can earn.
            </p>
            <div className="flex justify-center">
              <button className=" bg-inherit border border-neutral-800 rounded-lg py-2 px-3 font-medium">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostHomes;

function CheckSVG({ svgType }: { svgType: string }) {
  return (
    <>
      {svgType === 'check' && (
        <td className="align-middle">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style={{
                display: 'block',
                fill: 'none',
                height: '24px',
                width: '24px',
                stroke: '#00A506',
                strokeWidth: '5.333333333333333',
                overflow: 'visible'
              }}
              aria-label="Airbnb included"
              role="img"
              focusable="false"
            >
              <path fill="none" d="m4 16.5 8 8 16-16"></path>
            </svg>
          </div>
        </td>
      )}
      {svgType === 'cross' && (
        <td className="align-middle">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style={{
                display: 'block',
                fill: 'none',
                height: '24px',
                width: '24px',
                stroke: '#E12C32',
                strokeWidth: '5.333333333333333',
                overflow: 'visible'
              }}
              aria-label="Competitors not included"
              role="img"
              focusable="false"
            >
              <path d="m6 6 20 20M26 6 6 26"></path>
            </svg>
          </div>
        </td>
      )}
    </>
  );
}
