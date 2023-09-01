import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

const calculatePriceFromTick = (
  tick: number,
  precision0: number = DECIMALS_TOKEN,
  precision1: number = DECIMALS_USD,
) => {
  return (1.0001 ** tick * precision0) / precision1;
};
export default calculatePriceFromTick;
