// Get the sign of the number passed
const getValueSign = (value: number): string => {
  if (value === 0) {
    return '';
  } else if (value > 0) {
    return '+';
  } else {
    return '-';
  }
};

export default getValueSign;
