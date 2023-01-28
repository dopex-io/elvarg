import setDay from 'date-fns/setDay';
import add from 'date-fns/add';

function getNextFriday(noOfWeeksAhead: number, latest = new Date()): Date {
  return setDay(add(latest, { weeks: noOfWeeksAhead }), 5);
}

export default getNextFriday;
