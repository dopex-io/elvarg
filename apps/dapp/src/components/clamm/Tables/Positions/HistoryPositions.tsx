import { useMemo } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type HistoryPositionData = {
  tickLower: number;
  tickUpper: number;
  strike: number;
  size: {
    amount: string;
    symbol: string;
  };
  pnl: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  side: string;
  exercisableAmount: bigint;
  expiry: number;
  exercised: boolean;
};

const columnHelper = createColumnHelper<HistoryPositionData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <p>
        {formatAmount(info.getValue().amount, 5)}{' '}
        <span className="text-stieglitz">{info.getValue().symbol}</span>
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
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => {
      let { amount, usdValue, symbol } = info.getValue();
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
            {Number(amountInNumber) < 0 && (
              <p className="text-down-bad inline-block">
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
];

const HistoryPositions = ({
  historyPositions,
}: {
  historyPositions: HistoryPositionData[];
}) => {
  const positions = useMemo(() => {
    return historyPositions.map((position, index) => {
      return {
        ...position,
      };
    });
  }, [historyPositions]);

  return (
    <div>
      <TableLayout<HistoryPositionData>
        data={positions}
        columns={columns}
        rowSpacing={2}
        isContentLoading={false}
      />
    </div>
  );
};

export default HistoryPositions;
