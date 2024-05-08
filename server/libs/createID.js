import crypto from "crypto";

function formatDate(format) {
  // if (!date) {
  //   return ""; // or handle the case when date is undefined
  // }
  const date = new Date();
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };
  return format.replace(/mm|dd|yyyy|yy/gi, (matched) => {
    const value = map[matched];
    // Pad the month and day with leading zeros if needed
    return value < 10 ? `0${value}` : value.toString();
  });
}

export const randomImageName = (bytes = 32) => {
  const date = formatDate("yyyymmdd");
  return `${date}_${crypto.randomBytes(bytes).toString("hex")}`;
};
