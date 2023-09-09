function timestampDifferenceInYears(
  timestamp1: number,
  timestamp2: number,
): number {
  // Constants
  const millisecondsPerSecond = 1000;
  const secondsPerMinute = 60;
  const minutesPerHour = 60;
  const hoursPerDay = 24;
  const daysPerYear = 365.25; // Accounting for leap years

  // Convert the timestamp difference to years
  const differenceMilliseconds = Math.abs(timestamp1 - timestamp2);
  const years =
    differenceMilliseconds /
    (millisecondsPerSecond *
      secondsPerMinute *
      minutesPerHour *
      hoursPerDay *
      daysPerYear);

  return years;
}

export default timestampDifferenceInYears;
