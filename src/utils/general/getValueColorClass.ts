// Get the tailwindcss class for green or red depending on the number passed.
// +ve number = green
// -ve number = red
const getValueColorClass = (value: number): string => {
  if (value === 0) {
    return '';
  } else if (value > 0) {
    return 'text-green-500';
  } else {
    return 'text-red-500';
  }
};

export default getValueColorClass;
