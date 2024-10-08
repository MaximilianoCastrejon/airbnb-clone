import Header_Hosting from '../../components/host-dashboard/Header_Hosting';
import { Outlet } from 'react-router-dom';

function Hosting() {
  return (
    <>
      <Header_Hosting />
      <Outlet />
    </>
  );
}

export default Hosting;
