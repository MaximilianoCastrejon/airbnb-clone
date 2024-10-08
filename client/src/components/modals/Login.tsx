import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.tsx';
import { LoginCredentials } from '../../interfaces/auth.interfaces.ts';
import { useModal } from '../../context/ModalProvider.tsx';
import useClickOutside from '../../hooks/useClickOutside.ts';
import validateForm from '../../utils/validateForm.ts';
import { RequiredKeys } from '../../interfaces/types.interfaces.ts';

function Login() {
  const [user, setUser] = useState<Partial<LoginCredentials>>({});
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { setModal } = useModal();
  const { login, loginError, setLoginError } = useAuth();
  useClickOutside(modalRef, () => setModal(null));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user)
      setUser((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value
        };
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const requiredFields: RequiredKeys<LoginCredentials>[] = [
        'email',
        'password'
      ];
      const loginForm = await validateForm<LoginCredentials>(
        user,
        requiredFields
      );
      const loggedIn = await login(loginForm);
      if (loggedIn) navigate('/');
    } catch (error) {}
  };

  return (
    <div className="w-[32rem] bg-white rounded-md " ref={modalRef}>
      <div className="border-b border-gray-200 flex flex-row justify-between items-center px-6 py-4">
        <button
          type="button"
          className="w-3 h-3 text-gray-400 bg-transparent hover:text-primary rounded-lg text-sm inline-flex justify-center items-center  dark:hover:text-primary"
          data-modal-hide="edit-modal"
          onClick={() => {
            setModal(null);
            setLoginError(null);
          }}
        >
          <svg
            className="w-full h-full"
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
        <div className="leading-5 font-medium text-center">
          <span className="font-bold underline">Log in</span>
          or sign up
        </div>
        <div className="w-3 h-3"></div>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <h1 className="mt-2 mb-6 text-2xl font-semibold pl-4 leading-tight">
          Welcome to Airbnb
        </h1>
        {loginError?.context && (
          <div className="w-full flex justify-center items-center rounded-lg px-4 py-2 border mb-6 border-gray-300">
            <div className="rounded-full h-12 w-12 bg-red-600 p-4">
              <span className="flex justify-center items-center w-full h-full text-3xl text-white font-poppins">
                !
              </span>
            </div>
            <div className="w-full m-2">
              <p className="font-semibold w-full">Let's try agian</p>
              <p className="text-gray-500 w-full text-sm">
                Incorrect login credentials, let's try again
              </p>
            </div>
          </div>
        )}
        <input
          type="text"
          name="email"
          onChange={(e) => handleFormChange(e)}
          className="rounded-t-md rounded-b-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
          placeholder="JhonDoe@gmail.com"
          required
        />
        <input
          type="password"
          name="password"
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
  );
}

export default Login;
