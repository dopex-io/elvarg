const getPriceFromTick = (
  tick: number,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
) => {
  const base = inversePrice ? 1 / 1.0001 ** tick : 1.0001 ** tick;
  const dividend = inversePrice ? precision0 : precision1;
  const mulitplicant = inversePrice ? precision1 : precision0;
  const price = (base * mulitplicant) / dividend;
  return price;
};
export default getPriceFromTick;
