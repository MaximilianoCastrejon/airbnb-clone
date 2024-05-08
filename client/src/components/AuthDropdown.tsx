import { useRef } from 'react';
import { useAuth } from '../context/AuthProvider.tsx';
import { useNavigate } from 'react-router-dom';

interface AuthDropdownProps {
  toggleDropdown: () => void; // Ensure correct typing for toggleDropdown prop
  drowpdownRender: boolean;
}

function AuthDropdown({ toggleDropdown, drowpdownRender }: AuthDropdownProps) {
  const dropdown = useRef<HTMLDivElement | null>(null);

  const { logout, userContext } = useAuth();
  console.log(userContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdown.current &&
  //       !dropdown.current.contains(event.target as Node)
  //     ) {
  //       // Clicked outside the modal, so close it
  //       toggleDropdown();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   // Remove event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  return (
    <>
      {/* <!-- Dropdown menu --> */}
      {drowpdownRender && (
        <div
          id="dropdownDivider"
          ref={dropdown}
          aria-labelledby="dropdownDividerButton"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <a
                href="#"
                onClick={() => {
                  navigate('/messages');
                  toggleDropdown();
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Messages
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => {
                  navigate('/notifications');
                  toggleDropdown();
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Notifications
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => {
                  navigate('/trips');
                  toggleDropdown();
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Trips
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => {
                  navigate('/wishlist');
                  toggleDropdown();
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Wishlists
              </a>
            </li>
          </ul>
          <div className="py-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {userContext && userContext.properties.length > 0 ? (
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      navigate('/hostings');
                      toggleDropdown();
                    }}
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Manage listings
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      navigate('/airbnb-your-home');
                      toggleDropdown();
                    }}
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Airbnb your home
                  </a>
                </li>
              )}

              <li>
                <a
                  href="#"
                  onClick={() => {
                    navigate('/refer');
                    toggleDropdown();
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Refer a Host
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/account');
                    toggleDropdown();
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Account
                </a>
              </li>
            </ul>
          </div>
          <div className="py-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a
                  onClick={() => {
                    navigate('/gift-card');
                    toggleDropdown();
                  }}
                  href="#"
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Gift cards
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/help-center');
                    toggleDropdown();
                  }}
                  href="#"
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  onClick={logout}
                  href="#"
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthDropdown;
