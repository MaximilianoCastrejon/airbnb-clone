import { useAuth } from '../context/AuthProvider.tsx';
import { Link } from 'react-router-dom';

interface AuthDropdownProps {
  setIsMenuCollapsed: React.Dispatch<React.SetStateAction<boolean>>; // Ensure correct typing for toggleDropdown prop
  isMenuCollapsed: boolean;
  authMenuRef: React.RefObject<HTMLDivElement>;
}

function AuthDropdown({
  setIsMenuCollapsed,
  isMenuCollapsed,
  authMenuRef
}: AuthDropdownProps) {
  const { logout, userContext } = useAuth();

  return (
    <>
      {/* <!-- Dropdown menu --> */}
      {isMenuCollapsed ? null : (
        <div
          id="dropdownDivider"
          ref={authMenuRef}
          aria-labelledby="dropdownDividerButton"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                to={'/messages'}
                onClick={() => {
                  setIsMenuCollapsed(true);
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Messages
              </Link>
            </li>
            <li>
              <Link
                to={'/notifications'}
                onClick={() => {
                  setIsMenuCollapsed(true);
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Notifications
              </Link>
            </li>
            <li>
              <Link
                to={'/trips'}
                onClick={() => {
                  setIsMenuCollapsed(true);
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Trips
              </Link>
            </li>
            <li>
              <Link
                to={'/wishlist'}
                onClick={() => {
                  setIsMenuCollapsed(true);
                }}
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Wishlists
              </Link>
            </li>
          </ul>
          <div className="py-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {userContext &&
              userContext.listings &&
              userContext.listings.length > 0 ? (
                <li>
                  <Link
                    to={'/hosting'}
                    onClick={() => {
                      setIsMenuCollapsed(true);
                    }}
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Manage listings
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to={'/host/homes'}
                    onClick={() => {
                      setIsMenuCollapsed(true);
                    }}
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Airbnb your home
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to={'/refer'}
                  onClick={() => {
                    setIsMenuCollapsed(true);
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Refer a Host
                </Link>
              </li>
              <li>
                <Link
                  to={'/account'}
                  onClick={() => {
                    setIsMenuCollapsed(true);
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="py-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <Link
                  to={'/gift-card'}
                  onClick={() => {
                    setIsMenuCollapsed(true);
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Gift cards
                </Link>
              </li>
              <li>
                <Link
                  to={'/help-center'}
                  onClick={() => {
                    setIsMenuCollapsed(true);
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <div
                  onClick={logout}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Log out
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthDropdown;
