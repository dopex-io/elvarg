const getMonthlyExpiry = () => {
  const date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  if (lastDay.getDay() < 5) {
    lastDay.setDate(lastDay.getDate() - 7);
  }
  lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - 5));
  return lastDay;
};

export default getMonthlyExpiry;
