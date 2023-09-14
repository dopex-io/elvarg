import { LiquidationRisk } from './getMMSeverity';

const getHighlightingFromRisk = (risk: LiquidationRisk) => {
  switch (risk) {
    case LiquidationRisk.Low:
      return 'up-only';
    case LiquidationRisk.Moderate:
      return 'jaffa';
    case LiquidationRisk.High:
      return 'down-bad';
    default:
      return 'stieglitz';
  }
};

export default getHighlightingFromRisk;
