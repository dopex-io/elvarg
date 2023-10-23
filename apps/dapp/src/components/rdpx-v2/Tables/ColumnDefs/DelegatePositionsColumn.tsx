import { BigNumber } from 'ethers';

import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

export interface DelegatePositions {
  amount: BigNumber;
  activeCollateral: BigNumber;
  balance: BigNumber;
  fee: BigNumber;
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
      <Tooltip title={getUserReadableAmount(info.getValue(), DECIMALS_TOKEN)}>
        <p className="text-sm">
          {getUserReadableAmount(info.getValue(), DECIMALS_TOKEN).toFixed(3)}{' '}
          <span className="text-stieglitz">WETH</span>
        </p>
      </Tooltip>
    ),
  }),
  columnHelper.accessor('activeCollateral', {
    header: 'Active Collateral',
    cell: (info) => {
      const activeCollateral = info.getValue();
      return (
        <p className="text-sm">
          {getUserReadableAmount(activeCollateral, DECIMALS_TOKEN).toFixed(3)}{' '}
          <span className="text-stieglitz">WETH</span>
        </p>
      );
    },
  }),
  columnHelper.accessor('balance', {
    header: 'Balance',
    cell: (info) => {
      const balance = info.getValue();
      return (
        <Tooltip title={getUserReadableAmount(balance, DECIMALS_TOKEN)}>
          <p className="text-sm">
            {getUserReadableAmount(balance, DECIMALS_TOKEN).toFixed(3)}{' '}
            <span className="text-stieglitz">WETH</span>
          </p>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('fee', {
    header: 'Fee',
    cell: (info) => (
      <p>{getUserReadableAmount(info.getValue(), DECIMALS_STRIKE) + '%'}</p>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const { disabled, handleWithdraw } = info.getValue();
      return (
        <Button disabled={disabled} onClick={handleWithdraw}>
          Withdraw
        </Button>
      );
    },
  }),
];

export default columns;
