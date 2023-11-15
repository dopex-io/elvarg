import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import cx from 'classnames';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import getStrikesChain from 'utils/clamm/varrock/getStrikesChain';
import { formatAmount } from 'utils/general';

type StrikeItem = {
  strike: {
    amount: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  isRewardsEligible: boolean;
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
  utilizationPercentage: number;
  liquidity: {
    totalLiquidityUsd: string;
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
        <span className="flex items-center space-x-[4px]">
          <span> {formatAmount(getValue().available, 3)}</span>

          {Number(getValue().total) > 0.00001 && (
            <span className="text-stieglitz">/</span>
          )}
          {Number(getValue().total) > 0.00001 && (
            <span>{formatAmount(getValue().total, 3)}</span>
          )}
          <span className="text-stieglitz text-xs">{getValue().symbol}</span>
        </span>
        <span className="text-xs text-stieglitz">
          $ {formatAmount(getValue().usd, 3)}
        </span>
      </span>
    ),
  }),
  columnHelper.accessor('utilizationPercentage', {
    header: 'Utilization',
    cell: (info) => {
      const sources = info.getValue();
      return (
        <span className="flex space-x-1 text-left items-center">
          <span>{formatAmount(info.getValue(), 3)}</span>
          <span className="text-stieglitz">%</span>
        </span>
      );
    },
  }),
  columnHelper.accessor('apr', {
    header: 'Fees APR',
    cell: (info) => (
      <span className="flex space-x-1 text-left items-center">
        <span>{formatAmount(info.getValue(), 3)}</span>
        <span className="text-stieglitz">%</span>
      </span>
    ),
  }),
  columnHelper.accessor('isRewardsEligible', {
    // @ts-ignore
    header: <span className="text-wave-blue animate-pulse">Rewards</span>,
    cell: (info) => (
      <span className="flex items-center w-full pl-[12px]">
        {info.getValue() && (
          <img
            src="/images/tokens/arb.svg"
            alt="ARB"
            className="w-[20px] h-[20px]"
          />
        )}
      </span>
    ),
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

  const { selectedOptionsPool, isPut, markPrice } = useClammStore();
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(false);

  const loadStrikes = useCallback(async () => {
    if (!selectedOptionsPool) return;

    const data = await getStrikesChain(
      chain?.id ?? 42161,
      selectedOptionsPool.optionsPoolAddress,
      50,
      0,
    );

    initialize(data ?? []);
  }, [initialize, chain, , selectedOptionsPool]);

  useEffect(() => {
    setLoading(true);
    setUpdateStrikes(loadStrikes);
    loadStrikes().finally(() => {
      setLoading(false);
    });
  }, [loadStrikes, setUpdateStrikes]);

  const rewardsStrikesLimit = useMemo(() => {
    return {
      upperLimit: markPrice * 1.024,
      lowerLimit: markPrice * 0.976,
    };
  }, [markPrice]);

  const strikes = useMemo(() => {
    if (!strikesChain || !selectedOptionsPool) return [];
    const { callToken } = selectedOptionsPool;
    const _strikes = strikesChain
      .map(
        (
          {
            earningsApy,
            liquidityAvailableUsd,
            liquidityInToken,
            meta,
            liquidityUsd,
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

          const isRewardsEligible =
            rewardsStrikesLimit.lowerLimit < Number(strike) &&
            rewardsStrikesLimit.upperLimit > Number(strike);

          return {
            utilizationPercentage: Math.abs(
              ((Number(totalOptions) - Number(optionsAvailable)) /
                Number(totalOptions)) *
                100,
            ),
            type,
            isRewardsEligible,
            apr: earningsApy,
            strike: {
              amount: strike,
              isSelected,
              handleSelect: () => {
                return isSelected
                  ? deselectStrike(index)
                  : selectStrike(index, {
                      amount0: 0,
                      amount1:
                        Number(optionsAvailable) < 0 ? '0' : optionsAvailable,
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
              available: Number(optionsAvailable) < 0 ? '0' : optionsAvailable,
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
                      amount1:
                        Number(optionsAvailable) < 0 ? '0' : optionsAvailable,
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
              totalLiquidityUsd: liquidityUsd,
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
      .filter(({ type }) => (isPut ? type === 'put' : type === 'call'))
      .filter(
        ({ liquidity: { totalLiquidityUsd } }) => Number(totalLiquidityUsd) > 1,
      );

    if (isPut) {
      return _strikes.sort((a, b) => b.strike.amount - a.strike.amount);
    } else {
      return _strikes.sort((a, b) => a.strike.amount - b.strike.amount);
    }
  }, [
    rewardsStrikesLimit,
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
