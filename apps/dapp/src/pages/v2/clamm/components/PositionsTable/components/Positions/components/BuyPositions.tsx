import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { StatItem } from 'pages/v2/clamm/components/StrikesChain/compnents/StrikesTable';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type BuyPositionItem = {
  strike: number;
  size: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  side: string;
  profit: {
    amount: number;
    symbol: string;
    usdValue: number;
    percentage: number;
  };
  expiry: number;
  select: {
    handleSelect: Function;
    disabled: boolean;
  };
  premium: {
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
      <div className="flex space-x-2 text-left">
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
      let { amount, usdValue, symbol } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <div className="flex flex-col">
          <span className={amountInNumber > 0 ? 'text-up-only' : 'stieglitz'}>
            {amountInNumber > 0 && '+'}
            {formatAmount(amountInNumber, 5)}
          </span>
          <span>$ {formatAmount(usdValue, 5)}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('select', {
    header: '',
    cell: (info) => {
      return <Checkbox className="text-mineshaft" size="small" />;
    },
  }),
];

// Calculate PNL Helper
const BuyPositions = () => {
  const buyPositions = useMemo(() => {
    return [
      {
        strike: 1000,
        size: {
          amount: 100,
          symbol: 'USDC',
          usdValue: 200,
        },
        side: 'Put',
        profit: {
          amount: 100,
          symbol: 'ARB',
          usdValue: 5,
          percentage: 0,
        },
        expiry: 200,
        select: {
          handleSelect: () => {},
          disabled: false,
        },
        premium: {
          amount: 123,
          symbol: 'ARB',
          usdValue: 5,
        },
      },
      {
        strike: 1000,
        size: {
          amount: 100,
          symbol: 'USDC',
          usdValue: 200,
        },
        side: 'Call',
        profit: {
          amount: 100,
          symbol: 'ARB',
          usdValue: 5,
          percentage: 0,
        },
        expiry: 200,
        select: {
          handleSelect: () => {},
          disabled: true,
        },
        premium: {
          amount: 123,
          symbol: 'USDC',
          usdValue: 6,
        },
      },
    ];
  }, []);
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
