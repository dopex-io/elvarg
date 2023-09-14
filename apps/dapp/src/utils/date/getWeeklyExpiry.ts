import add from 'date-fns/add';
import setDay from 'date-fns/setDay';

const getWeeklyExpiry = () => {
  return setDay(add(new Date(), { weeks: 0 }), 5).setUTCHours(8, 0, 0);
};

export default getWeeklyExpiry;
