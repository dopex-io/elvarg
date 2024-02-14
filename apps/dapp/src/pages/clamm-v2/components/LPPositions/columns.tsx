import { Address } from 'viem';

import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';

import { formatAmount } from 'utils/general';

import ManageDialog from './ManageDialog';

export type Columns = {
  range: {
    upper: number;
    lower: number;
  };
  earned: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  liquidity: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  withdrawable: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  handler: string;
  manage: {
    positions: LPPositionItemForTable[];
    refetch: (...args: any) => Promise<any>;
  };
};

export type LPPositionItemForTable = {
  utilization: number;
  handler: string;
  earned: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  liquidity: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  reserved: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  withdrawable: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  range: {
    lower: number;
    upper: number;
  };
  withdraw: PrepareWithdrawData;
};

export type PrepareWithdrawData = {
  shares: string;
  initialLiquidity: string;
  withdrawableLiquidity: string;
  hook: Address;
  tokenId: string;
  amount0: string;
  amount1: string;
  amount0Symbol: string;
  amount1Symbol: string;
  amount0Decimals: number;
  amount1Decimals: number;
  handler: Address;
  pool: Address;
  tickLower: number;
  tickUpper: number;
};

const columnHelper = createColumnHelper<Columns>();

export const columns = [
  columnHelper.accessor('range', {
    header: 'Range',
    cell: ({ getValue }) => (
      <div className="flex items-center space-x-[4px] text-[13px]">
        <span>{formatAmount(getValue().lower, 5)}</span>
        <div className="flex -space-x-3">
          <ArrowLongLeftIcon height={14} width={14} />
          <ArrowLongRightIcon height={14} width={14} />
        </div>
        <span>{formatAmount(getValue().upper, 5)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('handler', {
    header: 'handler',
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }),
  columnHelper.accessor('liquidity', {
    header: 'Liquidity',
    cell: ({ getValue }) => (
      <div className="text-[13px] flex flex-col items-start">
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount0, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount0Symbol}
          </span>
        </div>
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount1, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount1Symbol}
          </span>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('earned', {
    header: 'Earned',
    cell: ({ getValue }) => (
      <div className="text-[13px] flex flex-col items-start">
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount0, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount0Symbol}
          </span>
        </div>
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount1, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount1Symbol}
          </span>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
    cell: ({ getValue }) => (
      <div className="text-[13px] flex flex-col items-start">
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount0, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount0Symbol}
          </span>
        </div>
        <div className="flex space-x-[4px]">
          <span>{formatAmount(getValue().amount1, 5)}</span>
          <span className="text-stieglitz text-[12px]">
            {getValue().amount1Symbol}
          </span>
        </div>
      </div>
    ),
  }),

  columnHelper.accessor('manage', {
    header: 'Manage',
    cell: ({ getValue }) => (
      <ManageDialog
        positions={getValue().positions}
        refetch={getValue().refetch}
      />
    ),
  }),
];
