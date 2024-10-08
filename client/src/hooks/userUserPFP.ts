import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios.instance';

const useUserPFP = (id: string): [string | null] => {
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  useEffect(() => {
    axiosInstance
      .get(`/auth/user/${id}`)
      .then((user) => {
        setUserProfileImage(user.data.profile_image_url);
      })
      .catch(() => setUserProfileImage(''));
  }, [id]);
  return [userProfileImage];
};

export default useUserPFP;
