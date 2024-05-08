import { useRef, useState } from 'react';
import Login from './modals/Login';
import HelpCenter from './modals/HelpCenter';
import YourHome from './modals/YourHome';
import SignUp from './modals/SignUp';

interface UnauthDropdownProps {
  toggleDropdown: () => void; // Ensure correct typing for toggleDropdown prop
  drowpdownRender: boolean;
}

function UnauthDropdown({
  toggleDropdown,
  drowpdownRender
}: UnauthDropdownProps) {
  /* ** CHECK ** */
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [renderedModal, setRenderedModal] = useState(String);
  const dropdown = useRef<HTMLDivElement | null>(null);

  const [isModalActive, setIsModalActive] = useState(false);

  const toggleModal = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>
  ) => {
    // Modal is selected to render to start animation
    // After being toggled, closing animation class is added, thus it starts the animation
    // Modal is no longer rendered, and closing animation is removed to add it back, in case modal gets opened and closed again
    const modalId = e.currentTarget.id;
    if (isModalActive) {
      // if -> Remove
      modalRef.current?.classList.add('modal-out');
      modalRef.current?.addEventListener('animationend', () => {
        setRenderedModal('');
        setIsModalActive(false);
        modalRef.current?.classList.remove('modal-out');
      });
    } else {
      // if not -> Render
      setRenderedModal(modalId);
      setIsModalActive(true);
      toggleDropdown();
    }
  };

  /* ** CHECK ** */
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
                onClick={(e) => toggleModal(e)}
                id="signup"
                className="block cursor-pointer font-semibold px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sing up
              </a>
            </li>
            <li>
              <a
                onClick={(e) => toggleModal(e)}
                id="login"
                className="block  cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Login
              </a>
            </li>
          </ul>
          <div className="py-2">
            <ul>
              <li>
                <a
                  onClick={(e) => toggleModal(e)}
                  id="home"
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Airbnb your home
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => toggleModal(e)}
                  id="help"
                  className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
      {renderedModal === 'login' && (
        <Login modalRef={modalRef} toggleModal={toggleModal} />
      )}
      {renderedModal === 'help' && (
        <HelpCenter modalRef={modalRef} toggleModal={toggleModal} />
      )}
      {renderedModal === 'home' && (
        <YourHome modalRef={modalRef} toggleModal={toggleModal} />
      )}
      {renderedModal === 'signup' && (
        <SignUp modalRef={modalRef} toggleModal={toggleModal} />
      )}
    </>
  );
}

export default UnauthDropdown;
