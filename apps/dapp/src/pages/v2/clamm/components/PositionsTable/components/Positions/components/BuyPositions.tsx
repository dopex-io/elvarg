import React, { useCallback, useMemo, useRef, useState } from 'react';

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
    amount: number;
    symbol: string;
    usdValue: number;
  };
  side: string;
  premium: {
    amount: number;
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
      <StatItem
        value={`${info.getValue().amount} ${info.getValue().symbol}`}
        name={`$ ${formatAmount(info.getValue().usdValue)}`}
      />
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
        <StatItem
          value={`${info.getValue().amount} ${info.getValue().symbol}`}
          name={`$ ${formatAmount(info.getValue().usdValue)}`}
        />
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
            {formatAmount(amountInNumber, 5)}{' '}
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

const BuyPositions = ({ positions }: { positions: BuyPosition[] }) => {
  const buyPositions = useMemo(() => {
    return positions.map(({ expiry, premium, profit, side, size, strike }) => {
      return {
        expiry,
        premium,
        profit: {
          ...profit,
          percentage: Math.max(
            getPercentageDifference(profit.amount, premium.amount),
            0,
          ),
        },
        side,
        size,
        strike,
        select: {
          handleSelect: () => {},
          disabled: false,
        },
      };
    });
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
