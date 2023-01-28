function getFormattedDate(date = new Date()): string {
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  const year = String(date.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}-${month}-${year}`;
}

export default getFormattedDate;
