import React, { useCallback, useMemo, useState } from 'react';
import { formatUnits, hexToBigInt, parseUnits } from 'viem';

import { Combobox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes, { GeneratedStrike } from 'utils/clamm/generateStrikes';
import { Strike } from 'utils/clamm/varrock/getStrikesChain';
import { cn, formatAmount } from 'utils/general';
import { parseInputChange } from 'utils/input';

import { ZERO_FEES_STRIKES } from 'constants/clamm';

const StrikeSelector = () => {
  const { selectStrike, strikesChain } = useStrikesChainStore();
  const { isTrade, tick, selectedOptionsPool, markPrice } = useClammStore();

  const [isCall, setIsCall] = useState(false);
  const [query, setQuery] = useState('');

  const generatedStrikes = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;

    const token0IsCallToken =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const token0Precision =
      10 ** (token0IsCallToken ? callToken.decimals : putToken.decimals);
    const token1Precision =
      10 ** (token0IsCallToken ? putToken.decimals : callToken.decimals);

    return generateStrikes(
      tick,
      token0Precision,
      token1Precision,
      !token0IsCallToken,
      100,
    );
  }, [tick, selectedOptionsPool]);

  const putStrikes = useMemo(() => {
    return isTrade
      ? strikesChain
          .filter(({ strike }) => markPrice > strike)
          .sort((a, b) => Number(b.strike) - Number(a.strike))
      : generatedStrikes
          .filter(({ strike }) => markPrice > strike)
          .sort((a, b) => Number(b.strike) - Number(a.strike));
  }, [generatedStrikes, isTrade, strikesChain, markPrice]);

  const callStrikes = useMemo(() => {
    return isTrade
      ? strikesChain
          .filter(({ type }) => type.toLowerCase() === 'call')
          .sort((a, b) => Number(a.strike) - Number(b.strike))
      : generatedStrikes
          .filter(({ type }) => type.toLowerCase() === 'call')
          .sort((a, b) => Number(a.strike) - Number(b.strike));
  }, [generatedStrikes, isTrade, strikesChain]);

  const strikesInContext = useMemo(() => {
    return (isCall ? callStrikes : putStrikes)
      .filter(({ strike }) => !ZERO_FEES_STRIKES.includes(strike))
      .filter(
        ({ meta: { tickLower, tickUpper } }) =>
          tick < tickLower || tick > tickUpper,
      );
  }, [callStrikes, putStrikes, isCall, tick]);

  const rewardsStrikesLimit = useMemo(() => {
    return {
      upperLimit: markPrice * 1.024,
      lowerLimit: markPrice * 0.976,
    };
  }, [markPrice]);

  const tokenInfo = useMemo(() => {
    if (!selectedOptionsPool)
      return {
        callTokenDecimals: 18,
        putTokenDecimals: 18,
        callTokenSymbol: '-',
        putTokenSymbol: '-',
      };

    const { callToken, putToken } = selectedOptionsPool;

    return {
      callTokenDecimals: callToken.decimals,
      putTokenDecimals: putToken.decimals,
      callTokenSymbol: callToken.symbol,
      putTokenSymbol: putToken.symbol,
    };
  }, [selectedOptionsPool]);

  const checkStrike = useCallback(() => {
    const strike = Number(query);
    if (strikesInContext.length === 0) {
      return;
    }

    let closestNumber = strikesInContext[0].strike;
    let closestDifference = Math.abs(strike - closestNumber);
    for (let i = 1; i < strikesInContext.length; i++) {
      const currentDifference = Math.abs(strike - strikesInContext[i].strike);

      if (currentDifference < closestDifference) {
        closestNumber = strikesInContext[i].strike;
        closestDifference = currentDifference;
      }
    }

    setQuery(closestNumber.toFixed(4));
    return closestNumber;
  }, [query, strikesInContext]);

  const submitStrike = useCallback(
    (strike: number) => {
      const strikeData = strikesInContext.find(({ strike: currentStrike }) => {
        return currentStrike === strike;
      });

      if (!strikeData) return;
      let isCallStrike = markPrice < strike ? true : false;
      const optionsAvailable = isTrade
        ? formatUnits(
            (parseUnits((strikeData as Strike).optionsAvailable, 18) * 9998n) /
              10000n,
            18,
          )
        : '0';
      selectStrike(strikeData.strike, {
        amount0: 0,
        amount1: isTrade
          ? Number(optionsAvailable) < 0
            ? '0'
            : optionsAvailable
          : '0',
        isCall: isCallStrike,
        strike: strikeData.strike,
        tokenDecimals: isCallStrike
          ? tokenInfo.callTokenDecimals
          : tokenInfo.putTokenDecimals,
        tokenSymbol: isCallStrike
          ? tokenInfo.callTokenSymbol
          : tokenInfo.putTokenSymbol,
        ttl: '24h',
        meta: {
          tickLower: Number(strikeData.meta.tickLower),
          tickUpper: Number(strikeData.meta.tickUpper),
          amount0: 0n,
          amount1: 0n,
        },
      });
      setQuery('');
    },
    [
      isTrade,
      markPrice,
      selectStrike,
      strikesInContext,
      tokenInfo.callTokenSymbol,
      tokenInfo.callTokenDecimals,
      tokenInfo.putTokenDecimals,
      tokenInfo.putTokenSymbol,
    ],
  );

  const filteredStrikes = useMemo(() => {
    return query === ''
      ? strikesInContext
      : strikesInContext.filter(({ strike }) => {
          return strike.toString().toLowerCase().includes(query.toLowerCase());
        });
  }, [query, strikesInContext]);

  return (
    <div
      className="flex flex-col"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const strikeData = checkStrike();
          if (strikeData) {
            submitStrike(strikeData);
          }
        }
      }}
    >
      <div className="w-full flex items-center space-x-[4px]">
        <div id="option-side" className="flex w-[68px]">
          <div
            role="button"
            onClick={() => {
              if (!isCall) return;
              setIsCall(false);
              setQuery('');
            }}
            className="w-[32px]  h-[30px] flex items-center justify-center bg-carbon rounded-l-md"
          >
            <span
              className={cn(
                'py-[4px] px-[6px] rounded-md flex items-center justify-center transition duration-200 ease-in-out',
                !isCall && 'bg-umbra',
              )}
            >
              <ArrowDownRightIcon
                height={14}
                width={14}
                className={cn('text-down-bad rounded-md')}
              />
            </span>
          </div>
          <div
            role="button"
            onClick={() => {
              if (isCall) return;
              setIsCall(true);
              setQuery('');
            }}
            className="w-[32px]  h-[30px] flex items-center justify-center bg-carbon rounded-r-md"
          >
            <span
              className={cn(
                'py-[4px] px-[6px] rounded-md flex items-center justify-center cursor-pointer transition duration-200 ease-in-out',
                isCall && 'bg-umbra',
              )}
            >
              <ArrowUpRightIcon
                height={14}
                width={14}
                className={cn('text-up-only rounded-md')}
              />
            </span>
          </div>
        </div>
        <div className="relative  border border-mineshaft rounded-md w-full px-[4px]">
          <Combobox
            value={query}
            // @ts-ignore
            onChange={(data: GeneratedStrike | Strike) => {
              setQuery(data.strike.toFixed(4));
            }}
          >
            <div className="flex items-center justify-center">
              <Combobox.Input
                spellCheck="false"
                inputMode="decimal"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                minLength={1}
                maxLength={15}
                className="w-full text-[12px] text-right bg-umbra focus:outline-none focus:border-mineshaft  placeholder-stieglitz text-xs p-[6px] "
                onChange={(e: any) => {
                  parseInputChange(e, (e) => setQuery(e.target.value));
                }}
                // @ts-ignore
                placeHolder="Enter or select strike"
                value={query}
              />
              <Combobox.Button>
                <ChevronDownIcon height={14} width={14} />
              </Combobox.Button>
            </div>
            <Combobox.Options className="absolute bg-carbon text-[12px] w-full space-y-[4px] max-h-[150px] overflow-y-scroll rounded-b-md z-20">
              {filteredStrikes.map((strikeData) => (
                <Combobox.Option
                  key={strikeData.strike}
                  value={strikeData}
                  className="cursor-pointer hover:bg-mineshaft w-full text-center"
                >
                  $ {formatAmount(strikeData.strike, 4)}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>
        <div id="strike-confirm-button">
          <PlusCircleIcon
            role="button"
            height={24}
            width={24}
            className="bg-primary p-[5px] rounded-md hover:opacity-50"
            onClick={() => {
              const strikeData = checkStrike();
              if (strikeData) {
                submitStrike(strikeData);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StrikeSelector;
