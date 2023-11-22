import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import Countdown from 'react-countdown';

import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

export interface UserBonds {
  tokenId: string;
  maturity: bigint;
  amount: bigint;
  redeemable: Boolean;
  timestamp: bigint;
  button: {
    handleRedeem: () => void;
    redeemable: boolean;
    id: bigint;
    label: string;
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
    header: 'Maturation',
    cell: (info) => (
      <Countdown
        date={new Date(Number(info.getValue() || 0n))}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="flex space-x-1 text-stieglitz">
            <div className="space-x-1">
              <Typography2 variant="caption" color="white">
                {days}
              </Typography2>
              d
              <Typography2 variant="caption" color="white">
                {hours}
              </Typography2>
              h
              <Typography2 variant="caption" color="white">
                {minutes}
              </Typography2>
              m
              <Typography2 variant="caption" color="white">
                {seconds}
              </Typography2>
              s
            </div>
          </div>
        )}
      />
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
          {value.label}
        </Button>
      );
    },
  }),
];

export default columns;
