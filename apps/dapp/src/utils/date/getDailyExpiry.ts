import addDays from 'date-fns/addDays';

const getDailyExpiry = () => {
  return Number(addDays(new Date().setUTCHours(8, 0, 0), 1));
};

export default getDailyExpiry;
