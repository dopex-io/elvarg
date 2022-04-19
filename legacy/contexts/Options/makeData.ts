import * as greeks from 'utils/math/blackScholes/greeks';
import blackScholes from 'utils/math/blackScholes';
import getTimeToExpiryInYears from 'utils/date/getTimeToExpiryInYears';

import { OptionDataItem } from '.';

interface Args {
  callIv: number;
  putIv: number;
  strikePrice: number;
  currentPrice: number;
  expiryDate: number;
}

function makeData(args: Args): OptionDataItem {
  const { callIv, putIv, strikePrice, currentPrice, expiryDate } = args;

  const timeToExpiryInYears = getTimeToExpiryInYears(expiryDate);

  const callOptionPrice = blackScholes(
    currentPrice,
    strikePrice,
    timeToExpiryInYears,
    callIv / 100,
    0,
    'call'
  );

  const putOptionPrice = blackScholes(
    currentPrice,
    strikePrice,
    timeToExpiryInYears,
    putIv / 100,
    0,
    'put'
  );

  let putBreakEven = strikePrice - putOptionPrice;
  let callBreakEven = strikePrice + callOptionPrice;

  return {
    strikePrice,
    isCallItm: currentPrice > strikePrice,
    isPutItm: strikePrice > currentPrice,
    callBreakEven,
    putBreakEven,
    callOptionPrice,
    putOptionPrice,
    callGreeks: {
      delta: greeks.getDelta(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        callIv / 100,
        0,
        'call'
      ),
      gamma: greeks.getGamma(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        callIv / 100,
        0
      ),
      vega: greeks.getVega(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        callIv / 100,
        0
      ),
      theta: greeks.getTheta(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        callIv / 100,
        0,
        'call',
        365
      ),
    },
    putGreeks: {
      delta: greeks.getDelta(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        putIv / 100,
        0,
        'put'
      ),
      gamma: greeks.getGamma(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        putIv / 100,
        0
      ),
      vega: greeks.getVega(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        putIv / 100,
        0
      ),
      theta: greeks.getTheta(
        currentPrice,
        strikePrice,
        timeToExpiryInYears,
        putIv / 100,
        0,
        'put',
        365
      ),
    },
    callIv,
    putIv,
  };
}

export default makeData;
