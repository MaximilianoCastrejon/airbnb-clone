import { useRef, useState } from 'react';
import axiosInstance from '../../api/axios.instance.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.tsx';
import { SignupCredentials } from '../../interfaces/auth.interfaces.ts';
import { useModal } from '../../context/ModalProvider.tsx';
import useClickOutside from '../../hooks/useClickOutside.ts';
import { AxiosResponse } from 'axios';

function SignUp() {
  const [user, setUser] = useState<SignupCredentials>({
    email: '',
    username: '',
    password: '',
    profile_image: ''
  });
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { signup, signupError, setSignupError } = useAuth();
  const { setModal } = useModal();
  useClickOutside(modalRef, () => setModal(null));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const loadedFile = e.target.files;
    if (loadedFile !== null && loadedFile.length > 0) {
      setUser({
        ...user,
        profile_image: loadedFile[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(null);
    try {
      const url = `auth/users?query={"email":"${user.email}"}`;
      const response: AxiosResponse = await axiosInstance.get(url);
      if (response.data.length > 0) throw new Error();
      signup({ ...user })
        .then(() => {
          navigate('/');
        })
        .catch((error) => setSignupError(error));
    } catch (error) {
      setSignupError(error, {
        context:
          'It looks like there is an issue with your registration. Please double-check your details.'
      });
    }
  };

  return (
    <div className="w-[32rem] bg-white rounded-md" ref={modalRef}>
      <div className="border-b border-gray-200 flex flex-row justify-between items-center px-6 py-4">
        <button
          type="button"
          className="w-3 h-3 text-gray-400 bg-transparent hover:text-primary rounded-lg text-sm inline-flex justify-center items-center  dark:hover:text-primary"
          data-modal-hide="edit-modal"
          onClick={() => {
            setModal(null);
            setSignupError(null);
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
          Log in or <span className="font-bold underline">sign up</span>
        </div>
        <div className="w-3 h-3"></div>
      </div>
      {/* <div className="border-t border-gray-200 w-full"></div> */}
      <form className="p-6" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="mt-2 mb-6 text-2xl font-semibold pl-4 leading-tight">
          Welcome to Airbnb
        </h1>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleFormChange}
          className="rounded-t-md rounded-b-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
          placeholder="John Smith"
          required
        />
        <input
          type="text"
          name="email"
          id="email"
          onChange={handleFormChange}
          className="rounded-b-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
          placeholder="JhonDoe@gmail.com"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleFormChange}
          className="rounded-b-md rounded-t-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
          placeholder="*********"
          required
        />
        <input
          type="file"
          name="profile_image"
          id="image"
          onChange={handleFileChange}
          placeholder="Upload"
          required
        />
        {/* TODO: Change appearance with error component */}
        {signupError?.error && (
          <div className="text-red-700 leading-5 font-medium underline w-full rounded-full p-2 bg-red-200">
            <span>{signupError.context}</span>
          </div>
        )}
        <button
          type="submit"
          className="bg-primary w-full p-2 rounded-md mt-2 text-white"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default SignUp;
