import { Link } from 'react-router-dom';
import AuthDropdown from './AuthDropdown';
import UnauthDropdown from './UnauthDropdown';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthProvider.tsx';
import axiosInstance from '../api/axios.instance';

function Searchbar() {
  const [userProfileImage, setUserProfileImage] = useState<string>();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const unauthMenuRef = useRef<HTMLDivElement>(null);

  const { userContext, isAuthenticated } = useAuth();

  // TODO: change into a custom hook
  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance.get(`/auth/user/${userContext?.id}`).then((user) => {
        setUserProfileImage(user.data.profile_image_url);
      });
    }
  }, [userContext?.id, isAuthenticated]);

  // TODO: change into a custom hook

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authMenuRef.current &&
        !authMenuRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the modal, so close it
        setIsMenuCollapsed(true);
      }
      if (
        unauthMenuRef.current &&
        !unauthMenuRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the modal, so close it
        setIsMenuCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <nav className="p-4 flex justify-between relative">
      <Link className="flex flex-row items-center gap-1" to={''}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="2em"
          viewBox="0 0 448 512"
        >
          <path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
        </svg>
        <div className="max-lg:hidden">Earthbnb</div>
      </Link>
      {/* TODO: make searchbar functional. Don't forget to apply useTransition for find function to autocomplete search*/}
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div className="self-center pb-0.5">Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div className="self-center pb-0.5">Any week</div>
        <div className="border-l border-gray-300"></div>
        <div className="self-center pb-0.5">Add guests</div>
        <button className="bg-primary rounded-full p-2">
          <svg
            id="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="1.2em"
            fill="white"
            viewBox="0 0 512 512"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
        </button>
      </div>
      <div className="relative self-center">
        <button
          id="dropdownDividerButton"
          onClick={() => setIsMenuCollapsed((prev) => !prev)}
          className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4"
        >
          <svg
            id="hamburger-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
          {isAuthenticated ? (
            <div>
              <img src={userProfileImage} className="h-8 rounded-full" />
            </div>
          ) : (
            <div className="bg-gray-500 text-white rounded-full border-2 border-gray-500 overflow-hidden p-0.5">
              <svg
                id="user-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                fill="white"
                className="relative top-1"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
            </div>
          )}
        </button>
        <div className="absolute mt-1 right-0">
          {isAuthenticated ? (
            <AuthDropdown
              setIsMenuCollapsed={setIsMenuCollapsed}
              isMenuCollapsed={isMenuCollapsed}
              authMenuRef={authMenuRef}
            />
          ) : (
            <UnauthDropdown
              setIsMenuCollapsed={setIsMenuCollapsed}
              isMenuCollapsed={isMenuCollapsed}
              authMenuRef={unauthMenuRef}
            />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Searchbar;
