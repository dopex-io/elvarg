export default function smartDisplay(
  str: string,
  noOfDecimalsPointsToShow: number = 2
): string {
  const decimalPointIndex = str.indexOf('.');

  return str.slice(0, decimalPointIndex + noOfDecimalsPointsToShow + 1);
}
