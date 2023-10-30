import { formatUnits } from 'viem';

import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

export interface DelegatePositions {
  amount: bigint;
  activeCollateral: bigint;
  balance: bigint;
  fee: bigint;
  button: {
    handleWithdraw: () => void;
    disabled: boolean;
  };
}

const columnHelper = createColumnHelper<DelegatePositions>();

const columns = [
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => (
      <Tooltip title={formatUnits(info.getValue(), DECIMALS_TOKEN)}>
        <p className="text-sm">
          {formatBigint(info.getValue(), DECIMALS_TOKEN)}{' '}
          <span className="text-stieglitz">WETH</span>
        </p>
      </Tooltip>
    ),
  }),
  columnHelper.accessor('balance', {
    header: 'Balance',
    cell: (info) => {
      const balance = info.getValue();
      return (
        <Tooltip title={formatBigint(balance, DECIMALS_TOKEN)}>
          <p className="text-sm">
            {formatBigint(balance, DECIMALS_TOKEN)}{' '}
            <span className="text-stieglitz">WETH</span>
          </p>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('activeCollateral', {
    header: 'Active',
    cell: (info) => {
      const activeCollateral = info.getValue();
      return (
        <p className="text-sm">
          {formatBigint(activeCollateral, DECIMALS_TOKEN)}{' '}
          <span className="text-stieglitz">WETH</span>
        </p>
      );
    },
  }),
  columnHelper.accessor('fee', {
    header: 'Fee',
    cell: (info) => (
      <p>{formatBigint(info.getValue(), DECIMALS_STRIKE) + '%'}</p>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const { disabled, handleWithdraw } = info.getValue();
      return (
        <Button
          disabled={disabled}
          onClick={handleWithdraw}
          size="small"
          className="my-2"
        >
          Withdraw
        </Button>
      );
    },
  }),
];

export default columns;
