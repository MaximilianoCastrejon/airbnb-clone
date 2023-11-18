import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.instance';
import { useAuth } from '../context/AuthProvider.tsx';
import AuthDropdown from './AuthDropdown.tsx';
import UnauthDropdown from './UnauthDropdown.tsx';

function UserHeader() {
  const navigate = useNavigate();
  const [userProfileImage, setUserProfileImage] = useState<string>();
  const dropdown = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    dropdown.current?.classList.toggle('hidden');
  };
  const { userContext, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      axiosInstance.get(`/auth/user/${userContext?.id}`).then((user) => {
        console.log(user);
        setUserProfileImage(user.data.profile_image_url);
      });
    }
  }, [userContext, isAuthenticated]);
  return (
    <>
      <nav className="p-4 flex flex-row justify-between relative">
        <a
          className="flex flex-row items-center gap-1 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            viewBox="0 0 448 512"
          >
            <path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
          </svg>
          <div className="max-lg:hidden">Earthbnb</div>
        </a>
        <div>
          <div className="flex flex-row">
            <div className="flex flex-grow items-center">
              <div
                onClick={() => navigate('/host/homes')}
                className="cursor-pointer flex justify-center align-middle items-center font-medium"
              >
                <p>Airbnb your home</p>
              </div>
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
                onClick={toggleDropdown}
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
                  <AuthDropdown dropdown={dropdown} />
                ) : (
                  <UnauthDropdown dropdown={dropdown} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="border-t border-gray-200 w-full"></div>
      <Outlet />
      <div className="bg-neutral-100 border-y border-gray-200 px-10">
        <div className="grid grid-cols-3 gap-2 border-b-2 border-gray-200 w-full  py-12">
          <ul className="flex flex-col ">
            <li className="mb-2 w-full block">
              <a className="font-semibold">Support</a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Help Center
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Get help with a safety issue
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                AirCover
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Anti-discrimination
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Disability support
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Cancellation options
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Report neighborhood concern
              </a>
            </li>
          </ul>
          <ul className="flex flex-col">
            <li className="mb-2 w-full block">
              <a className="font-semibold">Hosting</a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Airbnb your home
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                AirCover for Hosts
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Hosting resources
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Community forum
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Hosting responsibly
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Airbnb-friendly apartments
              </a>
            </li>
          </ul>
          <ul className="flex flex-col">
            <li className="mb-2 w-full block">
              <a className="font-semibold">Airbnb</a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Newsroom
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                New features
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Careers
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Investors
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Gift cards
              </a>
            </li>
            <li className="mb-2 w-full block">
              <a className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
                Airbnb.org emergency stays
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-row justify-between py-6">
          <div className="text-sm text-neutral-800">
            © 2023 Airbnb, Inc. ·{' '}
            <span className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
              Terms{' '}
            </span>
            ·{' '}
            <span className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
              Sitemap{' '}
            </span>
            ·{' '}
            <span className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
              Privacy{' '}
            </span>
            ·{' '}
            <span className="hover:underline decoration-1 cursor-pointer text-sm text-neutral-800">
              Your Privacy Choices{' '}
            </span>
          </div>
          <div className="flex flex-row items-center">
            <div className="mr-6 ">
              <div className="flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  style={{
                    display: 'block',
                    height: '16px',
                    width: '16px',
                    fill: 'currentColor'
                  }}
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="mr-2"
                >
                  <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z"></path>
                </svg>
                <span>English {'(US)'}</span>
              </div>
            </div>
            <div>
              <span>$ MXN</span>
            </div>
            <div className="ml-6">
              <ul className="flex flex-row ">
                <li className="mr-4">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      style={{
                        display: 'block',
                        height: '16px',
                        width: '16px',
                        fill: 'currentColor'
                      }}
                      aria-label="Navigate to Facebook"
                      role="img"
                      focusable="false"
                    >
                      <path d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path>
                      <path
                        fill="#fff"
                        d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.62h4.06V32h5V20.62h3.73z"
                      ></path>
                    </svg>
                  </a>
                </li>
                <li className="mr-4">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      style={{
                        display: 'block',
                        height: '16px',
                        width: '16px',
                        fill: 'currentColor'
                      }}
                      aria-label="Navigate to Twitter"
                      role="img"
                      focusable="false"
                    >
                      <path d="M32 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4z"></path>
                      <path
                        fill="#fff"
                        d="M18.66 7.99a4.5 4.5 0 0 0-2.28 4.88A12.31 12.31 0 0 1 7.3 8.25a4.25 4.25 0 0 0 1.38 5.88c-.69 0-1.38-.13-2-.44a4.54 4.54 0 0 0 3.5 4.31 4.3 4.3 0 0 1-2 .06 4.64 4.64 0 0 0 4.19 3.13A8.33 8.33 0 0 1 5.8 23a12.44 12.44 0 0 0 19.32-11.19A7.72 7.72 0 0 0 27.3 9.5a8.3 8.3 0 0 1-2.5.75 4.7 4.7 0 0 0 2-2.5c-.87.5-1.81.87-2.81 1.06a4.5 4.5 0 0 0-5.34-.83z"
                      ></path>
                    </svg>
                  </a>
                </li>
                <li className="mr-4">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      style={{
                        display: 'block',
                        height: '16px',
                        width: '16px',
                        fill: 'currentColor'
                      }}
                      aria-label="Navigate to Instagram"
                      role="img"
                      focusable="false"
                    >
                      <path d="M30 0H2a2 2 0 0 0-2 2v28c0 1.1.9 2 2 2h28a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                      <path
                        fill="#fff"
                        d="M15.71 4h1.25c2.4 0 2.85.02 3.99.07 1.28.06 2.15.26 2.91.56.79.3 1.46.72 2.13 1.38.6.6 1.08 1.33 1.38 2.13l.02.06c.28.74.48 1.58.54 2.8l.01.4c.05 1.02.06 1.63.06 4.4v.92c0 2.6-.02 3.05-.07 4.23a8.78 8.78 0 0 1-.56 2.91c-.3.8-.77 1.53-1.38 2.13a5.88 5.88 0 0 1-2.13 1.38l-.06.02c-.74.28-1.59.48-2.8.53l-.4.02c-1.02.05-1.63.06-4.4.06h-.92a73.1 73.1 0 0 1-4.23-.07 8.78 8.78 0 0 1-2.91-.56c-.8-.3-1.53-.77-2.13-1.38a5.88 5.88 0 0 1-1.38-2.13l-.02-.06a8.84 8.84 0 0 1-.54-2.8l-.01-.37A84.75 84.75 0 0 1 4 16.29v-1c0-2.62.02-3.06.07-4.24.06-1.26.26-2.13.55-2.88l.01-.03c.3-.8.77-1.53 1.38-2.13a5.88 5.88 0 0 1 2.13-1.38l.06-.02a8.84 8.84 0 0 1 2.8-.54l.37-.01C12.39 4 12.99 4 15.71 4zm.91 2.16h-1.24c-2.3 0-2.91.01-3.81.05l-.42.02c-1.17.05-1.8.25-2.23.41-.56.22-.96.48-1.38.9-.4.41-.67.8-.88 1.35l-.03.06a6.7 6.7 0 0 0-.4 2.2l-.02.45c-.04.9-.05 1.53-.05 3.94v1.08c0 2.64.02 3.05.07 4.23v.07c.06 1.13.25 1.74.42 2.16.21.56.47.96.9 1.38.4.4.8.67 1.34.88l.06.03a6.7 6.7 0 0 0 2.2.4l.45.02c.9.04 1.53.05 3.94.05h1.08c2.64 0 3.05-.02 4.23-.07h.07a6.51 6.51 0 0 0 2.16-.42c.52-.19.99-.5 1.38-.9.4-.4.67-.8.88-1.34l.03-.06a6.7 6.7 0 0 0 .4-2.2l.02-.45c.04-.9.05-1.53.05-3.94v-1.09c0-2.63-.02-3.04-.07-4.22v-.07a6.51 6.51 0 0 0-.42-2.16c-.19-.52-.5-.99-.9-1.38a3.7 3.7 0 0 0-1.34-.88l-.06-.03a6.63 6.63 0 0 0-2.16-.4l-.46-.02c-.9-.04-1.5-.05-3.8-.05zM16 9.84a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32zM16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.4-3.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z"
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHeader;
