import { useCallback, useEffect, useState } from 'react';
import {
  Address,
  formatUnits,
  parseEther,
  parseUnits,
  zeroAddress,
} from 'viem';

import { ClammStrikeData } from 'store/Vault/clamm';

import getPremium from 'utils/clamm/getPremium';
import getCurrentTime from 'utils/date/getCurrentTime';
import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

import { ClammStrike } from './usePositionManager';

interface Props {
  uniswapPoolAddress: Address;
  isPut: boolean;
  selectedExpiryPeriod: number;
  currentPrice: number;
  strikes: ClammStrike[];
}

const useStrikesData = (props: Props) => {
  const {
    uniswapPoolAddress,
    isPut,
    selectedExpiryPeriod,
    currentPrice,
    strikes,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [strikesData, setStrikesData] = useState<ClammStrikeData[]>([]);

  const constructEpochStrikeChain = useCallback(async () => {
    if (!uniswapPoolAddress) return;

    setIsLoading(true);

    const _strikesData = await generateStrikesData({
      strikes: strikes,
      selectedExpiryPeriod: selectedExpiryPeriod,
      currentPrice: currentPrice,
      optionPool: uniswapPoolAddress,
      isPut: isPut,
    });

    setStrikesData(_strikesData);
    setIsLoading(false);
  }, [uniswapPoolAddress, isPut, strikes, selectedExpiryPeriod, currentPrice]);

  useEffect(() => {
    constructEpochStrikeChain();
  }, [constructEpochStrikeChain]);

  return {
    strikesData,
    isLoading,
  };
};

export default useStrikesData;

interface GenerateStikesProps {
  strikes: ClammStrike[];
  selectedExpiryPeriod: number;
  currentPrice: number;
  optionPool: Address;
  isPut: boolean;
}

function generateStrikesData({
  strikes,
  selectedExpiryPeriod,
  currentPrice,
  optionPool,
  isPut,
}: GenerateStikesProps): Promise<ClammStrikeData[]> {
  return Promise.all(
    strikes.map(async (clammStrike: ClammStrike) => {
      const strikeIvRaw = BigInt(139);
      const iv = Number(strikeIvRaw);

      let strikePremiumRaw = BigInt(0);
      try {
        (await getPremium(
          // optionPool,
          // isPut,
          // Math.round(getCurrentTime()) + selectedExpiryPeriod,
          // parseUnits(clammStrike.strike.toString(), DECIMALS_STRIKE),
          // parseUnits(currentPrice.toString(), DECIMALS_STRIKE),
          // strikeIvRaw,
          // parseEther('1'),
          zeroAddress,
          true,
          0,
          0n,
          0n,
          0n,
          0n,
        )) as bigint;
      } catch (e) {
        console.error('Fail to getPremium', e);
      }

      const premiumPerOption = Number(
        formatUnits(strikePremiumRaw, DECIMALS_STRIKE),
      );

      // TODO: get these values from the contract
      const liquidityRaw = BigInt(123);
      const liquidity = Number(formatUnits(liquidityRaw, DECIMALS_TOKEN));

      const greeks = computeOptionGreeks({
        spot: currentPrice,
        strike: clammStrike.strike,
        expiryInYears: getTimeToExpirationInYears(selectedExpiryPeriod),
        ivInDecimals: iv / 100,
        isPut: isPut,
      });

      return {
        ...greeks,
        strike: clammStrike.strike,
        liquidity: liquidity,
        premiumPerOption: premiumPerOption,
        iv: iv,
        breakeven: clammStrike.strike - premiumPerOption,
        utilization: 0,
        tvl: 0,
        apy: 0,
        premiumApy: 0,
      };
    }),
  );
}
