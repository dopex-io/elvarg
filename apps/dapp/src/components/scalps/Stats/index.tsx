import React, { ReactNode, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { BigNumber, utils } from 'ethers';

import { useBoundStore } from 'store';

import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Stat = ({ name, value }: { name: ReactNode; value: ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-white text-[0.5rem] sm:text-[0.8rem]">{value}</span>
    <span className="text-stieglitz text-[0.5rem] sm:text-[0.8rem]">
      {name}
    </span>
  </div>
);

const Stats = () => {
  const { optionScalpData, selectedPoolName, uniWethPrice, uniArbPrice } =
    useBoundStore();

  const [twentyFourHourVolume, setTwentyFourHourVolume] = useState({
    ETH: '0',
    ARB: '0',
  });

  useEffect(() => {
    async function getVolume() {
      const payload = await queryClient.fetchQuery({
        queryKey: ['getTradesFromTimestamp'],
        queryFn: () =>
          graphSdk.getTradesFromTimestamp({
            fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
          }),
      });

      const _twentyFourHourVolume = payload.trades.reduce(
        (acc, trade, _index) => {
          const address = trade.id.split('#')[0]!;
          if (address === '0xdaf4ffb05bfcb2c328c19135e3e74e1182c88283')
            return {
              ARB: acc.ARB.add(BigNumber.from(trade.size)),
              ETH: acc.ETH,
            };
          else {
            return {
              ARB: acc.ARB,
              ETH: acc.ETH.add(BigNumber.from(trade.size)),
            };
          }
        },
        { ETH: BigNumber.from(0), ARB: BigNumber.from(0) }
      );

      setTwentyFourHourVolume({
        ETH: utils.formatUnits(_twentyFourHourVolume.ETH, 6),
        ARB: utils.formatUnits(_twentyFourHourVolume.ARB, 6),
      });
    }

    getVolume();
  }, []);

  const markPrice = useMemo(() => {
    if (
      selectedPoolName.toUpperCase() === 'ETH' ||
      selectedPoolName.toUpperCase() === 'ARB'
    )
      return formatAmount(
        getUserReadableAmount(
          selectedPoolName === 'ETH' ? uniWethPrice : uniArbPrice,
          optionScalpData?.quoteDecimals!.toNumber()
        ),
        4
      );

    return '';
  }, [selectedPoolName, optionScalpData, uniWethPrice, uniArbPrice]);

  const stats = useMemo(() => {
    let _stats = {
      openInterest: '0',
      totalLongs: '0',
      totalShorts: '0',
      totalDeposits: '0',
    };
    if (!optionScalpData) return _stats;

    const { longOpenInterest, shortOpenInterest, quoteDecimals, markPrice } =
      optionScalpData;

    const _totalLongs = longOpenInterest.mul(1e6).div(markPrice);
    const _totalShorts = shortOpenInterest.mul(1e6).div(markPrice);

    _stats.openInterest = formatAmount(
      getUserReadableAmount(
        _totalLongs.add(_totalShorts),
        quoteDecimals.toNumber()
      ),
      10
    );

    _stats.totalLongs = formatAmount(
      getUserReadableAmount(_totalLongs, quoteDecimals.toNumber()),
      5
    );
    _stats.totalShorts = formatAmount(
      getUserReadableAmount(_totalShorts, quoteDecimals.toNumber()),
      5
    );

    return _stats;
  }, [optionScalpData]);

  return (
    <div className="flex mt-[2rem] md:mt-0 justify-center items-center">
      <div className="flex flex-row space-x-3 md:space-x-5 md:ml-4">
        <Stat name="Mark Price" value={markPrice} />
        <Stat
          name="Open Interest"
          value={`${stats.openInterest} ${selectedPoolName}`}
        />
        <Stat
          name="Total Long"
          value={`${stats.totalLongs} ${selectedPoolName}`}
        />
        <Stat
          name="Total Short"
          value={`${stats.totalShorts} ${selectedPoolName}`}
        />
        <Stat
          name="Total Deposits"
          value={`${formatAmount(
            getUserReadableAmount(
              optionScalpData?.totalBaseDeposits!,
              optionScalpData?.baseDecimals!.toNumber()
            ),
            0,
            true
          )}
          ${optionScalpData?.baseSymbol} / 
          ${formatAmount(
            getUserReadableAmount(
              optionScalpData?.totalQuoteDeposits!,
              optionScalpData?.quoteDecimals!.toNumber()
            ),
            0,
            true
          )} 
          ${optionScalpData?.quoteSymbol}`}
        />
        <Stat
          name="24h Volume"
          value={`${formatAmount(
            optionScalpData?.baseSymbol === 'ETH'
              ? twentyFourHourVolume.ETH
              : twentyFourHourVolume.ARB,
            0,
            true
          )} ${optionScalpData?.quoteSymbol}`}
        />
        <Stat
          name={`${optionScalpData?.quoteSymbol} LP APR`}
          value={`${formatAmount(
            getUserReadableAmount(optionScalpData?.quoteLpAPR!, 0),
            0,
            true
          )}%`}
        />
        <Stat
          name={`${optionScalpData?.baseSymbol} LP APR`}
          value={`${formatAmount(
            getUserReadableAmount(optionScalpData?.baseLpAPR!, 0),
            0,
            true
          )}%`}
        />
      </div>
    </div>
  );
};

export default Stats;
