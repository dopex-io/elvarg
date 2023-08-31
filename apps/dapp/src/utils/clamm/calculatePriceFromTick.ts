const calculatePriceFromTick = (
  tick: number,
  precision0: number = 1e18,
  precision1: number = 1e6,
) => {
  return (1.0001 ** tick * precision0) / precision1;
};
export default calculatePriceFromTick;
