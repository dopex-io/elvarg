import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getTradesFromTimestampDocument } from 'graphql/optionScalps';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';

import { DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL } from 'constants/subgraphs';

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
          request(
            DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL,
            getTradesFromTimestampDocument,
            {
              fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
            }
          ),
      });

      const _twentyFourHourVolume = payload.trades.reduce(
        (
          acc: { ETH: BigNumber; ARB: BigNumber },
          trade: { id: string; size: string }
        ) => {
          const address = trade.id.split('#')[0]!;
          if (address === '0xea042b76cb5ac66372867ead8fdafde251026b4e')
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

    try {
      getVolume();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const markPrice = useMemo(() => {
    if (
      selectedPoolName.toUpperCase() === 'ETH' ||
      selectedPoolName.toUpperCase() === 'ARB'
    ) {
      if (uniWethPrice.eq(0) || uniArbPrice.eq(0))
        return formatAmount(
          Number(
            utils.formatUnits(
              optionScalpData?.markPrice || BigNumber.from('0'),
              optionScalpData?.quoteDecimals.toNumber()
            )
          ),
          4
        );

      return formatAmount(
        Number(
          utils.formatUnits(
            selectedPoolName === 'ETH' ? uniWethPrice : uniArbPrice,
            optionScalpData?.quoteDecimals!.toNumber()
          )
        ),
        4
      );
    }

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
      Number(
        utils.formatUnits(
          _totalLongs.add(_totalShorts),
          quoteDecimals.toNumber()
        )
      ),
      10
    );

    _stats.totalLongs = formatAmount(
      Number(utils.formatUnits(_totalLongs, quoteDecimals.toNumber())),
      5
    );
    _stats.totalShorts = formatAmount(
      Number(utils.formatUnits(_totalShorts, quoteDecimals.toNumber())),
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
          value={`${
            optionScalpData?.totalQuoteDeposits
              ? formatAmount(
                  Number(
                    utils.formatUnits(
                      optionScalpData?.totalBaseDeposits!,
                      optionScalpData?.baseDecimals!.toNumber()
                    )
                  ),
                  0,
                  true
                )
              : null
          }
          ${optionScalpData?.baseSymbol} / 
          ${
            optionScalpData?.totalQuoteDeposits
              ? formatAmount(
                  Number(
                    utils.formatUnits(
                      optionScalpData?.totalQuoteDeposits!,
                      optionScalpData?.quoteDecimals!.toNumber()
                    )
                  ),
                  0,
                  true
                )
              : null
          } 
          ${optionScalpData?.quoteSymbol}`}
        />
        <Stat
          name={`${optionScalpData?.quoteSymbol} LP APR`}
          value={`${
            optionScalpData?.quoteLpAPR
              ? formatAmount(
                  Number(utils.formatUnits(optionScalpData?.quoteLpAPR!, 0)),
                  0,
                  true
                )
              : null
          }%`}
        />
        <Stat
          name={`${optionScalpData?.baseSymbol} LP APR`}
          value={`${
            optionScalpData?.baseLpAPR
              ? formatAmount(
                  Number(utils.formatUnits(optionScalpData?.baseLpAPR!, 0)),
                  0,
                  true
                )
              : null
          }%`}
        />
        <Stat name={`FUNDING LP APR`} value={`18.5%`} />
      </div>
    </div>
  );
};

export default Stats;
