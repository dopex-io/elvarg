const SECONDS_IN_A_YEAR = 31536000;

const getTimeToExpirationInYears = (expiryInSeconds: number) => {
  const now = Date.now() / 1000; // Convert ms to s

  if (now > expiryInSeconds) return 0;

  const timeToExpirationInSeconds = expiryInSeconds - now;

  return timeToExpirationInSeconds / SECONDS_IN_A_YEAR;
};

export default getTimeToExpirationInYears;
