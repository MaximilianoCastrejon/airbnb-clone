// import { useAuth } from '../context/AuthProvider.ts';
import { useAuth } from '../context/AuthProvider.tsx';
// import axiosInstance from '../api/axios.instance.ts';
import axiosInstance from '../api/axios.instance.ts';
import { useState } from 'react';

function BecomeAHost() {
  const { userContext } = useAuth();
  const [userProperties, setUserProperties] = useState();
  axiosInstance.get(`properties/?id=${userContext?.id}`).then((res) => {
    setUserProperties(res.data.properties);
  });
  return <>{userProperties ? <BecomeAHost /> : <BecomeAHost />}</>; // If user has properties, don't load become hosts, load properties instead
}

export default BecomeAHost;
