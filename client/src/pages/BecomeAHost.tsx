// import { useAuth } from '../context/AuthProvider.ts';
import { useAuth } from '../context/AuthProvider.tsx';
// import axiosInstance from '../api/axios.instance.ts';
import axiosInstance from '../api/axios.instance.ts';
import { useState } from 'react';

function BecomeAHost() {
  const { userContext } = useAuth();
  const [userListings, setUserListings] = useState();
  axiosInstance.get(`listings/?id=${userContext?.id}`).then((res) => {
    setUserListings(res.data.listings);
  });
  return <>{userListings ? <BecomeAHost /> : <BecomeAHost />}</>; // If user has Listings, don't load become hosts, load Listings instead
}

export default BecomeAHost;
