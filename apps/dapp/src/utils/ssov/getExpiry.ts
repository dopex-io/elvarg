import { SsovDuration } from 'types/ssov';

import getMonthlyExpiry from 'utils/date/getMonthlyExpiry';
import getWeeklyExpiry from 'utils/date/getWeeklyExpiry';

const getExpiry = (duration: SsovDuration) => {
  return duration === 'WEEKLY' ? getWeeklyExpiry() : getMonthlyExpiry();
};

export default getExpiry;
