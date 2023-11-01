import parsePriceFromTick from './getPriceFromTick';
import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
} from './liquidityAmountMath';
import { OptionsPurchasesRaw } from './subgraph/getUserOptionsPurchases';
import { getSqrtRatioAtTick } from './tickMath';

function parseOptionsPurchase(
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  position: OptionsPurchasesRaw,
) {
  const { isPut, options, tickLower, tickUpper, premium, txHash, timestamp } =
    position;

  const tickLowerPrice = parsePriceFromTick(
    tickLower,
    precision0,
    precision1,
    inversePrice,
  );
  const tickUpperPrice = parsePriceFromTick(
    tickUpper,
    precision0,
    precision1,
    inversePrice,
  );

  return {
    strike: isPut ? tickLowerPrice : tickUpperPrice,
    amounts: {
      token0Amount: getAmount0ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        options,
      ),
      token1Amount: getAmount1ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        options,
      ),
    },
    isPut,
    timestamp: Number(timestamp.toString()),
    premium,
    txHash,
  };
}
export default parseOptionsPurchase;
