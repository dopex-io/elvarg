import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import { formatAmount } from 'utils/general';

export type LPPositionItem = {
  strike: {
    strikePrice: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  side: string;
  size: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  withdrawable: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  earned: {
    token0Amount: string;
    token1Amount: string;
    token0Symbol: string;
    token1Symbol: string;
  };
  withdrawButton: {
    disabled: boolean;
    handleWithdraw: (meta: any) => void;
  };
};

const columnHelper = createColumnHelper<LPPositionItem>();

export const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <Checkbox
          checked={info.getValue().isSelected}
          onChange={info.getValue().handleSelect}
          className="text-mineshaft"
          size="small"
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">
          {formatAmount(info.getValue().strikePrice, 4)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();

      return (
        <div className="flex flex-col items-start justify-center">
          {Number(token0Amount) !== 0 && (
            <span>
              {formatAmount(token0Amount, 3)}{' '}
              <span className="text-stieglitz">{token0Symbol}</span>
            </span>
          )}
          {Number(token1Amount) !== 0 && (
            <span>
              {formatAmount(token1Amount, 3)}{' '}
              <span className="text-stieglitz">{token1Symbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => (
      <div className="flex items-center space-x-[2px]">
        <span>{info.getValue()}</span>
        {info.getValue().toLowerCase() === 'put' ? (
          <ArrowDownRightIcon className="text-down-bad w-[14px] h-[14px]" />
        ) : (
          <ArrowUpRightIcon className="text-up-only w-[14px] h-[14px]" />
        )}
      </div>
    ),
  }),
  columnHelper.accessor('earned', {
    header: 'Earned',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span className="flex items-center justify-center space-x-[4px]">
            <span>{formatAmount(token0Amount, 3)}</span>
            <span className="text-stieglitz text-[13px]">{token0Symbol}</span>
            <span className="text-stieglitz text-[13px]"></span>
          </span>
          <span className="flex items-center justify-center space-x-[2px]">
            <span>{formatAmount(token1Amount, 3)}</span>
            <span className="text-stieglitz text-[13px]">{token1Symbol}</span>
            <span className="text-stieglitz text-[13px]"></span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
    cell: (info) => {
      const { token0Amount, token1Amount, token0Symbol, token1Symbol } =
        info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          <span>
            {formatAmount(token0Amount, 3)}{' '}
            <span className="text-stieglitz">{token0Symbol}</span>
          </span>
          <span>
            {formatAmount(token1Amount, 3)}{' '}
            <span className="text-stieglitz">{token1Symbol}</span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawButton', {
    header: '',
    cell: (info) => {
      return (
        <Button
          disabled={info.getValue().disabled}
          onClick={info.getValue().handleWithdraw}
        >
          Withdraw
        </Button>
      );
    },
  }),
];
