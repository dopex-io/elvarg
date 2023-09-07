import { useCallback, useEffect, useState } from 'react';
import { Address, formatUnits } from 'viem';

import { ClammStrikeData, TickerData } from 'store/Vault/clamm';

import calculatePriceFromTick from 'utils/clamm/calculatePriceFromTick';
import getPremium from 'utils/clamm/getPremium';
import getTickerLiquidityData from 'utils/clamm/getTickerLiquidities';
import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
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
  selectedUniswapPool: any;
}

const useStrikesData = (props: Props) => {
  const {
    uniswapPoolAddress,
    isPut,
    isTrade,
    selectedExpiryPeriod,
    currentPrice,
    selectedUniswapPool,
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
      const tickersData: TickerData[] = await getTickerLiquidityData();
      const { tickScaleFlipped, currentTick } = selectedUniswapPool;
      const putStrikes = extractPutStrikes(
        tickersData,
        tickScaleFlipped,
        currentTick,
        selectedUniswapPool,
      );
      const callStrikes = extractCallStrikes(
        tickersData,
        tickScaleFlipped,
        currentTick,
        selectedUniswapPool,
      );
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
    selectedUniswapPool,
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

const extractPutStrikes = (
  tickersData: TickerData[],
  tickScaleFlipped: boolean,
  currentTick: number,
  selectedUniswapPool: any,
) => {
  return tickersData
    .filter(({ tickLower, tickUpper }) =>
      tickScaleFlipped ? tickUpper > currentTick : tickLower < currentTick,
    )
    .map(
      ({
        tickLower,
        tickUpper,
        liquidity,
        liquidityWithdrawn,
        liquidityUsed,
        liquidityUnused,
      }) => {
        const totalLiquidtyAtTick =
          BigInt(liquidity) - BigInt(liquidityWithdrawn);
        const liquidityUsedAtTick =
          BigInt(liquidityUsed) - BigInt(liquidityUnused);
        const availableLiquidity =
          BigInt(totalLiquidtyAtTick) - BigInt(liquidityUsedAtTick);

        let optionsAvailable = 0n;
        const { amount0, amount1 } = getAmountsForLiquidity(
          selectedUniswapPool.sqrtX96,
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          availableLiquidity,
        );

        const priceFromTick = calculatePriceFromTick(
          tickLower,
          10 ** 18,
          10 ** 6,
          tickScaleFlipped,
        );

        optionsAvailable = amount0 > amount1 ? amount0 : amount1;
        optionsAvailable =
          (optionsAvailable * BigInt(1e8)) /
          BigInt(Number(priceFromTick.toFixed(0)) * 1e8);

        return {
          strike: priceFromTick,
          lowerTick: tickLower,
          upperTick: tickUpper,
          optionsAvailable: optionsAvailable,
        };
      },
    );
};

const extractCallStrikes = (
  tickersData: TickerData[],
  tickScaleFlipped: boolean,
  currentTick: number,
  selectedUniswapPool: any,
) => {
  return tickersData
    .filter(({ tickUpper, tickLower }) =>
      tickScaleFlipped ? tickLower < currentTick : tickUpper > currentTick,
    )
    .map(
      ({
        tickLower,
        tickUpper,
        liquidityWithdrawn,
        liquidityUsed,
        liquidity,
        liquidityUnused,
      }) => {
        const totalLiquidtyAtTick =
          BigInt(liquidity) - BigInt(liquidityWithdrawn);
        const liquidityUsedAtTick =
          BigInt(liquidityUsed) - BigInt(liquidityUnused);
        const availableLiquidity =
          BigInt(totalLiquidtyAtTick) - BigInt(liquidityUsedAtTick);

        let optionsAvailable = 0n;
        const { amount0, amount1 } = getAmountsForLiquidity(
          selectedUniswapPool.sqrtX96,
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          availableLiquidity,
        );
        optionsAvailable = amount0 > amount1 ? amount0 : amount1;

        return {
          strike: calculatePriceFromTick(
            tickUpper,
            10 ** 18,
            10 ** 6,
            tickScaleFlipped,
          ),
          lowerTick: tickLower,
          upperTick: tickUpper,
          optionsAvailable: optionsAvailable,
        };
      },
    );
};
