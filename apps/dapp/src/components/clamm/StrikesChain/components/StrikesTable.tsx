import React, { useMemo } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

import { FilterSettingsType } from 'constants/clamm';

type StrikeItem = {
  strike: {
    amount: number;
    isSelected: boolean;
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
        <p className="inline-block">
          {formatAmount(info.getValue().amount, 4)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('liquidity', {
    header: 'Liquidity',
    cell: (info) => (
      <StatItem
        name={`${formatAmount(info.getValue().amount, 5)} ${
          info.getValue().symbol
        }`}
        value={`$ ${formatAmount(info.getValue().usd, 2)}`}
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
    header: 'Rewards',
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

type Props = {
  filterSettings: FilterSettingsType;
};
const StrikesTable = ({ filterSettings }: Props) => {
  const { selectStrike, deselectStrike, selectedStrikes, strikesChain } =
    useStrikesChainStore();
  const { unsetDeposit, unsetPurchase } = useClammTransactionsStore();
  const { selectedOptionsPool, isPut, markPrice, isTrade } = useClammStore();
  const { isLoading } = useLoadingStates();

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
      .filter(({ liquidityAvailableUsd, optionsAvailable }) => {
        if (filterSettings.liquidityThreshold[1] === 0) {
          return (
            filterSettings.liquidityThreshold[0] < Number(liquidityAvailableUsd)
          );
        } else {
          return (
            filterSettings.liquidityThreshold[0] < Number(optionsAvailable)
          );
        }
      })
      .filter((_, index) => {
        if (filterSettings.range.length === 0) return true;
        return (
          filterSettings.range[0] <= index && filterSettings.range[1] >= index
        );
      })
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
                if (isSelected) {
                  deselectStrike(index);
                  if (isTrade) {
                    unsetPurchase(index);
                  } else {
                    unsetDeposit(index);
                  }
                } else {
                  selectStrike(index, {
                    amount0: 0,
                    amount1:
                      Number(optionsAvailable) < 0
                        ? '0'
                        : (Number(optionsAvailable) * 0.9998).toString(),
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
                }
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
    filterSettings,
    isTrade,
    unsetDeposit,
    unsetPurchase,
    rewardsStrikesLimit,
    strikesChain,
    selectStrike,
    deselectStrike,
    selectedStrikes,
    isPut,
    selectedOptionsPool,
  ]);

  return (
    <div className="max-h-[500px] overflow-y-auto border-t border-t-carbon">
      <TableLayout<StrikeItem>
        data={strikes}
        columns={columns}
        isContentLoading={isLoading('strikes-chain')}
        disablePagination={false}
        pageSize={500}
      />
    </div>
  );
};

export default StrikesTable;
