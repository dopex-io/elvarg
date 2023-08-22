import React from 'react';

import { createColumnHelper } from '@tanstack/react-table';

import TableLayout from 'components/common/TableLayout';

interface LongPositionData {
  strike: number;
  size: string;
  side: string;
  expiry: number;
  breakeven: string;
  pnl: string;
  button: {
    handleSettle: () => void;
    id: number;
    epoch: number;
    currentEpoch: number;
    expiry: number;
    canItBeSettled: boolean;
  };
}

const columnHelper = createColumnHelper<LongPositionData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p className="text-stieglitz">{info.getValue()}</p>,
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('breakeven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
      </span>
    ),
  }),
];

interface Props {
  data: LongPositionData[];
}

const LongPositions = ({ data }: Props) => {
  return (
    <TableLayout<LongPositionData>
      data={data}
      columns={columns}
      isContentLoading={false}
    />
  );
};

export default LongPositions;
