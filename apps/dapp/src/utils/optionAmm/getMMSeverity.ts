export enum LiquidationRisk {
  Low = 0,
  Moderate = 1,
  High = 2,
}

const getMMSeverity = (mm: bigint, threshold: bigint): LiquidationRisk => {
  if (mm < threshold / 2n) {
    return LiquidationRisk.Low;
  } else if (mm >= threshold / 2n) {
    return LiquidationRisk.Moderate;
  } else {
    return LiquidationRisk.High;
  }
};

export default getMMSeverity;
