import { MutableRefObject } from 'react';

function YourHome({
  modalRef,
  toggleModal
}: {
  modalRef: MutableRefObject<HTMLDivElement | null>;
  toggleModal: (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => void;
}) {
  return (
    <div
      id="modal-container"
      ref={modalRef}
      onClick={(e) => toggleModal(e)}
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
              onClick={(e) => toggleModal(e)}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="leading-5 m-auto px-6 border-b border-gray-200 font-medium text-center p-4">
              Log in or sign up
            </div>
            {/* <div className="border-t border-gray-200 w-full"></div> */}
            <form className="p-6">
              <h1 className="mt-2 mb-6 text-2xl font-semibold pl-4 leading-tight">
                Welcome to Airbnb
              </h1>
              <input
                type="text"
                name="email"
                id="email"
                // value={image.name}
                // onChange={}
                className="rounded-t-md rounded-b-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
                placeholder="name@company.com"
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                // value={image.name}
                // onChange={}
                className="rounded-b-md rounded-t-none bg-gray-50 border border-gray-300 text-gray-500 block w-full p-2.5 "
                placeholder="*********"
                required
              />
              <button className="bg-primary w-full p-2 rounded-md mt-2 text-white">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YourHome;
