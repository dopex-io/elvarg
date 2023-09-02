import { useCallback, useEffect, useState } from 'react';
import { Address, formatUnits } from 'viem';

import { ClammStrikeData } from 'store/Vault/clamm';

import generateStrikes from 'utils/clamm/generateStrikes';
import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  uniswapPoolAddress: Address;
  isPut: boolean;
  tte: number;
  currentPrice: number;
}

const useStrikesData = (props: Props) => {
  const { uniswapPoolAddress, isPut, tte, currentPrice } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [strikesData, setStrikesData] = useState<ClammStrikeData[]>([]);

  const constructEpochStrikeChain = useCallback(async () => {
    if (!uniswapPoolAddress) return;

    setIsLoading(true);

    const strikes = await generateStrikes(uniswapPoolAddress, 10, isPut);

    const _strikesData = isPut
      ? await generatePutStrikesData({
          strikes: strikes,
          tte: tte,
          currentPrice: currentPrice,
        })
      : await generateCallStrikesData({
          strikes: strikes,
          tte: tte,
          currentPrice: currentPrice,
        });
    setStrikesData(_strikesData);
    setIsLoading(false);
  }, [uniswapPoolAddress, isPut, tte, currentPrice]);

  useEffect(() => {
    constructEpochStrikeChain();
  }, [constructEpochStrikeChain]);

  return {
    strikesData,
    isLoading,
  };
};

export default useStrikesData;

async function generateCallStrikesData({
  strikes,
  tte,
  currentPrice,
}: {
  strikes: number[];
  tte: number;
  currentPrice: number;
}): Promise<ClammStrikeData[]> {
  return strikes.map((strike) => {
    // TODO: get these values from the contract
    const strikePremiumRaw = BigInt(Math.pow(10, 8) * 2.789);
    const premiumPerOption = Number(
      formatUnits(strikePremiumRaw, DECIMALS_STRIKE),
    );

    // TODO: get these values from the contract
    const strikeIvRaw = BigInt(139);
    const iv = Number(strikeIvRaw);

    // TODO: get these values from the contract
    const liquidityRaw = BigInt(123);
    const liquidity = Number(formatUnits(liquidityRaw, DECIMALS_TOKEN));

    const greeks = computeOptionGreeks({
      spot: currentPrice,
      strike,
      expiryInYears: getTimeToExpirationInYears(tte),
      ivInDecimals: iv / 100,
      isPut: false,
    });

    return {
      ...greeks,
      strike: strike,
      liquidity: liquidity,
      premiumPerOption: premiumPerOption,
      iv: iv,
      breakeven: strike + premiumPerOption,
      utilization: 0,
      tvl: 0,
      apy: 0,
      premiumApy: 0,
    };
  });
}

function generatePutStrikesData({
  strikes,
  tte,
  currentPrice,
}: {
  strikes: number[];
  tte: number;
  currentPrice: number;
}): ClammStrikeData[] {
  return strikes.map((strike) => {
    // TODO: get these values from the contract
    const strikePremiumRaw = BigInt(Math.pow(10, 8) * 2.789);
    const premiumPerOption = Number(
      formatUnits(strikePremiumRaw, DECIMALS_STRIKE),
    );

    // TODO: get these values from the contract
    const strikeIvRaw = BigInt(139);
    const iv = Number(strikeIvRaw);

    // TODO: get these values from the contract
    const liquidityRaw = BigInt(123);
    const liquidity = Number(formatUnits(liquidityRaw, DECIMALS_TOKEN));

    const greeks = computeOptionGreeks({
      spot: currentPrice,
      strike,
      expiryInYears: getTimeToExpirationInYears(tte),
      ivInDecimals: iv / 100,
      isPut: false,
    });

    return {
      ...greeks,
      strike: strike,
      liquidity: liquidity,
      premiumPerOption: premiumPerOption,
      iv: iv,
      breakeven: strike - premiumPerOption,
      utilization: 0,
      tvl: 0,
      apy: 0,
      premiumApy: 0,
    };
  });
}
