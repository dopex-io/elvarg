import React, { useEffect, useMemo, useState } from 'react';
import { hexToBigInt } from 'viem';

import { Listbox } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes from 'utils/clamm/generateStrikes';

const StrikesList = () => {
  const { selectStrike, strikesChain, selectedStrikes } =
    useStrikesChainStore();
  const { tick } = useClammStore();
  const { selectedOptionsPool, isTrade } = useClammStore();
  const [generatedStrikes, setGeneratedStrikes] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedOptionsPool) return;
    const { callToken, putToken } = selectedOptionsPool;

    const token0IsCallToken =
      hexToBigInt(callToken.address) < hexToBigInt(putToken.address);

    const token0Precision =
      10 ** (token0IsCallToken ? callToken.decimals : putToken.decimals);
    const token1Precision =
      10 ** (token0IsCallToken ? putToken.decimals : callToken.decimals);

    setGeneratedStrikes(
      generateStrikes(
        tick,
        token0Precision,
        token1Precision,
        !token0IsCallToken,
        25,
      ),
    );
  }, [tick, selectedOptionsPool]);

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

  const strikesInContext = useMemo(() => {
    return isTrade
      ? strikesChain
        ? strikesChain.sort((a, b) => b.strike - a.strike)
        : []
      : generatedStrikes;
  }, [strikesChain, isTrade, generatedStrikes]);

  return (
    <div className="w-full z-20">
      <Listbox
        disabled={strikesInContext.length === 0}
        // value={strikesInContext[Math.floor(strikesInContext.length - 1)]}
        onChange={({ key, strikeData }: { key: number; strikeData: any }) => {
          const isCall = strikeData.type === 'call' ? true : false;
          if (isTrade) {
            selectStrike(key, {
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
            selectStrike(key, {
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
        <div className="relative w-full px-[12px] pb-[12px] flex  justify-center">
          <Listbox.Button className="bg-mineshaft text-white w-full text-[14px] font-medium flex items-center justify-center space-x-[8px] rounded-md px-[4px] py-[6px]">
            {/* <span>{selectedStrikes.size} Selected</span> */}
            <span>
              {strikesInContext.length > 0
                ? `${selectedStrikes.size} Selected`
                : 'No strikes available'}
            </span>
            {strikesInContext.length > 0 && (
              <ChevronDownIcon className="w-[18px] h-[18px] pt-[3px]" />
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute flex flex-col w-full max-h-[240px] rounded-md overflow-y-scroll mt-1 border border-umbra drop-shadow-md divide-y-[0.1px] divide-carbon">
            {strikesInContext.map((strikeData: any, index: number) => (
              <Listbox.Option
                className="bg-mineshaft hover:cursor-pointer hover:bg-carbon z-10 py-[8px]"
                key={index}
                value={{ key: index, strikeData }}
              >
                <div className="flex items-center w-full justify-center">
                  <div className="flex items-center justfiy-center space-x-[4px]">
                    <span className="text-sm text-white">
                      {Number(strikeData.strike) < 0.001
                        ? Number(strikeData.strike).toFixed(8)
                        : strikeData.strike.toFixed(4)}
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
                    {/* <ArrowRightUp */}
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
