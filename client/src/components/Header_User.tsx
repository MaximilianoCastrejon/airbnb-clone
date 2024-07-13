import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axiosInstance from '../api/axios.instance.ts';
import { useAuth } from '../context/AuthProvider.tsx';
import AuthDropdown from './AuthDropdown.tsx';
import UnauthDropdown from './UnauthDropdown.tsx';
import Footer from './Footer.tsx';

function Header_User() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const unauthMenuRef = useRef<HTMLDivElement>(null);
  const [userProfileImage, setUserProfileImage] = useState<string>();

  const { userContext, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance.get(`/auth/user/${userContext?.id}`).then((user) => {
        console.log(user);
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
    <>
      <nav className="p-4 flex flex-row justify-between relative">
        <Link
          className="flex flex-row items-center gap-1 cursor-pointer"
          to={''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            viewBox="0 0 448 512"
          >
            <path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
          </svg>
          <div className="max-lg:hidden">Earthbnb</div>
        </Link>
        <div>
          <div className="flex flex-row">
            <div className="flex flex-grow items-center">
              <Link
                to={'/host/homes'}
                className="cursor-pointer flex justify-center align-middle items-center font-medium"
              >
                <p>Airbnb your home</p>
              </Link>
            </div>
            {/* GLOBE */}
            <div className="flex align-middle justify-center items-center min-w-[46px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                viewBox="0 0 512 512"
              >
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
              </svg>
            </div>
            <div className="relative self-center">
              <button
                id="dropdownDividerButton"
                onClick={() => setIsMenuCollapsed((prev) => !prev)}
                className="flex max-w-fit items-center gap-2 border border-gray-300 rounded-full py-2 px-4"
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
          </div>
        </div>
      </nav>
      <div className="border-t border-gray-200 w-full"></div>
      <Outlet />
      <Footer />
    </>
  );
}

export default Header_User;
