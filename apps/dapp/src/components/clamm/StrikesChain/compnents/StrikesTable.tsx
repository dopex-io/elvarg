import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import cx from 'classnames';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import formatValue from 'utils/clamm/formatValue';
import getStrikesChain from 'utils/clamm/varrock/getStrikesChain';
import { formatAmount } from 'utils/general';

type StrikeItem = {
  strike: {
    amount: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  apr: string;
  sources: {
    name: string;
    compositionPercentage: number;
  }[];
  options: {
    available: string;
    total: string;
    symbol: string;
    usd: string;
  };
  button: {
    isSelected: boolean;
    handleSelect: () => void;
  };
  liquidity: {
    symbol: string;
    usd: number;
    amount: number;
  };
};

const columnHelper = createColumnHelper<StrikeItem>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().amount.toFixed(4)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('liquidity', {
    header: 'Liquidity',
    cell: (info) => (
      <StatItem
        name={`${info.getValue().amount.toFixed(4)} ${info.getValue().symbol}`}
        value={`$ ${info.getValue().usd.toFixed(2)}`}
      />
    ),
  }),
  columnHelper.accessor('options', {
    header: 'Options Available',
    cell: ({ getValue }) => (
      <span className="flex flex-col items-left">
        <span className="flex items-center space-x-[4px] ">
          <span> {formatAmount(getValue().available, 5)}</span>
          <span className="text-stieglitz">/</span>
          <span>{formatAmount(getValue().total, 5)}</span>
          <span className="text-stieglitz text-xs">{getValue().symbol}</span>
        </span>
        <span className="text-xs text-stieglitz">
          $ {formatAmount(getValue().usd, 5)}
        </span>
      </span>
    ),
  }),
  columnHelper.accessor('apr', {
    header: 'Fees APR',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <span>{formatValue(info.getValue())}</span>
        <span className="text-stieglitz">%</span>
      </span>
    ),
  }),
  // columnHelper.accessor('apr', {
  //   header: 'Rewards APR',
  //   cell: (info) => (
  //     <span className="flex space-x-1 text-left items-center">
  //       <p>-</p>
  //     </span>
  //   ),
  // }),
  columnHelper.accessor('sources', {
    header: 'Sources',
    cell: (info) => {
      const sources = info.getValue();
      return (
        <span className="flex text-left items-center space-x-1">
          {sources.map(
            ({ name, compositionPercentage }: any, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <img
                  className={`w-[30px] h-[30px] z-10 border border-umbra rounded-full`}
                  src={`/images/exchanges/${name.toLowerCase()}.svg`}
                  alt={name.toLowerCase()}
                />
                <span className="text-xs text-stieglitz">
                  {compositionPercentage}%
                </span>
              </div>
            ),
          )}
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: ({ getValue }) => (
      <div className="flex space-x-2 justify-end">
        <Button
          onClick={getValue().handleSelect}
          color={getValue().isSelected ? 'primary' : 'mineshaft'}
          className={cx()}
        >
          <div className="flex items-center space-x-1">
            {getValue().isSelected ? (
              <MinusIcon className="w-[14px]" />
            ) : (
              <PlusIcon className="w-[14px]" />
            )}
          </div>
        </Button>
      </div>
    ),
  }),
];

export const StatItem = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col px-1">
    <span className="text-sm font-medium">{value}</span>
    <span className="text-stieglitz text-xs">{name}</span>
  </div>
);

const StrikesTable = () => {
  const {
    selectStrike,
    deselectStrike,
    selectedStrikes,
    initialize,
    strikesChain,
    setUpdateStrikes,
  } = useStrikesChainStore();

  const { selectedOptionsPool, isPut } = useClammStore();
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(false);

  const loadStrikes = useCallback(async () => {
    if (!selectedOptionsPool || !chain) return;
    setLoading(true);
    getStrikesChain(
      chain.id,
      selectedOptionsPool.callToken.address,
      selectedOptionsPool.putToken.address,
      50,
      0,
      initialize,
      (err) => {
        toast.error(err);
      },
    );
    setLoading(false);
  }, [chain, initialize, selectedOptionsPool]);

  useEffect(() => {
    setUpdateStrikes(loadStrikes);
    loadStrikes();
  }, [loadStrikes, setUpdateStrikes]);

  const strikes = useMemo(() => {
    if (!strikesChain || !selectedOptionsPool) return [];
    const { callToken } = selectedOptionsPool;
    return strikesChain
      .sort((a, b) => (isPut ? b.strike - a.strike : a.strike - b.strike))
      .map(
        (
          {
            earningsApy,
            liquidityAvailableUsd,
            liquidityInToken,
            meta,
            liquidityAvailableInToken,
            optionsAvailable,
            rewardsApy,
            sources,
            strike,
            tokenDecimals,
            tokenSymbol,
            utilization,
            totalOptions,
            type,
          },
          index,
        ) => {
          const isSelected = Boolean(selectedStrikes.get(index));

          return {
            type,
            apr: earningsApy,
            strike: {
              amount: strike,
              isSelected,
              handleSelect: () => {
                return isSelected
                  ? deselectStrike(index)
                  : selectStrike(index, {
                      amount0: 0,
                      amount1: optionsAvailable,
                      isCall: type === 'call' ? true : false,
                      strike: strike,
                      ttl: '24h',
                      tokenDecimals: Number(tokenDecimals),
                      tokenSymbol,
                      meta: {
                        tickLower: Number(meta.tickLower),
                        tickUpper: Number(meta.tickUpper),
                        amount0: 0n,
                        amount1: 0n,
                      },
                    });
              },
            },
            sources,
            options: {
              available: optionsAvailable,
              total: totalOptions,
              symbol: callToken.symbol,
              usd: liquidityAvailableUsd,
            },
            button: {
              isSelected,
              handleSelect: () => {
                return isSelected
                  ? deselectStrike(index)
                  : selectStrike(index, {
                      amount0: 0,
                      amount1: optionsAvailable,
                      isCall: type === 'call' ? true : false,
                      strike: strike,
                      ttl: '24h',
                      tokenDecimals: Number(tokenDecimals),
                      tokenSymbol,
                      meta: {
                        tickLower: Number(meta.tickLower),
                        tickUpper: Number(meta.tickUpper),
                        amount0: 0n,
                        amount1: 0n,
                      },
                    });
              },
            },
            liquidity: {
              symbol: tokenSymbol,
              usd: Number(liquidityAvailableUsd),
              amount: Number(
                formatUnits(BigInt(liquidityAvailableInToken), tokenDecimals),
              ),
            },
            disclosure: {
              earningsApy: Number(earningsApy),
              rewardsApy: Number(rewardsApy),
              utilization: Number(utilization),
              totalDeposits: {
                amount: Number(
                  formatUnits(BigInt(liquidityInToken), tokenDecimals),
                ),
                symbol: tokenSymbol,
              },
            },
          };
        },
      )
      .filter(({ type }) => (isPut ? type === 'put' : type === 'call'));
  }, [
    strikesChain,
    selectStrike,
    deselectStrike,
    selectedStrikes,
    isPut,
    selectedOptionsPool,
  ]);

  return (
    <TableLayout<StrikeItem>
      data={strikes}
      columns={columns}
      isContentLoading={loading}
    />
  );
};

export default StrikesTable;
