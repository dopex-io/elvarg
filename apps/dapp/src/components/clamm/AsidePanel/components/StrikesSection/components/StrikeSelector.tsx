import React, { useCallback, useMemo, useState } from 'react';
import { hexToBigInt } from 'viem';

import { Listbox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes, { GeneratedStrike } from 'utils/clamm/generateStrikes';
import {
  Strike,
  StrikesChainAPIResponse,
} from 'utils/clamm/varrock/getStrikesChain';
import { cn, formatAmount } from 'utils/general';

const StrikeSelector = () => {
  const [isCall, setIsCall] = useState(false);
  const { selectStrike, selectedStrikes, strikesChain, deselectStrike } =
    useStrikesChainStore();
  const { isTrade, tick, selectedOptionsPool, markPrice } = useClammStore();
  const [open, setOpen] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');

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
      150,
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
    return isCall ? callStrikes : putStrikes;
  }, [isCall, callStrikes, putStrikes]);

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
    const strike = Number(inputAmount);
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
    setInputAmount(closestNumber.toString());
  }, [inputAmount, strikesInContext]);

  const submitStrike = useCallback(() => {
    const strike: any = strikesInContext.find(
      ({ strike }) => strike.toString() === inputAmount,
    );
    if (!strike) return;
    selectStrike(strike.strike, {
      amount0: 0,
      amount1: '0',
      isCall: isCall,
      strike: strike.strike,
      tokenDecimals: isCall
        ? tokenInfo.callTokenDecimals
        : tokenInfo.putTokenDecimals,
      tokenSymbol: isCall
        ? tokenInfo.callTokenSymbol
        : tokenInfo.putTokenSymbol,
      ttl: '24h',
      meta: {
        tickLower: Number(strike.meta.tickLower),
        tickUpper: Number(strike.meta.tickUpper),
        amount0: 0n,
        amount1: 0n,
      },
    });
  }, [
    inputAmount,
    isCall,
    selectStrike,
    strikesInContext,
    tokenInfo.callTokenSymbol,
    tokenInfo.callTokenDecimals,
    tokenInfo.putTokenDecimals,
    tokenInfo.putTokenSymbol,
  ]);

  return (
    <div
      className="flex flex-col"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          checkStrike();
          submitStrike();
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
              setInputAmount('');
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
              setInputAmount('');
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
        <div
          id="strikes-drop-down-input"
          className="border-2 w-full p-[4px] flex items-center justify-end space-x-[4px] rounded-md border-carbon"
        >
          <input
            onBlur={checkStrike}
            onChange={(event: any) => {
              setInputAmount(event.target.value);
            }}
            value={inputAmount}
            type="number"
            min="0"
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                console.log('FIXING STRIKE');
              }
            }}
            placeholder="Enter or select strike"
            className={cn(
              'w-full text-[12px] text-right bg-umbra focus:outline-none focus:border-mineshaft rounded-md placeholder-stieglitz',
            )}
          />

          <ChevronDownIcon
            role="button"
            height={16}
            width={16}
            className="text-stieglitz"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          />
        </div>
        <div id="strike-confirm-button">
          <PlusCircleIcon
            role="button"
            height={24}
            width={24}
            className="bg-primary p-[5px] rounded-md hover:opacity-50"
            onClick={submitStrike}
          />
        </div>
      </div>
      <div className="z-20 relative w-[75%] ml-[20%]">
        <Listbox
          disabled
          multiple
          value={[]}
          onChange={(
            data: { key: number; strikeData: Strike | GeneratedStrike }[],
          ) => {
            const { strikeData, key } = data[0];
            const isCall = strikeData.type === 'call' ? true : false;
            if (selectedStrikes.has(strikeData.strike)) {
              deselectStrike(strikeData.strike);
            } else {
              selectStrike(strikeData.strike, {
                amount0: 0,
                amount1: '0',
                isCall: isCall,
                strike: strikeData.strike,
                tokenDecimals: isCall
                  ? tokenInfo.callTokenDecimals
                  : tokenInfo.putTokenDecimals,
                tokenSymbol: isCall
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
            }
          }}
        >
          {open && (
            <Listbox.Options
              static
              className="absolute  flex flex-col w-full max-h-[240px] rounded-md overflow-y-scroll mt-1 border border-umbra drop-shadow-md divide-y-[0.1px] divide-carbon  bg-carbon text-[13px] font-medium"
            >
              {strikesInContext.map((strikeData, index) => (
                <Listbox.Option
                  key={index}
                  className={cn(
                    'hover:cursor-pointer hover:bg-carbon z-10 py-[8px] flex items-start justify-start space-x-[10px] p-[4px] w-full',
                    Boolean(selectedStrikes.get(strikeData.strike))
                      ? 'bg-carbon'
                      : 'bg-mineshaft',
                  )}
                  value={{ key: index, strikeData }}
                >
                  <span className="flex-[0.5]"></span>
                  <div className="flex items-center justify-start space-x-[4px] flex-1">
                    <span className="text-stieglitz">$</span>
                    <span>{formatAmount(strikeData.strike, 5)}</span>
                    {rewardsStrikesLimit.lowerLimit <
                      Number(strikeData.strike) &&
                      rewardsStrikesLimit.upperLimit >
                        Number(strikeData.strike) && (
                        <img
                          src="/images/tokens/arb.svg"
                          alt="ARB"
                          className="w-[10px] h-[10px]"
                        />
                      )}
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default StrikeSelector;
