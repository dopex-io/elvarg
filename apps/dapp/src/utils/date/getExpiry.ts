import getDailyExpiry from './getDailyExpiry';
import getMonthlyExpiry from './getMonthlyExpiry';
import getWeeklyExpiry from './getWeeklyExpiry';

type Duration = 'DAILY' | 'WEEKLY' | 'MONTHLY';

const getExpiry = (duration: Duration) => {
  switch (duration) {
    case 'DAILY':
      return getDailyExpiry();
    case 'WEEKLY':
      return getWeeklyExpiry();
    default:
      return getMonthlyExpiry();
  }
};

export default getExpiry;

// todo: replace getExpiry from utils/ssov/getExpiry with this
