const SECONDS_IN_A_YEAR = 31536000;

const getTimeToExpirationInYears = (expiry: number) => {
  const now = Date.now() / 1000; // Convert ms to s

  if (now > expiry) return 0;

  const timeToExpirationInSeconds = expiry - now;

  return timeToExpirationInSeconds / SECONDS_IN_A_YEAR;
};

export default getTimeToExpirationInYears;
