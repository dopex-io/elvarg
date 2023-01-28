const isDailyExpired = () => {
  const timestamp = new Date().getTime();
  const expiry = new Date().setUTCHours(8, 0, 0, 0);

  return timestamp > expiry;
};

export default isDailyExpired;
