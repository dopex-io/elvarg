import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import format from 'date-fns/format';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE } from 'constants/index';

export interface ColumnDef {
  id: bigint;
  side: string;
  strike: string;
  premium: string;
  pnl: bigint;
  amount: string;
  expiry: bigint;
  button: {
    id: number;
    isShort: boolean;
    handleSettle: () => void;
    expiry: number;
    canItBeSettled: boolean;
  };
}

const columnHelper = createColumnHelper<ColumnDef>();

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
  columnHelper.accessor('amount', {
    header: 'Size',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('premium', {
    header: 'Premium',
    cell: (info) => (
      <span className="space-x-1">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('pnl', {
    header: 'Profit/Loss',
    cell: (info) => (
      <span className="space-x-1">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">
          {formatAmount(formatUnits(info.getValue(), DECIMALS_STRIKE), 3)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">
          {format(Number(info.getValue()) * 1000, 'dd LLL yyyy')}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => (
      <Button
        className="inline-block"
        onClick={info.getValue().handleSettle}
        color="primary"
        disabled={!info.getValue().canItBeSettled}
        size="small"
        variant="contained"
      >
        {info.getValue().isShort ? 'Cover' : 'Exercise'}
      </Button>
    ),
  }),
];

export default columns;
