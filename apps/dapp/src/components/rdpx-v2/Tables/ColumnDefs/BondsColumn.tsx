import { BigNumber } from 'ethers';
import { formatUnits } from 'viem';

import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

export interface UserBonds {
  tokenId: bigint;
  maturity: bigint;
  amount: bigint;
  redeemable: Boolean;
  timestamp: bigint;
  button: {
    handleRedeem: () => void;
    redeemable: boolean;
    id: bigint;
  };
}

const columnHelper = createColumnHelper<UserBonds>();

const columns = [
  columnHelper.accessor('tokenId', {
    header: 'Bond ID',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="inline-block">{Number(info.getValue())}</p>
      </span>
    ),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => {
      const amount = info.getValue();
      return (
        <Tooltip title={formatBigint(amount || 0n, DECIMALS_TOKEN)}>
          <Typography2 variant="subtitle2">
            {formatBigint(amount || 0n, DECIMALS_TOKEN)}{' '}
            <span className="text-stieglitz">rtETH</span>
          </Typography2>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('maturity', {
    header: 'Expiry',
    cell: (info) => (
      <p>{format(new Date(Number(info.getValue() || 0n)), 'd LLL yyyy')}</p>
    ),
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();
      return (
        <Button
          size="small"
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
