import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import BookingCard from '../../components/BookingCard.tsx';
import Footer from '../../components/Footer.tsx';
import LoadingSkeleton_HostBookings from '../../components/LoadingSkeleton_HostBookings.tsx';
import {
  NumericFieldsOfBooking,
  Reservations,
  Reservations_Count,
  StringFieldsOfBooking,
  TabKey
} from '../../interfaces/booking.interfaces.ts';
import { fetchData } from '../../utils/axiosQueryURL.ts';
import { NumericField } from '../../interfaces/query.interfaces.ts';
// import fakeReservations from '../../fakeReservations.ts';
type Query = {
  key: TabKey;
  query: Partial<StringFieldsOfBooking>;
  numericFields: NumericField<Partial<NumericFieldsOfBooking>>[];
  count: boolean;
  endPoint: string;
};

const reservationsPerPage = 4;
const messages = {
  checking_out: 'You don’t have any guests checking out today or tomorrow.',
  current: 'You don’t have any guests staying with you right now.',
  upcoming: 'You currently don’t have any upcoming guests.',
  upcoming_soon: 'You don’t have any guests arriving today or tomorrow.',
  pending: "You don't have any guest reviews to write."
};

function Today() {
  const { userContext } = useAuth();

  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState<TabKey>('checking_out');
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [reservationsPage, setReservationsPage] = useState<Reservations | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [reservationsCount, setReservationsCount] =
    useState<Reservations_Count | null>(null);

  const todayUTC = new Date().toISOString();
  const oneMonthFromNowUTC = new Date();
  oneMonthFromNowUTC.setMonth(oneMonthFromNowUTC.getMonth() + 1);
  const oneMonthFromNowUTCString = oneMonthFromNowUTC.toISOString();

  const activeFetch = useRef(0); // Ref to track if the fetch operation is the latest one
  if (!userContext || !userContext?.id) {
    return 'No context';
  }

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    activeFetch.current += 1;
    const fetchId = activeFetch.current;

    fetchTabData(signal);
    fetchReservations(focused, signal, fetchId);

    return () => {
      abortController.abort(); // Cleanup on component unmount or when effect re-runs
    };
  }, [focused, userContext?.id]);

  const queries: Query[] = [
    {
      key: 'pending',
      count: true,
      endPoint: 'bookings',
      query: { host_id: userContext.id, status: 'pending' },
      numericFields: []
    },
    {
      key: 'checking_out',
      count: true,
      endPoint: 'bookings',
      query: { host_id: userContext.id },
      numericFields: [
        { name: 'check_out_date_UTC', operator: '=', value: todayUTC }
      ]
    },
    {
      key: 'current',
      count: true,
      endPoint: 'bookings',
      query: { host_id: userContext.id, status: 'pending' },
      numericFields: [
        { name: 'check_in_date_UTC', operator: '<', value: todayUTC },
        { name: 'check_out_date_UTC', operator: '>', value: todayUTC }
      ]
    },
    {
      key: 'upcoming_soon',
      count: true,
      endPoint: 'bookings',
      query: { host_id: userContext.id, status: 'pending' },
      numericFields: [
        { name: 'check_in_date_UTC', operator: '>', value: todayUTC },
        {
          name: 'check_in_date_UTC',
          operator: '<',
          value: oneMonthFromNowUTCString
        }
      ]
    },
    {
      key: 'upcoming',
      count: true,
      endPoint: 'bookings',
      query: { host_id: userContext.id, status: 'pending' },
      numericFields: [
        {
          name: 'check_in_date_UTC',
          operator: '>',
          value: oneMonthFromNowUTCString
        }
      ]
    }
  ];

  const fetchTabData = (signal: AbortSignal) => {
    const executeFetch = async () => {
      try {
        const responses = await fetchData<number, TabKey>({
          queries,
          signal
        });

        const fetched: { [key in TabKey]: number } & { totalCount: number } = {
          checking_out: 0,
          current: 0,
          upcoming: 0,
          upcoming_soon: 0,
          pending: 0,
          totalCount: 0
        };

        responses.forEach((response) => {
          fetched[response.key as TabKey] = response.data;
        });
        const totalCount = Object.values(fetched).reduce(
          (sum, value) => sum + (value || 0),
          0
        );
        setReservationsCount({ ...fetched, totalCount });
      } catch (error) {
        console.log('Error:', error);
        throw new Error('Reservations could not ge retrieved');
      }
    };
    executeFetch();
  };

  const fetchReservations = (
    query_tab: TabKey,
    signal: AbortSignal,
    fetchId: number
  ) => {
    // let result: Reservations;
    setLoading(true);

    async function executeFetch() {
      try {
        const query = queries.find((query) => query.key === query_tab);
        if (query) {
          const responseArr = await fetchData<Reservations, TabKey>({
            queries: [query],
            signal
          });
          const result: Reservations = {
            reservations: responseArr[0].data.reservations
          };

          if (fetchId === activeFetch.current) {
            setReservations(result);
            setReservationsPage({ reservations: paginateReservations() });

            setCurrentPage(1);
            setLoading(false);
          }
        } else {
          // result = { reservations: [] };
          console.error(
            `Query with key '${query_tab}' not found in 'queries' array.`
          );
        }
      } catch (error) {
        if (fetchId === activeFetch.current) {
          setCurrentPage(1);
          setLoading(false);
        }
        console.log('Error:', error);
        throw new Error("Reservations couldn't be queried");
      }
    }
    executeFetch();
  };

  const paginateReservations = () => {
    if (reservations?.reservations) {
      return reservations.reservations.slice(
        (currentPage - 1) * reservationsPerPage,
        currentPage * reservationsPerPage
      );
    }
    return [];
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
          {userContext?.listings && userContext?.listings.length > 0 && (
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
            <div
              id="checking_out"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'checking_out' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={() => {
                setFocused('checking_out');
              }}
            >
              Checking out ({reservationsCount?.checking_out})
            </div>
            <div
              id="current"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'current' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={() => {
                setFocused('current');
              }}
            >
              Currently hosting ({reservationsCount?.current})
            </div>
            <div
              id="upcoming_soon"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'upcoming_soon' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={() => {
                setFocused('upcoming_soon');
              }}
            >
              Arriving soon ({reservationsCount?.upcoming_soon})
            </div>
            <div
              id="upcoming"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'upcoming' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={() => {
                setFocused('upcoming');
              }}
            >
              Upcoming ({reservationsCount?.upcoming})
            </div>
            <div
              id="pending"
              className={`mr-2 hover:border-black text-sm border ${
                focused === 'pending' &&
                'border-black border-2 hover:border-none'
              }border-neutral-300 rounded-full pt-2 pb-2.5 px-4`}
              onClick={() => {
                setFocused('pending');
              }}
            >
              Pending review ({reservationsCount?.pending})
            </div>
          </div>
          <div className="bg-neutral-100 w-full h-[12.5rem]">
            {loading ? (
              <LoadingSkeleton_HostBookings />
            ) : reservationsPage?.reservations &&
              reservationsPage?.reservations.length > 0 ? (
              <div className="grid grid-cols-4 h-full">
                {reservationsPage.reservations.map((reserv) => (
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
