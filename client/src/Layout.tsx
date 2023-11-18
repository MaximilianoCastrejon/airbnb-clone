import Searchbar from './components/Searchbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Searchbar />
      <div className="border-t border-gray-200 w-full"></div>
      <Outlet />
    </>
  );
}

export default Layout;
