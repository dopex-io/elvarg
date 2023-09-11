import React from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type TradeHistoryData = {
  status: string;
  tickLower: number;
  tickUpper: number;
  exercised: boolean;
  pnl: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  strike: number;
  side: string;
  size: {
    amount: string;
    symbol: string;
  };
  expiry: number;
  exercisableAmount: bigint;
  profit: {
    amount: string;
    symbol: string;
  };
};

const columnHelper = createColumnHelper<TradeHistoryData>();
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: ({ getValue }) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: ({ getValue }) => (
      <p>
        {formatAmount(getValue().amount, 5)}{' '}
        <span className="text-stieglitz">{getValue().symbol}</span>
      </p>
    ),
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <p className="overflow-hidden whitespace-nowrap">
        {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
        {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
      </p>
    ),
  }),
  columnHelper.accessor('profit', {
    header: 'PnL',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      const amountInNumber = Number(amount);
      return (
        <>
          <span className="space-x-2">
            {Number(amountInNumber) === 0 && (
              <p className="text-stieglitz inline-block">
                {formatAmount(amountInNumber, 5)}
              </p>
            )}
            {Number(amountInNumber) > 0 && (
              <p className="text-up-only inline-block">
                {formatAmount(amountInNumber, 5)}
              </p>
            )}
            <p className="text-stieglitz inline-block">{symbol}</p>
          </span>
          {/* <p className="text-stieglitz">${formatAmount(usdValue, 5)}</p> */}
        </>
      );
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => (
      <p>
        <span className="text-stieglitz">{getValue()}</span>
      </p>
    ),
  }),
];

const TradeHistory = ({
  tradeHistory,
}: {
  tradeHistory: TradeHistoryData[];
}) => {
  return (
    <div>
      <TableLayout<TradeHistoryData>
        data={tradeHistory}
        columns={columns}
        rowSpacing={3}
        isContentLoading={false}
      />
    </div>
  );
};

export default TradeHistory;
