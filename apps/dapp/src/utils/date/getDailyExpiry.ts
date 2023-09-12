import addDays from 'date-fns/addDays';

const getDailyExpiry = () => {
  return addDays(new Date().setUTCHours(8, 0, 0), 1);
};

export default getDailyExpiry;
