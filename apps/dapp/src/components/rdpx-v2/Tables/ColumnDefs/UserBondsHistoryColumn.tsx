import { Address, formatUnits } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import Typography2 from 'components/UI/Typography2';

import { smartTrim } from 'utils/general';
import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

export interface UserBondsHistoryType {
  owner: Address;
  composition: readonly [bigint, bigint];
  receiptTokensMinted: bigint;
  transaction: {
    timestamp: bigint;
    hash: string;
  };
}

const columnHelper = createColumnHelper<UserBondsHistoryType>();

const columns = [
  columnHelper.accessor('receiptTokensMinted', {
    header: 'Amount',
    cell: (info) => (
      <span className="flex space-x-1">
        <Typography2 variant="caption">
          {formatUnits(info.getValue(), DECIMALS_TOKEN)}
        </Typography2>
        <Typography2 variant="caption" color="stieglitz">
          rtETH
        </Typography2>
      </span>
    ),
  }),
  columnHelper.accessor('composition', {
    header: 'Composition',
    cell: (info) => {
      const [wethAmount, rdpxAmount] = info.getValue();
      return (
        <td className="flex space-x-1">
          <span className="flex space-x-1">
            <Typography2 variant="caption">
              {formatBigint(wethAmount || 0n, DECIMALS_TOKEN)}{' '}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              WETH
            </Typography2>
          </span>
          <span className="flex space-x-1">
            <Typography2 variant="caption">
              {formatBigint(rdpxAmount || 0n, DECIMALS_TOKEN)}{' '}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              rDPX
            </Typography2>
          </span>
        </td>
      );
    },
  }),
  columnHelper.accessor('transaction', {
    header: 'Transaction ',
    cell: (info) => {
      const { hash, timestamp } = info.getValue();
      return (
        <div className="flex flex-col space-y-1">
          <Typography2 variant="caption">{smartTrim(hash, 8)}</Typography2>
          <Typography2 variant="caption" color="stieglitz">
            {format(new Date(Number(timestamp) * 1000), 'dd LLL yyyy')}
          </Typography2>
        </div>
      );
    },
  }),
  columnHelper.accessor('transaction', {
    header: '',
    cell: (info) => {
      const { hash } = info.getValue();
      return (
        <a
          href={`https://goerli.arbiscan.io/tx/${hash}`}
          className="flex justify-end"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowTopRightOnSquareIcon className="fill-current text-stieglitz w-4 h-4" />
        </a>
      );
    },
  }),
];

export default columns;
