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

type StrikeItem = {
  strike: string;
  liquidity: {
    amount: number;
    symbol: string;
    usd: number;
  };
  options: {
    usd: number;
    total: number;
    available: number;
  };
  utilization: number;
  feesApr: number;
  eligbleForRewards: boolean;
  amms: Map<string, number>;
  manage: {
    selectStrike: () => void;
    deselectStrike: () => void;
    isSelected: boolean;
  };
};

const helper = createColumnHelper<StrikeItem>();

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

  const columns = useMemo(
    () => [
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
            <div className="flex flex-col">
              <div className="text-[13px] flex items-center space-x-[4px]">
                <span className="text-stieglitz">$</span>
                <span>{formatAmount(getValue().usd, 4)}</span>
              </div>
              <div className="text-[11px] flex items-center space-x-[4px] text-stieglitz">
                <span>{formatAmount(getValue().amount, 4)}</span>
                <span>{getValue().symbol}</span>
              </div>
            </div>
          );
        },
      }),
      helper.accessor('options', {
        header: 'Options Available',
        cell: ({ getValue }) => {
          return (
            <div className="flex flex-col">
              <div className="text-[13px] flex items-center space-x-[4px]">
                <span>{formatAmount(getValue().available, 4)}</span>
                <span className="text-stieglitz">/</span>
                <span>{formatAmount(getValue().total, 4)}</span>
              </div>
              <div className="text-stieglitz text-[11px] flex items-center space-x-[4px]">
                <span>$</span>
                <span>{formatAmount(getValue().usd, 4)}</span>
              </div>
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
          Array.from(compositionMapping).map(([key, totaLiq], index) => (
            <div key={key} className="flex items-center w-[50px] text-[12px]">
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

          return (
            <div className="flex items-center justify-start">
              {Array.from(compositionMapping).map(([key, totaLiq], index) => (
                <div
                  key={key}
                  className="flex items-center w-[50px] text-[12px]"
                >
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
              ))}
            </div>
          );
        },
      }),
      helper.accessor('manage', {
        header: '',
        cell: ({ getValue }) => (
          <div className="flex space-x-2 justify-end">
            <Button
              onClick={
                getValue().isSelected
                  ? getValue().deselectStrike
                  : getValue().selectStrike
              }
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
    ],
    [],
  );

  const isEligibleForRewards = useCallback(
    (price: number) => {
      if (!chain) return false;
      if (
        chain.id === 42161 &&
        new Date().getTime() < 1711929604000 /* 1st april */
      ) {
        const upperLimit = markPrice * 1.024;
        const lowerLimit = markPrice * 0.976;
        return price < upperLimit && price > lowerLimit;
      } else {
        return false;
      }
    },
    [markPrice, chain],
  );

  const strikes = useMemo(() => {
    if (!strikesChain || !selectedOptionsMarket) return [];
    const { callToken, putToken } = selectedOptionsMarket;

    const _strikes = Array.from(strikesChain)
      .map(([strike, strikesData]) => {
        const tickLower = strikesData[0].meta.tickLower;
        const tickUpper = strikesData[0].meta.tickUpper;

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

        const strikeKey = tickLower
          .toString()
          .concat('#')
          .concat(tickUpper.toString());
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
            usd: totalLiquidityUsd,
          },
          options: {
            total: totalOptions,
            available: optionsAvailable,
            usd: liquidityAvailableUsd,
          },
          utilization: Math.max((1 - totalAvailable / totalLiquidity) * 100, 0),
          feesApr: totalAPR / len,
          eligbleForRewards: isEligibleForRewards(strikeNumber),
          manage: {
            selectStrike: () => {
              selectStrike(strikeKey, {
                strike: strikeNumber,
                tickLower,
                tickUpper,
              });
            },
            deselectStrike: () => {
              deselectStrike(strikeKey);

              if (isTrade) {
                unsetPurchase(strikeKey);
              } else {
                unsetDeposit(strikeKey);
              }
            },
            isSelected: Boolean(selectedStrikes.get(strikeKey)),
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

    const strikesFilteredIsPut = _strikes.filter(({ strike }) => {
      const strikeNumber = Number(strike);
      if (isPut) {
        return strikeNumber < markPrice;
      } else {
        return strikeNumber > markPrice;
      }
    });

    return isPut
      ? strikesFilteredIsPut.sort((a, b) => Number(b.strike) - Number(a.strike))
      : strikesFilteredIsPut.sort(
          (a, b) => Number(a.strike) - Number(b.strike),
        );
  }, [
    chain?.id,
    isEligibleForRewards,
    markPrice,
    filterSettings,
    unsetDeposit,
    unsetPurchase,
    strikesChain,
    isTrade,
    selectStrike,
    deselectStrike,
    selectedStrikes,
    isPut,
    selectedOptionsMarket,
  ]);

  const filteredColumns = useMemo(() => {
    if (!chain) return columns;
    if (chain.id === 5000) {
      return columns.filter((c) => c.header !== 'Rewards');
    }
    return columns;
  }, [chain, columns]);

  return (
    <div className="max-h-[500px] overflow-y-auto border-t border-t-carbon">
      <TableLayout<StrikeItem>
        data={strikes}
        columns={filteredColumns}
        isContentLoading={isLoading('strikes-chain')}
        disablePagination={false}
        pageSize={500}
      />
    </div>
  );
};

export default StrikesTable;
