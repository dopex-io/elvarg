import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import Countdown from 'react-countdown';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

export interface UserBonds {
  tokenId: string;
  maturity: bigint;
  claimData: {
    amount: bigint;
    vested: bigint;
    claimable: bigint;
  };
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
      <span className="space-x-2 text-left text-xs">
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('claimData', {
    header: 'Claimable',
    cell: (info) => {
      const { claimable } = info.getValue();
      return (
        <Tooltip title={`${formatBigint(claimable || 0n, DECIMALS_TOKEN, 8)}`}>
          <div className="flex space-x-1 text-xs">
            <p className="text-xs">
              {formatBigint(claimable || 0n, DECIMALS_TOKEN)}{' '}
            </p>
            <p className="text-xs text-stieglitz">rtETH</p>
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('claimData', {
    header: 'Claimed',
    cell: (info) => {
      const { vested, amount } = info.getValue();
      const remainingVestedAmount = amount - vested;
      return (
        <Tooltip
          title={`${formatBigint(
            remainingVestedAmount || 0n,
            DECIMALS_TOKEN,
            8,
          )}`}
        >
          <div className="flex space-x-1 text-xs">
            <p className="text-xs">
              {formatBigint(remainingVestedAmount || 0n, DECIMALS_TOKEN)}{' '}
            </p>
            <p>/</p>
            <p className="text-xs">
              {formatBigint(amount || 0n, DECIMALS_TOKEN)}
            </p>{' '}
            <p className="text-stieglitz">rtETH</p>
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor('claimData', {
    header: 'Amount',
    cell: (info) => {
      const { amount } = info.getValue();
      return (
        <Tooltip title={formatBigint(amount || 0n, DECIMALS_TOKEN, 8)}>
          <span className="text-xs flex space-x-1">
            <p>{formatBigint(amount || 0n, DECIMALS_TOKEN)} </p>
            <p className="text-stieglitz">rtETH</p>
          </span>
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
          <div className="flex space-x-1 text-stieglitz text-xs">
            <div className="flex space-x-1">
              {days > 0 ? (
                <div>
                  <p className="text-white">{days}</p>d
                </div>
              ) : null}
              <p className="text-white">{hours}</p>h
              <p className="text-white">{minutes}</p>m
              <p className="text-white">{seconds}</p>s
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
          className="text-xs"
        >
          {value.label}
        </Button>
      );
    },
  }),
];

export default columns;
