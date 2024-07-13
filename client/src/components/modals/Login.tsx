import { MutableRefObject, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.tsx';
import { LoginCredentials } from '../../interfaces/auth.interfaces.ts';

function Login({
  modalRef,
  toggleModal
}: {
  modalRef: MutableRefObject<HTMLDivElement | null>;
  toggleModal: (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement>
  ) => void;
}) {
  const [user, setUser] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showInvalidCredentials, setShowInvalidCredentials] =
    useState<boolean>();

  const navigate = useNavigate();
  const { login, errors, clearErrors } = useAuth();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Find a way to set up TS get a response from the backend and verify the statusCode
    login(user).then(() => {
      if (errors.length === 0) {
        navigate('/');
      }
      // else {
      //   alert('Login unsuccessful');
      // }
    });
  };
  // TODO: change method of handling errors
  useEffect(() => {
    if (errors.length === 0) {
      setShowInvalidCredentials(false);
    } else {
      setShowInvalidCredentials(true);
    }
  }, [errors]);
  return (
    <div
      id="modal-container"
      ref={modalRef}
      onClick={(e) => {
        toggleModal(e);
        clearErrors();
      }}
      className="modal-in fixed top-0 left-0 w-screen h-screen flex justify-center items-center "
    >
      <div className="modal-background w-full h-full flex justify-center items-center">
        <div
          className="modal w-full bg-white rounded-md max-w-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <button
              type="button"
              className="absolute top-3 left-3 text-gray-400 bg-transparent hover:text-primary rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center  dark:hover:text-primary"
              data-modal-hide="edit-modal"
              onClick={(e) => {
                toggleModal(e);
                clearErrors();
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="leading-5 m-auto px-6 border-b border-gray-200 font-medium text-center p-4">
              <span className="font-bold underline">Log in</span> or sign up
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <h1 className="mt-2 mb-6 text-2xl font-semibold pl-4 leading-tight">
                Welcome to Airbnb
              </h1>
              {showInvalidCredentials && (
                <div className="w-full flex justify-center items-center rounded-lg px-4 py-2 border mb-6 border-gray-300">
                  <div className="rounded-full h-12 w-12 bg-red-600 p-4">
                    <span className="flex justify-center items-center w-full h-full text-3xl text-white font-poppins">
                      !
                    </span>
                  </div>
                  <div className="w-full m-2">
                    <p className="font-semibold w-full">
                      Vamos a intentarlo de nuevo
                    </p>
                    <p className="text-gray-500 w-full text-sm">
                      Datos de inicio de sesión incorrectos. Intentarlo de
                      nuevo.
                    </p>
                  </div>
                </div>
              )}
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => handleFormChange(e)}
                className="rounded-t-md rounded-b-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
                placeholder="name@company.com"
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => handleFormChange(e)}
                className="rounded-b-md rounded-t-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
                placeholder="*********"
                required
              />
              <button
                type="submit"
                className="bg-primary w-full p-2 rounded-md mt-2 text-white"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
