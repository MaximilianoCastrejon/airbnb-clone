import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider.tsx';
import BookingCard from '../../components/BookingCard.tsx';
import Footer from '../../components/Footer.tsx';
import LoadingSkeleton_HostBookings from '../../components/host-dashboard/LoadingSkeleton_HostBookings.tsx';
import {
  Reservations,
  Reservations_Count,
  TabKey
} from '../../interfaces/booking.interfaces.ts';
import fetchData from '../../utils/fetchData.ts';
import { getQueries } from './queries.ts';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../utils/debounce.ts';

const messages = {
  checking_out: 'You don’t have any guests checking out today or tomorrow.',
  current: 'You don’t have any guests staying with you right now.',
  upcoming: 'You currently don’t have any upcoming guests.',
  upcoming_soon: 'You don’t have any guests arriving today or tomorrow.',
  pending: "You don't have any guest reviews to write."
};

function Today() {
  const { userContext } = useAuth();
  const navigate = useNavigate();

  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [reservationsCount, setReservationsCount] =
    useState<Reservations_Count | null>(null);

  const [focused, setFocused] = useState<TabKey>('checking_out');
  if (userContext === null) {
    navigate('/');
    return null;
  }
  const loadData = useDebounce(() => {
    fetchCurrentTabData(userContext.id, focused, currentPage)
      .then((reservations) => setReservations(reservations))
      .catch((err) => console.log('Reservations could not get retrieved', err));
    fetchBookingCounts(userContext.id)
      .then((counts) => setReservationsCount({ ...counts.bookingCounts }))
      .catch((err) => console.log('Reservations could not get retrieved', err));
    setLoadingReservations(false);
  }, 2000);

  useEffect(() => {
    setLoadingReservations(true);
    loadData();
  }, [focused, currentPage, userContext.id]);

  const handleFocusChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    setFocused(target.name as TabKey);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className=" h-[calc(80vh-69px)]">
        <div className="w-full px-20 pt-16">
          <div className="mt-10 text-[2rem] font-semibold leading-9 font-sans">
            Welcome back, {userContext?.username}
          </div>
          {userContext?.listings && (
            <div className="grid max-lg:grid-cols-2 max-xl:grid-cols-3 max-2xl:grid-cols-4 w-full justify-between">
              <div className="border border-neutral-200 rounded-lg">
                <div className="p-4 pr-8">
                  <div className="block text-base font-poppins font-medium">
                    You have to add information to the account
                  </div>
                  <div className="block text-base font-poppins ">
                    Mandatory in order to receive peayments
                  </div>
                  <div className="block text-base font-poppins underline font-medium">
                    Update your account's information
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-row justify-between w-full pt-16 mb-4">
            <div className="font-semibold leading-7 text-[1.625rem] mb-7">
              Your reservations
            </div>
            <div className="flex flex-row">
              <div className="p-[10px] flex-1 font-medium text-base underline">
                All reservations ({reservationsCount?.totalCount})
              </div>
              {reservationsCount && reservationsCount[focused] !== 0 && (
                <div className="justify-center items-center align-middle">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="rounded-full border border-neutral-200 items-center justify-center text-center "
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="rounded-full border border-neutral-200 items-center justify-center text-center "
                  >
                    {'>'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-row justify-start align-middle items-center mt-2 mb-6">
            <button
              name="checking_out"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'checking_out' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={(e) => {
                handleFocusChange(e);
              }}
            >
              Checking out ({reservationsCount?.checking_out})
            </button>
            <button
              name="current"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'current' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={(e) => {
                handleFocusChange(e);
              }}
            >
              Currently hosting ({reservationsCount?.current})
            </button>
            <button
              name="upcoming_soon"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'upcoming_soon' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={(e) => {
                handleFocusChange(e);
              }}
            >
              Arriving soon ({reservationsCount?.upcoming_soon})
            </button>
            <button
              name="upcoming"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'upcoming' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={(e) => {
                handleFocusChange(e);
              }}
            >
              Upcoming ({reservationsCount?.upcoming})
            </button>
            <button
              name="pending"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'pending' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={(e) => {
                handleFocusChange(e);
              }}
            >
              Pending review ({reservationsCount?.pending})
            </button>
          </div>
          <div className="bg-neutral-100 w-full h-[12.5rem]">
            {loadingReservations ? (
              <LoadingSkeleton_HostBookings />
            ) : reservations &&
              reservations.reservations &&
              reservations.reservations.length > 0 ? (
              <div className="grid grid-cols-4 h-full">
                {reservations.reservations.map((reserv) => (
                  <BookingCard reservation={reserv} focused={focused} />
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-8 h-8 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    id="bell-icon"
                    aria-hidden="true"
                    focusable="false"
                    className="block fill-black w-8 h-8 stroke-none overflow-visible"
                  >
                    <path d="M24 1a5 5 0 0 1 5 4.78v5.31h-2V6a3 3 0 0 0-2.82-3H8a3 3 0 0 0-3 2.82V26a3 3 0 0 0 2.82 3h5v2H8a5 5 0 0 1-5-4.78V6a5 5 0 0 1 4.78-5H8zm-2 12a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.02 3.17 1.36 1.46-6.01 5.64-3.35-3.14 1.36-1.46 1.99 1.86z"></path>
                  </svg>
                </div>
                <div className="justify-center text-center wrap-text">
                  <span className="text-sm font-normal font-sans text-center wrap-text">
                    {messages[focused]}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Today;

const fetchBookingCounts = async (host_id: string) => {
  const bookingCounts: { [key in TabKey]: number } & {
    totalCount: number;
  } = {
    checking_out: 0,
    current: 0,
    upcoming: 0,
    upcoming_soon: 0,
    pending: 0,
    totalCount: 0
  };
  try {
    const queries = getQueries<TabKey>(
      ['upcoming_soon', 'upcoming', 'pending', 'checking_out', 'current'],
      host_id,
      true
    );
    for (const query of queries) {
      const response = await fetchData<number>({ ...query });
      bookingCounts[query.id] = response.data;
    }
    bookingCounts.totalCount = Object.values(bookingCounts).reduce(
      (sum, value) => sum + (value || 0),
      0
    );
    return { bookingCounts };
  } catch (error) {
    return { bookingCounts };
  }
};

const fetchCurrentTabData = async (
  host_id: string,
  focusedTab: TabKey,
  currentPage: number
) => {
  try {
    const query = getQueries<TabKey>([focusedTab], host_id, false, currentPage);
    const responseArr = await fetchData<Reservations>({ ...query[0] });
    const result: Reservations = {
      reservations: responseArr.data.reservations
    };
    return result;
  } catch (error) {
    throw error;
  }
};
