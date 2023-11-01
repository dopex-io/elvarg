import React, { useCallback, useMemo, useRef, useState } from 'react';
import { formatUnits } from 'viem';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { StatItem } from 'pages/v2/clamm/components/StrikesChain/compnents/StrikesTable';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';
import getPercentageDifference from 'utils/math/getPercentageDifference';

type BuyPositionItem = BuyPosition & {
  select: {
    handleSelect: Function;
    disabled: boolean;
  };
};

export type BuyPosition = {
  strike: number;
  size: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  side: string;
  premium: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  expiry: number;
  profit: {
    percentage: number;
    amount: number;
    symbol: string;
    usdValue: number;
  };
};

const columnHelper = createColumnHelper<BuyPositionItem>();
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <div className="flex space-x-2 text-left items-center">
        <Checkbox className="text-mineshaft" size="small" />
        <span className="text-stieglitz inline-block">$</span>
        <span className="inline-block">{formatAmount(info.getValue(), 5)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <div className="flex flex-col items-start justfiy-start">
        <div className="flex items-center justify-start space-x-[3px]">
          <span className="text-white">
            {formatAmount(info.getValue().amount, 5)}
          </span>
          <span className="text-stieglitz">{info.getValue().symbol}</span>
        </div>
        <span className="text-stieglitz text-sm">
          $ {formatAmount(info.getValue().usdValue, 5)}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <span className=" overflow-hidden whitespace-nowrap">
        {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
        {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
      </span>
    ),
  }),
  columnHelper.accessor('premium', {
    header: 'premium',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      return (
        <div className="flex flex-col items-start justfiy-start">
          <div className="flex items-center justify-start space-x-[3px]">
            <span className="text-white">
              {formatAmount(info.getValue().amount, 5)}
            </span>
            <span className="text-stieglitz">{info.getValue().symbol}</span>
          </div>
          <span className="text-stieglitz text-sm">
            $ {formatAmount(info.getValue().usdValue, 5)}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('profit', {
    header: 'Profit',
    cell: (info) => {
      let { amount, usdValue, symbol, percentage } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <div className="flex flex-col">
          <span className={amountInNumber > 0 ? 'text-up-only' : 'stieglitz'}>
            {amountInNumber > 0 && '+'}
            {formatAmount(amountInNumber, 5)} {symbol}{' '}
            {`(${formatAmount(percentage, 2)}%)`}
          </span>
          <span className="text-stieglitz">$ {formatAmount(usdValue, 5)}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('select', {
    header: '',
    cell: (info) => {
      return <Button>Exericse</Button>;
    },
  }),
];

const BuyPositions = ({
  positions,
  selectPosition,
  selectedPositions,
  unselectPosition,
}: any) => {
  const buyPositions = useMemo(() => {
    return positions.map(
      ({ expiry, premium, profit, side, size, strike }: any) => {
        const readablePremium = formatUnits(
          premium.amountInToken,
          premium.decimals,
        );

        return {
          expiry,
          premium: {
            amount: readablePremium,
            symbol: premium.symbol,
            usdValue: premium.usdValue,
          },
          profit: {
            amount: profit.amount,
            usdVlaue: profit.usdValue,
            symbol: profit.symbol,
            percentage: Math.max(
              getPercentageDifference(
                Number(profit.amount),
                Number(readablePremium),
              ),
              0,
            ),
          },
          side: side.charAt(0).toUpperCase() + side.slice(1),
          size: {
            amount: formatUnits(size.amountInToken, size.decimals),
            symbol: size.symbol,
            usdValue: 0,
          },
          strike: Number(strike),
          select: {
            handleSelect: () => {},
            disabled: false,
          },
        };
      },
    );
  }, [positions]);

  const handleExercise = useCallback(async () => {}, []);

  return (
    <TableLayout<BuyPositionItem>
      data={buyPositions}
      columns={columns}
      rowSpacing={3}
      isContentLoading={false}
      pageSize={10}
    />
  );
};

export default BuyPositions;
