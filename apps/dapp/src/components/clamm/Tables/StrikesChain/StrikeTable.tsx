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
  breakeven: number;
  optionsAvailable: number;
  button: {
    onClick: () => void;
    premium: number;
    symbol: string;
    isSelected: boolean;
    disabled: boolean;
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
  columnHelper.accessor('button', {
    header: () => null,
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
  } = useBoundStore();

  const [selectedStrikeIndex, setSelectedStrikeIndex] = useState<number | null>(
    null,
  );
  const setActiveStrikeIndex = useCallback((index: number) => {
    setSelectedStrikeIndex(index);
  }, []);

  const strikeData = useMemo(() => {
    if (!optionsPool) return [];
    return ticksData
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
          const liquidityAvailableAtTick = formatUnits(
            liquidityAvailable[
              isPut ? keys.putAssetAmountKey : keys.callAssetAmountKey
            ],
            optionsPool[
              isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
            ],
          );
          const optionsAvailable = isPut
            ? Number(liquidityAvailableAtTick) / tickLowerPrice
            : Number(liquidityAvailableAtTick);

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

          return {
            strike: isPut ? tickLowerPrice : tickUpperPrice,
            totalLiquidity: {
              amount: _totalLiquidity,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            liquidityAvailable: {
              amount: Number(liquidityAvailableAtTick),
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            breakeven,
            optionsAvailable,
            button: {
              onClick: () => {
                setActiveStrikeIndex(index);
                setSelectedClammStrike({
                  tickLower: tickLower,
                  tickUpper: tickUpper,
                  tickLowerPrice,
                  tickUpperPrice,
                  optionsAvailable,
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
  }, [
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
      />
    </div>
  );
};

export default StrikesTable;
