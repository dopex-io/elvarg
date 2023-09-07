import { useCallback, useEffect, useState } from 'react';
import { Address, formatUnits } from 'viem';

import { ClammStrikeData } from 'store/Vault/clamm';

import getPremium from 'utils/clamm/getPremium';
import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

import usePositionManager, { ClammStrike } from './usePositionManager';

interface Props {
  uniswapPoolAddress: Address;
  isPut: boolean;
  isTrade: boolean;
  selectedExpiryPeriod: number;
  currentPrice: number;
  getClammStrikes: Function;
}

const useStrikesData = (props: Props) => {
  const {
    uniswapPoolAddress,
    isPut,
    isTrade,
    selectedExpiryPeriod,
    currentPrice,
    getClammStrikes,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [strikesData, setStrikesData] = useState<ClammStrikeData[]>([]);

  const { getStrikesWithTicks } = usePositionManager();

  const constructEpochStrikeChain = useCallback(async () => {
    if (!uniswapPoolAddress) return;

    setIsLoading(true);

    if (!isTrade) {
      const strikes = await getStrikesWithTicks(10);
      const _strikesData = await generateStrikesData({
        strikes: strikes,
        selectedExpiryPeriod: selectedExpiryPeriod,
        currentPrice: currentPrice,
        optionPool: uniswapPoolAddress,
        isPut: isPut,
      });
      setStrikesData(_strikesData);
    } else {
      const { callStrikes, putStrikes } = getClammStrikes();
      let _strikesData = isPut ? putStrikes : callStrikes;
      _strikesData.reverse();
      setStrikesData(_strikesData);
    }

    setIsLoading(false);
  }, [
    uniswapPoolAddress,
    isTrade,
    getStrikesWithTicks,
    selectedExpiryPeriod,
    currentPrice,
    isPut,
    getClammStrikes,
  ]);

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

async function generateStrikesData({
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
          optionPool,
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
