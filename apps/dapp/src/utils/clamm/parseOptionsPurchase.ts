import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
} from './liquidityAmountMath';
import parsePriceFromTick from './parsePriceFromTick';
import { OptionsPurchasesRaw } from './subgraph/getUserOptionsPurchases';
import { getSqrtRatioAtTick } from './tickMath';

function parseOptionsPurchase(
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  position: OptionsPurchasesRaw,
) {
  const { expiry, isPut, options, tickLower, tickUpper, premium, txHash } =
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
    timestamp: Number(expiry.toString()),
    premium,
    txHash,
  };
}
export default parseOptionsPurchase;
