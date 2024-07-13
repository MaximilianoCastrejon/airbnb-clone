import * as moment from "moment-timezone";

export const convertLocalTimetoISO = (localTime, timeZone) => {
  return moment.tz(localTime, timeZone).utc().format();
};

export const convertUTCToLocalTime = (utcTime, timeZone) => {
  return moment.utc(utcTime).tz(timeZone).format();
};
