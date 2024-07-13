import { useState } from 'react';
import axiosInstance from '../api/axios.instance';
import { useAuth } from '../context/AuthProvider';
import { Booking, TabKey } from '@interfaces/booking.interfaces';
import { UserDetails } from '../interfaces/auth.interfaces';

function BookingCard({
  reservation,
  focused
}: {
  reservation: Booking;
  focused: TabKey;
}) {
  const [guest, setGuest] = useState<UserDetails | null>(null);

  axiosInstance.get(`auth/user/${reservation.guest_id}`).then((res) => {
    setGuest(res.data);
  });

  const { userContext } = useAuth();
  let cardTittle;
  switch (focused) {
    case 'checking_out':
      cardTittle = 'Checking out';
      break;
    case 'current':
      cardTittle = 'Currently hosting';
      break;
    case 'pending':
      cardTittle = 'Pending approval';
      break;
    case 'upcoming':
      cardTittle = 'Upcoming';
      break;
    case 'upcoming_soon':
      cardTittle = 'Upcoming soon';
      break;
    default:
      cardTittle = '';
  }
  return (
    <div className="rounded-xl border border-gray-200">
      <div className="p-3">
        <div>{cardTittle}</div>
        <div>{userContext?.username}</div>
        <div>
          <div>
            <div className="block text-base">{guest?.username}</div>
            <div className="block text-base">
              {reservation.check_in_date_UTC.toLocaleDateString()} -{' '}
              {reservation.check_out_date_UTC.toLocaleDateString()}
            </div>
          </div>
          <img
            src={guest?.profile_image_url}
            className="h-full w-full rounded-full"
          ></img>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full"></div>

      <div className="py-4 mx-auto"></div>
    </div>
  );
}

export default BookingCard;
