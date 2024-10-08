import {
  Booking,
  NumericFieldsOfBooking,
  StringFieldsOfBooking
} from '../../interfaces/booking.interfaces';
import { QueryBuilder } from '../../interfaces/query.interfaces';

const todayISO = new Date().toISOString();
const oneMonthFromNowISO = new Date();
oneMonthFromNowISO.setMonth(oneMonthFromNowISO.getMonth() + 1);
const oneMonthFromNowISOString = oneMonthFromNowISO.toISOString();
const reservationsPerPage = 4;

export function getQueries<QueryId extends string>(
  id: QueryId[],
  host_id: string,
  count: boolean,
  page?: number
): QueryBuilder<
  QueryId,
  StringFieldsOfBooking,
  NumericFieldsOfBooking,
  Partial<Booking>
>[] {
  const queryOptions: QueryBuilder<
    QueryId,
    StringFieldsOfBooking,
    NumericFieldsOfBooking,
    Partial<Booking>
  >[] = [
    {
      id: 'pending' as QueryId,
      count: count,
      endPoint: 'bookings',
      config: {},
      pagination: page ? { page: page, limit: reservationsPerPage } : null,
      query: { host_id: host_id, status: 'pending' },
      numericFields: []
    },
    {
      id: 'checking_out' as QueryId,
      count: count,
      endPoint: 'bookings',
      config: {},
      pagination: page ? { page: page, limit: reservationsPerPage } : null,
      query: { host_id: host_id },
      numericFields: [
        { name: 'check_out_date_ISO', operator: '=', value: todayISO }
      ]
    },
    {
      id: 'current' as QueryId,
      count: count,
      endPoint: 'bookings',
      config: {},
      pagination: page ? { page: page, limit: reservationsPerPage } : null,
      query: { host_id: host_id, status: 'pending' },
      numericFields: [
        { name: 'check_in_date_ISO', operator: '<', value: todayISO },
        { name: 'check_out_date_ISO', operator: '>', value: todayISO }
      ]
    },
    {
      id: 'upcoming_soon' as QueryId,
      count: count,
      endPoint: 'bookings',
      config: {},
      pagination: page ? { page: page, limit: reservationsPerPage } : null,
      query: { host_id: host_id, status: 'pending' },
      numericFields: [
        { name: 'check_in_date_ISO', operator: '>', value: todayISO },
        {
          name: 'check_in_date_ISO',
          operator: '<',
          value: oneMonthFromNowISOString
        }
      ]
    },
    {
      id: 'upcoming' as QueryId,
      count: count,
      endPoint: 'bookings',
      config: {},
      pagination: page ? { page: page, limit: reservationsPerPage } : null,
      query: { host_id: host_id, status: 'pending' },
      numericFields: [
        {
          name: 'check_in_date_ISO',
          operator: '>',
          value: oneMonthFromNowISOString
        }
      ]
    }
  ];
  const query = queryOptions.filter((query) => id.includes(query.id));
  if (!query) {
    throw new Error(`No query found for the id: ${id}`);
  }
  return query;
}
