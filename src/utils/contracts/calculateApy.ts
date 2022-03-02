const ethMantissa = 1e18;
const blocksPerDay = 6570; // 13.15 seconds per block
const daysPerYear = 365;

export default function calculateApy(ratePerBlock: number | string): number {
  return (
    (Math.pow(
      (Number(ratePerBlock) / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100
  );
}
