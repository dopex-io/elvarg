import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

function getTimeToExpiryInYears(expiryDate) {
  let distance = Number(
    formatDistanceToNowStrict(expiryDate, {
      unit: 'second',
    }).split(' ')[0]
  );
  const secondsInAYear = 31536000;
  return distance / secondsInAYear;
}

export default getTimeToExpiryInYears;
