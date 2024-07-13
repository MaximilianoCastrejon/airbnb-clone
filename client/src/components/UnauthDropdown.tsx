import { useRef, useState } from 'react';
import Login from './modals/Login';
import HelpCenter from './modals/HelpCenter';
import YourHome from './modals/YourHome';
import SignUp from './modals/SignUp';

interface UnauthDropdownProps {
  authMenuRef: React.RefObject<HTMLDivElement>; // Ensure correct typing for authMenuRef prop
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function UnauthDropdown({
  authMenuRef,
  isMenuCollapsed,
  setIsMenuCollapsed
}: UnauthDropdownProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [renderedModal, setRenderedModal] = useState(String);

  const [isModalActive, setIsModalActive] = useState(false);

  // TODO: write a better toggle
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
      setIsMenuCollapsed((prev) => !prev);
    }
  };

  /* ** CHECK ** */
  return (
    <>
      {/* <!-- Dropdown menu --> */}
      {isMenuCollapsed && (
        <div
          id="dropdownDivider"
          ref={authMenuRef}
          aria-labelledby="dropdownDividerButton"
          className="z-10 bg-white menu-shadow rounded-lg py-2 text-sm shadow w-44 "
        >
          <div className="py-2">
            <button
              onClick={(e) => toggleModal(e)}
              id="signup"
              className="block w-full text-left font-semibold px-4 py-2 hover:bg-zinc-100 "
            >
              Sing up
            </button>
            <button
              onClick={(e) => toggleModal(e)}
              id="login"
              className="block w-full text-left px-4 py-2 hover:bg-zinc-100 "
            >
              Login
            </button>
          </div>
          <div className="border-b border-gray-200 my-1 w-full"></div>

          <div className="py-2">
            <button
              onClick={(e) => toggleModal(e)}
              id="home"
              className="block w-full text-left px-4 py-2 hover:bg-zinc-100 "
            >
              Airbnb your home
            </button>

            <button
              onClick={(e) => toggleModal(e)}
              id="help"
              className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-100"
            >
              Help Center
            </button>
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
