import { MutableRefObject, useEffect, useRef, useState } from 'react';
import Login from './modals/Login';
import HelpCenter from './modals/HelpCenter';
import YourHome from './modals/YourHome';
import SignUp from './modals/SignUp';

function UnauthDropdown({
  dropdown
}: {
  dropdown: MutableRefObject<HTMLDivElement | null>;
}) {
  // Add class for animation when option clicked.
  // Add out animation class when close event.
  // Remove out class when option clicked again

  // modal-in already as class
  // Click option => render
  // animation happens
  // click close => add modal-out
  // animation close
  // remove modal-out
  // set render to empty string
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [renderedModal, setRenderedModal] = useState(String);
  const [modalShow, setModalShow] = useState(false);

  const toggleModal = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>
  ) => {
    const modalId = e.currentTarget.id;

    if (modalShow) {
      modalRef.current?.classList.add('modal-out');
      modalRef.current?.addEventListener('animationend', () => {
        setRenderedModal('');
        setModalShow(false);
        modalRef.current?.classList.remove('modal-out');
      });
    } else {
      // If it's closed, open it
      setRenderedModal(modalId);
      setModalShow(true);
    }

    // setRenderedModal(modalId);
    // setModalShow((current) => !current);
  };

  useEffect(() => {
    const modalClass = modalShow ? 'modal-in' : 'modal-out';
    modalRef.current?.classList.add(modalClass);
  }, [modalShow]);
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
