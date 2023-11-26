import { Address } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import Typography2 from 'components/UI/Typography2';

import { smartTrim } from 'utils/general';
import formatBigint from 'utils/general/formatBigint';

export interface DepositHistory {
  owner: Address;
  assets: bigint;
  shares: bigint;
  transaction: {
    hash: string;
  };
}

const columnHelper = createColumnHelper<DepositHistory>();

const columns = [
  columnHelper.accessor('assets', {
    header: 'Amount',
    cell: (info) => (
      <span className="flex space-x-1">
        <Typography2 variant="caption">
          {formatBigint(info.getValue())}
        </Typography2>
        <Typography2 variant="caption" color="stieglitz">
          WETH
        </Typography2>
      </span>
    ),
  }),
  columnHelper.accessor('shares', {
    header: 'Shares Received',
    cell: (info) => (
      <span className="flex space-x-1">
        <Typography2 variant="caption">
          {formatBigint(info.getValue())}
        </Typography2>
        <Typography2 variant="caption" color="stieglitz">
          LP
        </Typography2>
      </span>
    ),
  }),
  columnHelper.accessor('owner', {
    header: 'Owner',
    cell: (info) => {
      const owner = info.getValue();
      return <Typography2 variant="caption">{smartTrim(owner, 8)}</Typography2>;
    },
  }),
  columnHelper.accessor('transaction', {
    header: 'Transaction',
    cell: (info) => {
      const { hash } = info.getValue();
      return (
        <a
          href={`https://arbiscan.io/tx/${hash}`}
          className="flex justify-end space-x-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography2 variant="caption" color="stieglitz">
            {smartTrim(hash, 8)}
          </Typography2>
          <ArrowTopRightOnSquareIcon className="fill-current text-stieglitz w-4 h-4" />
        </a>
      );
    },
  }),
];

export default columns;
