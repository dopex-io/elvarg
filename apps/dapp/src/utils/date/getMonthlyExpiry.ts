import add from 'date-fns/add';
import setDay from 'date-fns/setDay';

const getMonthlyExpiry = () => {
  const date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  if (lastDay.getDay() < 5) {
    lastDay.setDate(lastDay.getDate() - 7);
  }
  lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - 5));
  return Math.ceil(
    Number(setDay(add(lastDay, { weeks: 0 }), 6).setUTCHours(8, 0, 0)),
  );
};

export default getMonthlyExpiry;
