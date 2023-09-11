import React, { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button, Skeleton } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import formatAmount from 'utils/general/formatAmount';

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="space-x-1 text-left">
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
  columnHelper.accessor('liquidityAvailable', {
    header: 'Liquidity',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="text-stieglitz pr-1">$</p>
          <p className="pr-1">
            {formatAmount(info.getValue().amount, 5, true)}
          </p>
        </span>
      );
    },
  }),
  columnHelper.accessor('optionsAvailable', {
    header: 'Available',
    cell: (info) => {
      return (
        <span className="text-left flex">
          <p className="pr-1">{formatAmount(info.getValue(), 5, true)}</p>
        </span>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: () => null,
    cell: (info) => {
      const { onClick, premium, symbol, isSelected } = info.getValue();

      const approximationSymbol = premium < 1 ? '~' : null;

      return (
        <div className="flex space-x-2 justify-end">
          <Button
            color={isSelected ? 'primary' : 'mineshaft'}
            onClick={onClick}
            className="space-x-2 text-xs"
          >
            <span className="flex items-center space-x-1">
              <span>
                {approximationSymbol}
                {formatAmount(premium, 5)} {symbol}
              </span>
              {/* {isActive ? (
                <MinusCircleIcon className="w-[14px]" />
              ) : (
                <PlusCircleIcon className="w-[14px]" />
              )} */}
            </span>
          </Button>
        </div>
      );
    },
  }),
];

const Table = ({ strikeData }: any) => {
  return (
    <div>
      <TableLayout<any>
        data={strikeData}
        columns={columns}
        rowSpacing={3}
        isContentLoading={false}
      />
    </div>
  );
};

const StrikesTable = () => {
  const {
    isPut,
    ticksData,
    optionsPool,
    loading,
    keys,
    setSelectedClammStrike,
  } = useBoundStore();

  const [selectedStrikeIndex, setSelectedStrkikeIndex] = useState(0);
  const setActiveStrikeIndex = useCallback(
    (index: number) => setSelectedStrkikeIndex(index),
    [],
  );

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
          },
          index,
        ) => {
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

          const premium = 0;
          const breakeven = isPut
            ? tickLowerPrice - premium
            : tickUpperPrice + premium;

          return {
            strike: isPut ? tickLowerPrice : tickUpperPrice,
            liquidityAvailable: {
              amount: Number(liquidityAvailableAtTick),
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
            },
            premium,
            breakeven,
            optionsAvailable,
            button: {
              onClick: () => {
                setActiveStrikeIndex(index);
                setSelectedClammStrike({
                  tickLower: tickLower,
                  tickUpper: tickUpper,
                });
              },
              premium: premium,
              symbol:
                optionsPool[
                  isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
                ],
              isSelected: index === selectedStrikeIndex,
            },
          };
        },
      )
      .filter(({ liquidityAvailable }) => liquidityAvailable.amount !== 0);
  }, [
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

  if (loading.ticksData)
    return (
      <div className="grid grid-cols-1 gap-4 p-2">
        {Array.from(Array(4)).map((_, index) => {
          return (
            <Skeleton
              key={index}
              width="fitContent"
              height={70}
              color="carbon"
              variant="rounded"
            />
          );
        })}
      </div>
    );

  return <Table strikeData={strikeData} />;
};

export default StrikesTable;
