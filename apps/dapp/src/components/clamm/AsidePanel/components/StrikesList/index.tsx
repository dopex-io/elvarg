import React, { useMemo } from 'react';

import { Listbox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';

import useClammStore from 'hooks/clamm/useClammStore';
import { BasicStrikeInfo } from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { cn, formatAmount } from 'utils/general';

type Prop = {
  strikes: any[];
  isPut: boolean;
  selectedLength: number;
};

const StrikesList = ({ strikes, isPut, selectedLength }: Prop) => {
  const { selectStrike, selectedStrikes, deselectStrike } =
    useStrikesChainStore();
  const { markPrice } = useClammStore();

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
        onChange={(data: { strikeData: BasicStrikeInfo }[]) => {
          const { strikeData } = data[0];
          const { tickLower, tickUpper, strike } = strikeData;
          const key = tickLower
            .toString()
            .concat('#')
            .concat(tickUpper.toString());

          const isSelected = selectedStrikes.get(key);
          if (Boolean(isSelected)) {
            deselectStrike(key);
          } else {
            selectStrike(key, {
              strike,
              tickLower,
              tickUpper,
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
            {strikes.map((strikeData: BasicStrikeInfo, index: number) => (
              <Listbox.Option
                className={cn(
                  'hover:cursor-pointer hover:bg-carbon z-10 py-[8px]',
                  Boolean(
                    selectedStrikes.get(
                      strikeData.tickLower
                        .toString()
                        .concat('#')
                        .concat(strikeData.tickUpper.toString()),
                    ),
                  )
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
                      className={cn(
                        'text-sm',
                        Boolean(
                          selectedStrikes.get(
                            strikeData.tickLower
                              .toString()
                              .concat('#')
                              .concat(strikeData.tickUpper.toString()),
                          ),
                        )
                          ? 'text-stieglitz'
                          : 'text-white',
                      )}
                    >
                      {formatAmount(strikeData.strike, 5)}
                    </span>
                    {strikeData.strike > markPrice ? (
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
