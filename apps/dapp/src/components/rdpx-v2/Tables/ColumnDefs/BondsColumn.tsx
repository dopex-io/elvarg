import { BigNumber } from 'ethers';

import Tooltip from '@mui/material/Tooltip';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_TOKEN } from 'constants/index';

export interface UserBonds {
  tokenId: number;
  maturity: number | BigNumber;
  amount: BigNumber;
  redeemable: Boolean;
  timestamp: number | BigNumber;
  button: {
    handleRedeem: () => void;
    redeemable: boolean;
    id: number;
  };
}

const columnHelper = createColumnHelper<UserBonds>();

const columns = [
  columnHelper.accessor('tokenId', {
    header: 'Bond ID',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => {
      const amount = info.getValue();
      return (
        <Tooltip title={getUserReadableAmount(amount, DECIMALS_TOKEN)}>
          <p className="text-sm">
            {getUserReadableAmount(amount, DECIMALS_TOKEN).toFixed(3)}{' '}
            <span className="text-stieglitz">RT</span>
          </p>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('maturity', {
    header: 'Expiry',
    cell: (info) => (
      <p>{format(new Date(Number(info.getValue())), 'd LLL yyyy')}</p>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();
      return (
        <Button
          key={value.id}
          color={value.redeemable ? 'primary' : 'mineshaft'}
          onClick={value.handleRedeem}
          disabled={!value.redeemable}
        >
          Redeem
        </Button>
      );
    },
  }),
];

export default columns;
