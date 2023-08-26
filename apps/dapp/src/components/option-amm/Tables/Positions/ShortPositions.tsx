import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import TableLayout from 'components/common/TableLayout';

interface ShortPositionData {
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

const columnHelper = createColumnHelper<ShortPositionData>();

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
    header: 'PNL',
    cell: (info) => (
      <span className="space-x-2">
        <p className="inline-block">$ {info.getValue()}</p>
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
        disabled={info.getValue().canItBeSettled}
        size="small"
        variant="contained"
      >
        Withdraw
      </Button>
    ),
  }),
];

interface Props {
  data: ShortPositionData[];
}

const ShortPositions = ({ data }: Props) => {
  return (
    <TableLayout<ShortPositionData>
      data={data}
      columns={columns}
      isContentLoading={false}
      rowSpacing={2}
    />
  );
};

export default ShortPositions;
