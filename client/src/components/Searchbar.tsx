import { Link } from 'react-router-dom';
import AuthDropdown from './AuthDropdown';
import UnauthDropdown from './UnauthDropdown';
import { useAuth } from '../context/AuthProvider.tsx';
import paths from '../assets/svg_paths.js';

function Searchbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="p-4 px-20 flex justify-between ">
      <Link className="flex flex-row items-center gap-1" to={''}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="2em"
          viewBox="0 0 448 512"
        >
          <path d={`${paths.LOGO_BLACK}`} />
        </svg>
        <div className="max-lg:hidden">Earthbnb</div>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div className="self-center pb-0.5">Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div className="self-center pb-0.5">Any week</div>
        <div className="border-l border-gray-300"></div>
        <div className="self-center pb-0.5">Add guests</div>
        <button className="bg-primary rounded-full p-2">
          <svg
            id="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="1.2em"
            fill="white"
            viewBox="0 0 512 512"
          >
            <path d={`${paths.MAGNIFYING_GLASS_WHITE}`} />
          </svg>
        </button>
      </div>
      {isAuthenticated ? <AuthDropdown /> : <UnauthDropdown />}
    </nav>
  );
}

export default Searchbar;
