import React, { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import formatAmount from 'utils/general/formatAmount';

type StrikeDataForTable = {
  strike: number;
  totalLiquidity: {
    amount: string;
    symbol: string;
  };
  liquidityAvailable: {
    amount: number;
    symbol: string;
  };
  apy: number;
  breakeven: number;
  optionsAvailable: string;
  button: {
    onClick: () => void;
    premium: number;
    symbol: string;
    isSelected: boolean;
    disabled: boolean;
  };
  earnings24h: {
    amount: number;
    symbol: string;
    usd: number;
  };
};

const columnHelper = createColumnHelper<StrikeDataForTable>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="flex space-x-1 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="text-left flex">
        <p className="text-stieglitz pr-1">$</p>
        <p className="pr-1">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('totalLiquidity', {
    header: 'Total liquidity',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      return (
        <span className="text-left flex">
          <p className="pr-1">{formatAmount(amount, 6)} </p>
        </span>
      );
    },
  }),
  columnHelper.accessor('liquidityAvailable', {
    header: 'Liquidity Available',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      return (
        <span className="text-left flex">
          <p className="pr-1">{formatAmount(amount, 6)} </p>
        </span>
      );
    },
  }),
  columnHelper.accessor('optionsAvailable', {
    header: 'Options Available',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="pr-1">{formatAmount(info.getValue(), 6)}</p>
        </span>
      );
    },
  }),
  columnHelper.accessor('earnings24h', {
    header: 'Earnings (30 days)',
    cell: (info) => {
      const { amount, symbol, usd } = info.getValue();
      return (
        <span className="text-left flex">
          <p className="text-stieglitz pr-1">$</p>
          <p className="pr-1 text-white">{formatAmount(usd, 5)}</p>
        </span>
      );
    },
  }),
  columnHelper.accessor('apy', {
    header: 'APR',
    cell: (info) => {
      return (
        <span className="text-left flex flex-col justify-center">
          <span>{formatAmount(info.getValue(), 5)}%</span>
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: 'Premiums',
    cell: (info) => {
      const { onClick, premium, symbol, isSelected, disabled } =
        info.getValue();
      const approximationSymbol = premium < 1 ? '~' : null;
      return (
        <div className="flex space-x-2 justify-end">
          <Button
            disabled={disabled}
            color={isSelected ? 'primary' : 'mineshaft'}
            onClick={onClick}
            className="space-x-2 text-xs"
          >
            <span className="flex items-center space-x-1">
              <span>
                {approximationSymbol}
                {premium === 0 ? 0 : premium.toFixed(6)}
              </span>
              {isSelected ? (
                <MinusCircleIcon className="w-[14px]" />
              ) : (
                <PlusCircleIcon className="w-[14px]" />
              )}
            </span>
          </Button>
        </div>
      );
    },
  }),
];

const StrikesTable = () => {
  const {
    isPut,
    ticksData,
    optionsPool,
    loading,
    keys,
    selectedClammExpiry,
    setSelectedClammStrike,
    tokenPrices,
  } = useBoundStore();

  const [selectedStrikeIndex, setSelectedStrikeIndex] = useState<number | null>(
    null,
  );
  const setActiveStrikeIndex = useCallback((index: number) => {
    setSelectedStrikeIndex(index);
  }, []);

  const strikeData = useMemo(() => {
    if (!optionsPool) return [];
    const strikes = ticksData
      .map(
        (
          {
            liquidityAvailable,
            tickLowerPrice,
            tickUpperPrice,
            tickLower,
            tickUpper,
            callPremiums,
            putPremiums,
            totalLiquidity,
            earnings24h,
          },
          index,
        ) => {
          const _totalLiquidity = formatUnits(
            totalLiquidity[
              isPut ? keys.putAssetAmountKey : keys.callAssetAmountKey
            ],
            optionsPool[
              isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
            ],
          );

          const priceBI = BigInt((tickLowerPrice * 1e8).toFixed(0));
          const availableLiquidity =
            liquidityAvailable[
              isPut ? keys.putAssetAmountKey : keys.callAssetAmountKey
            ];

          const liquidityAvailableAtTick = formatUnits(
            isPut
              ? (availableLiquidity * BigInt(1e8)) / priceBI
              : availableLiquidity,
            optionsPool[
              isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
            ],
          );

          const _premium = Number(
            formatUnits(
              isPut
                ? putPremiums[selectedClammExpiry.toString()] ?? 0
                : callPremiums[selectedClammExpiry.toString()] ?? 0,
              optionsPool[
                isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
              ],
            ),
          );
          const breakeven = isPut
            ? tickLowerPrice - _premium
            : tickUpperPrice + _premium;

          const _earnings = Number(
            formatUnits(
              earnings24h[
                isPut ? keys.putAssetAmountKey : keys.callAssetAmountKey
              ],
              optionsPool[
                isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
              ],
            ),
          );

          const callTokenInfo = tokenPrices.find(
            ({ name }) =>
              name.toLowerCase() ===
              optionsPool[keys.callAssetSymbolKey].toLowerCase(),
          );

          const putTokenInfo = tokenPrices.find(
            ({ name }) =>
              name.toLowerCase() ===
              optionsPool[keys.putAssetSymbolKey].toLowerCase(),
          );

          let putTokenPrice = 1;
          let callTokenPrice = 1;
          if (callTokenInfo) callTokenPrice = callTokenInfo.price;
          if (putTokenInfo) putTokenPrice = putTokenInfo.price;

          const earningsUsd =
            _earnings * (isPut ? putTokenPrice : callTokenPrice);
          const liquidityUsd =
            Number(_totalLiquidity) * (isPut ? putTokenPrice : callTokenPrice);

          const apy = (earningsUsd / liquidityUsd) * 1200;

          return {
            apy,
            earnings24h: {
              amount: _earnings,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
              usd: earningsUsd,
            },
            strike: isPut ? tickLowerPrice : tickUpperPrice,
            totalLiquidity: {
              amount: _totalLiquidity,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            liquidityAvailable: {
              amount: Number(
                formatUnits(
                  availableLiquidity,
                  optionsPool[
                    isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
                  ],
                ),
              ),
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            breakeven,
            optionsAvailable: liquidityAvailableAtTick,
            button: {
              onClick: () => {
                setActiveStrikeIndex(index);
                setSelectedClammStrike({
                  tickLower: tickLower,
                  tickUpper: tickUpper,
                  tickLowerPrice,
                  tickUpperPrice,
                  optionsAvailable: liquidityAvailableAtTick,
                });
              },
              premium: _premium,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
              isSelected: index === selectedStrikeIndex,
              disabled: _premium === 0,
            },
          };
        },
      )
      .filter(({ totalLiquidity }) => Number(totalLiquidity.amount) > 0.001);

    return isPut ? strikes : strikes.reverse();
  }, [
    tokenPrices,
    selectedClammExpiry,
    setSelectedClammStrike,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    ticksData,
    optionsPool,
    isPut,
    selectedStrikeIndex,
    setActiveStrikeIndex,
  ]);

  return (
    <div className="space-y-2 p-4">
      <TableLayout<StrikeDataForTable>
        data={strikeData}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading.ticksData}
        pageSize={10}
      />
    </div>
  );
};

export default StrikesTable;
