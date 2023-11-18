import React, { useMemo } from 'react';

import { Listbox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { formatAmount } from 'utils/general';

type Prop = {
  strikes: any[];
  isPut: boolean;
  selectedLength: number;
};

const StrikesList = ({ strikes, isPut, selectedLength }: Prop) => {
  const { selectStrike, selectedStrikes } = useStrikesChainStore();
  const { selectedOptionsPool, isTrade, markPrice } = useClammStore();

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

  const rewardsStrikesLimit = useMemo(() => {
    return {
      upperLimit: markPrice * 1.024,
      lowerLimit: markPrice * 0.976,
    };
  }, [markPrice]);

  return (
    <div className="w-full z-20">
      <Listbox
        multiple
        value={[]}
        disabled={strikes.length === 0}
        // value={strikesInContext[Math.floor(strikesInContext.length - 1)]}
        onChange={(data: { key: number; strikeData: any }[]) => {
          const { strikeData, key } = data[0];
          const isCall = strikeData.type === 'call' ? true : false;
          // const key =
          if (isTrade) {
            selectStrike(strikeData.strike, {
              amount0: 0,
              amount1: strikeData.optionsAvailable,
              isCall: isCall,
              strike: strikeData.strike,
              tokenDecimals: strikeData.tokenDecimals,
              tokenSymbol: strikeData.tokenSymbol,
              ttl: '24h',
              meta: {
                tickLower: Number(strikeData.meta.tickLower),
                tickUpper: Number(strikeData.meta.tickUpper),
                amount0: 0n,
                amount1: 0n,
              },
            });
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
                tickLower: Number(strikeData.tickLower),
                tickUpper: Number(strikeData.tickUpper),
                amount0: 0n,
                amount1: 0n,
              },
            });
          }
        }}
      >
        <div className="relative w-full px-[12px] flex  justify-center">
          <Listbox.Button className="bg-mineshaft text-white w-full text-[14px] font-medium flex items-center justify-center space-x-[8px] rounded-md px-[4px] py-[6px]">
            <span>{`${selectedLength} ${isPut ? 'Put' : 'Call'} strikes`}</span>
            {strikes.length > 0 && (
              <ChevronDownIcon className="w-[18px] h-[18px] pt-[3px]" />
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute flex flex-col w-full max-h-[240px] rounded-md overflow-y-scroll mt-1 border border-umbra drop-shadow-md divide-y-[0.1px] divide-carbon">
            {strikes.map((strikeData: any, index: number) => (
              <Listbox.Option
                className={cx(
                  'hover:cursor-pointer hover:bg-carbon z-10 py-[8px]',
                  Boolean(selectedStrikes.get(strikeData.strike))
                    ? 'bg-carbon'
                    : 'bg-mineshaft',
                )}
                key={index}
                value={{ key: index, strikeData }}
              >
                <div className="flex items-center w-full justify-center">
                  <div className="flex items-center justfiy-center space-x-[4px]">
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
                    <span
                      className={cx(
                        'text-sm',
                        Boolean(selectedStrikes.get(strikeData.strike))
                          ? 'text-stieglitz'
                          : 'text-white',
                      )}
                    >
                      {formatAmount(strikeData.strike, 5)}
                    </span>
                    {strikeData.type === 'call' ? (
                      <ArrowUpRightIcon
                        className={'h-[12px] w-[12px] text-up-only'}
                      />
                    ) : (
                      <ArrowDownRightIcon
                        className={'h-[12px] w-[12px] text-down-bad'}
                      />
                    )}
                  </div>
                </div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default StrikesList;
