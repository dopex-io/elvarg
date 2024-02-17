import React, { useCallback, useMemo } from 'react';
import { formatUnits, hexToBigInt } from 'viem';

import { Button } from '@dopex-io/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';
import { getTokenSymbol } from 'utils/token';

import { FilterSettingsType } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type StrikeItem2 = {
  strike: string;
  liquidity: {
    amount: number;
    symbol: string;
  };
  options: {
    total: number;
    available: number;
  };
  utilization: number;
  feesApr: number;
  eligbleForRewards: boolean;
  amms: Map<string, number>;
  manage: {
    handleSelect: () => void;
    isSelected: boolean;
  };
};

const helper = createColumnHelper<StrikeItem2>();
const columns2 = [
  helper.accessor('strike', {
    header: 'Strike',
    cell: ({ getValue }) => {
      return (
        <div className="text-[13px] flex items-center space-x-[4px]">
          <span className="text-stieglitz">$</span>
          <span>{formatAmount(getValue(), 4)}</span>
        </div>
      );
    },
  }),
  helper.accessor('liquidity', {
    header: 'Liquidity',
    cell: ({ getValue }) => {
      return (
        <div className="text-[13px] flex items-center space-x-[4px]">
          <span>{formatAmount(getValue().amount, 4)}</span>
          <span className="text-stieglitz">{getValue().symbol}</span>
        </div>
      );
    },
  }),
  helper.accessor('options', {
    header: 'Options',
    cell: ({ getValue }) => {
      return (
        <div className="text-[13px] flex items-center space-x-[4px]">
          <span>{formatAmount(getValue().available, 4)}</span>
          <span className="text-stieglitz">/</span>
          <span>{formatAmount(getValue().total, 4)}</span>
        </div>
      );
    },
  }),
  helper.accessor('utilization', {
    header: 'Utilization',
    cell: ({ getValue }) => {
      return (
        <div className="text-[13px] flex items-center space-x-[4px]">
          <span>{formatAmount(getValue(), 4)}</span>
          <span className="text-stieglitz">%</span>
        </div>
      );
    },
  }),
  helper.accessor('feesApr', {
    header: 'Fee APR',
    cell: ({ getValue }) => {
      return (
        <div className="text-[13px] flex items-center space-x-[4px]">
          <span>{formatAmount(getValue(), 4)}</span>
          <span className="text-stieglitz">%</span>
        </div>
      );
    },
  }),
  helper.accessor('eligbleForRewards', {
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
  helper.accessor('amms', {
    header: 'AMM',
    cell: (info) => {
      const { getValue } = info;
      const compositionMapping = new Map<string, number>();
      let total = 0;
      Array.from(getValue()).forEach(([key, liq]) => {
        const currentLiq = compositionMapping.get(key);
        total += liq;
        if (!currentLiq) {
          compositionMapping.set(key, liq);
        } else {
          compositionMapping.set(key, liq + currentLiq);
        }
      });

      return Array.from(compositionMapping).map(([key, totaLiq], index) => (
        <div key={key} className="flex items-center w-full text-[12px]">
          <div className="flex flex-col">
            <img
              src={`/images/exchanges/${key}.svg`}
              alt={key}
              className="w-[24px] h-[24px]"
            />
            <span className="flex space-x-[4px] text-white">
              <span>{formatAmount((100 * totaLiq) / total, 0)}</span>
              <span className="text-stieglitz">%</span>
            </span>
          </div>
        </div>
      ));
    },
  }),
  helper.accessor('manage', {
    header: 'Rewards',
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
  const { chain } = useNetwork();
  const { unsetDeposit, unsetPurchase } = useClammTransactionsStore();
  const { selectedOptionsMarket, isPut, markPrice, isTrade } = useClammStore();
  const { isLoading } = useLoadingStates();

  const isEligibleForRewards = useCallback(
    (price: number) => {
      const upperLimit = markPrice * 1.024;
      const lowerLimit = markPrice * 0.976;
      return price < upperLimit && price > lowerLimit;
    },
    [markPrice],
  );

  const strikes = useMemo(() => {
    if (!strikesChain || !selectedOptionsMarket) return [];
    const { callToken, putToken } = selectedOptionsMarket;

    const _strikes = Array.from(strikesChain)
      .map(([strike, strikesData]) => {
        const len = strikesData.length;
        const totalAPR = strikesData.reduce((prev, curr) => {
          return Number(curr.apr) + prev;
        }, 0);

        const amms = new Map<string, number>();
        strikesData.forEach(({ totalLiquidity, handler: { name } }) => {
          amms.set(name, Number(totalLiquidity));
        });

        const strikeNumber = Number(strike);
        const isPutStrike = markPrice > strikeNumber;

        const token = isPutStrike ? putToken : callToken;
        const totalLiquidity = strikesData.reduce((prev, curr) => {
          return Number(curr.totalLiquidity) + prev;
        }, 0);

        const totalAvailable = strikesData.reduce((prev, curr) => {
          return Number(curr.availableLiquidity) + prev;
        }, 0);
        const totalOptions = isPutStrike
          ? totalLiquidity / strikeNumber
          : totalLiquidity;
        const optionsAvailable = isPutStrike
          ? totalAvailable / strikeNumber
          : totalAvailable;

        const liquidityAvailable = strikesData.reduce(
          (prev, curr) => prev + Number(curr.availableLiquidity),
          0,
        );
        const totalLiquidityUsd = isPut
          ? totalLiquidity
          : totalLiquidity * markPrice;
        const liquidityAvailableUsd = isPut
          ? liquidityAvailable
          : liquidityAvailable * markPrice;
        return {
          liquidityAvailableUsd,
          totalLiquidityUsd,
          amms,
          strike: strike,
          liquidity: {
            amount: totalLiquidity,
            symbol: getTokenSymbol({
              address: token.address,
              chainId: chain?.id ?? DEFAULT_CHAIN_ID,
            }),
          },
          options: {
            total: totalOptions,
            available: optionsAvailable,
          },
          utilization: Math.max((1 - totalAvailable / totalLiquidity) * 100, 0),
          feesApr: totalAPR / len,
          eligbleForRewards: isEligibleForRewards(strikeNumber),
          manage: {
            selectedStrike: () => {},
          },
        };
      })
      .filter((data) => {
        if (!data) return false;
        const {
          liquidityAvailableUsd,
          options: { available },
        } = data;
        return filterSettings.liquidityThreshold[1] === 0
          ? filterSettings.liquidityThreshold[0] < liquidityAvailableUsd
          : filterSettings.liquidityThreshold[0] < available;
      })
      .filter(
        (_, index) =>
          filterSettings.range.length === 0 ||
          (filterSettings.range[0] <= index &&
            filterSettings.range[1] >= index),
      );

    const strikesFilteredFromAPR = _strikes.filter(
      ({ feesApr }) => feesApr < 1_000_000,
    );

    const strikesFilteredIsPut = strikesFilteredFromAPR.filter(({ strike }) => {
      const strikeNumber = Number(strike);
      if (isPut) {
        return strikeNumber < markPrice;
      } else {
        return strikeNumber > markPrice;
      }
    });

    return isPut ? strikesFilteredIsPut : strikesFilteredIsPut.reverse();

    // const isPutStrike = markPrice > Number(strike);
    // return (
    //   feesApr > 1_000_000 ||
    //   (isPut && !isPutStrike) ||
    //   (!isPut && isPutStrike)
    // );

    // const _strikes = strikesChain
    // .filter(({ liquidityAvailableUsd, optionsAvailable }) =>
    //   filterSettings.liquidityThreshold[1] === 0
    //     ? filterSettings.liquidityThreshold[0] < Number(liquidityAvailableUsd)
    //     : filterSettings.liquidityThreshold[0] < Number(optionsAvailable),
    // )
    // .filter(
    //   (_, index) =>
    //     filterSettings.range.length === 0 ||
    //     (filterSettings.range[0] <= index &&
    //       filterSettings.range[1] >= index),
    // )
    //   .map(
    //     (
    //       {
    //         earningsApy,
    //         liquidityAvailableUsd,
    //         liquidityInToken,
    //         meta,
    //         liquidityUsd,
    //         liquidityAvailableInToken,
    //         optionsAvailable,
    //         rewardsApy,
    //         sources,
    //         strike,
    //         tokenDecimals,
    //         tokenSymbol,
    //         utilization,
    //         totalOptions,
    //         type,
    //       },
    //       index,
    //     ) => {
    //       const isSelected = Boolean(selectedStrikes.get(index));

    //       const isRewardsEligible =
    //         rewardsStrikesLimit.lowerLimit < Number(strike) &&
    //         rewardsStrikesLimit.upperLimit > Number(strike);

    //       return {
    //         utilizationPercentage: Math.abs(
    //           ((Number(totalOptions) - Number(optionsAvailable)) /
    //             Number(totalOptions)) *
    //             100,
    //         ),
    //         type,
    //         isRewardsEligible,
    //         apr: earningsApy,
    //         strike: {
    //           amount: strike,
    //           isSelected,
    //         },
    //         sources,
    //         options: {
    //           available: Number(optionsAvailable) < 0 ? '0' : optionsAvailable,
    //           total: totalOptions,
    //           symbol: callToken.symbol,
    //           usd: liquidityAvailableUsd,
    //         },
    //         button: {
    //           isSelected,
    //           handleSelect: () => {
    //             if (isSelected) {
    //               deselectStrike(index);
    //               if (isTrade) {
    //                 unsetPurchase(index);
    //               } else {
    //                 unsetDeposit(index);
    //               }
    //             } else {
    //               selectStrike(index, {
    //                 amount0: 0,
    //                 amount1:
    //                   Number(optionsAvailable) < 0
    //                     ? '0'
    //                     : (Number(optionsAvailable) * 0.9998).toString(),
    //                 isCall: type === 'call' ? true : false,
    //                 strike: strike,
    //                 ttl: '24h',
    //                 tokenDecimals: Number(tokenDecimals),
    //                 tokenSymbol,
    //                 meta: {
    //                   tickLower: Number(meta.tickLower),
    //                   tickUpper: Number(meta.tickUpper),
    //                   amount0: 0n,
    //                   amount1: 0n,
    //                 },
    //               });
    //             }
    //           },
    //         },
    //         liquidity: {
    //           totalLiquidityUsd: liquidityUsd,
    //           symbol: tokenSymbol,
    //           usd: Number(liquidityAvailableUsd),
    //           amount: Number(
    //             formatUnits(BigInt(liquidityAvailableInToken), tokenDecimals),
    //           ),
    //         },
    //         disclosure: {
    //           earningsApy: Number(earningsApy),
    //           rewardsApy: Number(rewardsApy),
    //           utilization: Number(utilization),
    //           totalDeposits: {
    //             amount: Number(
    //               formatUnits(BigInt(liquidityInToken), tokenDecimals),
    //             ),
    //             symbol: tokenSymbol,
    //           },
    //         },
    //       };
    //     },
    //   );
    // .filter(({ type }) => (isPut ? type === 'put' : type === 'call'))
    // .filter(
    //   ({ liquidity: { totalLiquidityUsd } }) => Number(totalLiquidityUsd) > 1,
    // );

    // if (isPut) {
    //   return _strikes.sort((a, b) => b.strike.amount - a.strike.amount);
    // } else {
    //   return _strikes.sort((a, b) => a.strike.amount - b.strike.amount);
    // }
  }, [
    chain?.id,
    isEligibleForRewards,
    markPrice,
    filterSettings,
    isTrade,
    unsetDeposit,
    unsetPurchase,
    strikesChain,
    selectStrike,
    deselectStrike,
    selectedStrikes,
    isPut,
    selectedOptionsMarket,
  ]);

  return (
    <div className="max-h-[500px] overflow-y-auto border-t border-t-carbon">
      <TableLayout<StrikeItem2>
        // @ts-ignore
        data={strikes}
        columns={columns2}
        isContentLoading={isLoading('strikes-chain')}
        disablePagination={false}
        pageSize={500}
      />
    </div>
  );
};

export default StrikesTable;
