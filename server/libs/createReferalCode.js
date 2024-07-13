export const createReferralCode = function (referrerFirstName) {
  const length = 6;
  const randomDigit = (Math.random() * 10) % 1;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    randomString += chars.charAt(randomIndex);
  }
  return referrerFirstName + randomDigit + randomString;
};
