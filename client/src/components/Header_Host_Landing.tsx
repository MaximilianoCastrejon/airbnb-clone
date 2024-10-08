import { Link } from 'react-router-dom';

function Header_Host_Landing() {
  // TODO: check if user has listings on drafts or finshed
  // if not, then create draft and redirect to draft,
  return (
    <div>
      <nav className="p-4 px-20 flex flex-row justify-between relative">
        <Link
          className="flex flex-row items-center gap-1 cursor-pointer"
          to={''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            viewBox="0 0 448 512"
          >
            <path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
          </svg>
        </Link>
        <div>
          <div className="flex flex-row flex-grow">
            <div className="flex flex-row justify-end items-center">
              <p className="font-medium mr-6">Ready to Airbnb it?</p>
              <Link
                to={'/hosting'}
                className="bg-primary flex flex-row py-3 px-6 rounded-lg"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.0639 7.63177V11.1393H7.51713V13.028H11.0639V16.5356H13.0048V13.028H16.5516V11.1393H13.0048V7.63177H11.0639Z"
                    fill="white"
                  ></path>
                  <path
                    d="M13.734 0.684168C13.2611 0.240904 12.6404 0 12 0C11.3596 0 10.7389 0.240904 10.266 0.674532L0 10.7251L1.36946 12.0549L2.10837 11.3321V19.9661C2.10837 20.4094 2.29557 20.8334 2.61084 21.1418C2.92611 21.4501 3.35961 21.6332 3.81281 21.6332H20.1773C20.6305 21.6332 21.064 21.4598 21.3892 21.1418C21.7143 20.8238 21.8916 20.3998 21.8916 19.9565V11.3032L22.6305 12.0259L24 10.7251L13.734 0.684168ZM4.03941 19.7542V9.4049L11.6355 1.97542C11.6847 1.92723 11.734 1.88869 11.803 1.86942C11.8621 1.84051 11.931 1.83087 12 1.83087H12.0099C12.0788 1.83087 12.1478 1.84051 12.2069 1.86942C12.266 1.89833 12.3251 1.92723 12.3744 1.97542L19.9704 9.4049V19.7542H4.03941Z"
                    fill="white"
                  ></path>
                </svg>
                <p className="ml-2 font-semibold text-white">Airbnb Setup</p>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header_Host_Landing;
