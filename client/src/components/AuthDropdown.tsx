import { MutableRefObject, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider.tsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.instance.ts';

function AuthDropdown({
  dropdown
}: {
  dropdown: MutableRefObject<HTMLDivElement | null>;
}) {
  const { userContext } = useAuth();
  const [listings, setListings] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(`auth/user/${userContext?.id}`)
      .then((res) => setListings(res.data.listings));
  }, [userContext]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* <!-- Dropdown menu --> */}
      <div
        id="dropdownDivider"
        ref={dropdown}
        aria-labelledby="dropdownDividerButton"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDividerButton"
        >
          <li>
            <a
              href="#"
              onClick={() => navigate('/messages')}
              className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Messages
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => navigate('/notifications')}
              className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Notifications
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => navigate('/trips')}
              className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Trips
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => navigate('/wishlist')}
              className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Wishlists
            </a>
          </li>
        </ul>
        <div className="py-2">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {listings ? (
              <li>
                <a
                  href="#"
                  onClick={() => navigate('/hostings')}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Manage listings
                </a>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  onClick={() => navigate('/airbnb-your-home')}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Airbnb your home
                </a>
              </li>
            )}

            <li>
              <a
                href="#"
                onClick={() => navigate('/refer')}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Refer a Host
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/account')}
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
                onClick={() => navigate('/gift-card')}
                href="#"
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Gift cards
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/help-center')}
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
    </>
  );
}

export default AuthDropdown;
