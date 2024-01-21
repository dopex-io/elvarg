import { Button } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import CheckBox from 'components/UI/CheckBox/CheckBox';

import { formatAmount } from 'utils/general';

import LimitExercisePopover from '../BuyPositions/components/LimitExercisePopover';

export type BuyPositionItem = BuyPosition & {
  exerciseButton: {
    handleExercise: (meta: any) => void;
    disabled: boolean;
  };
  limitExercise: {
    cancelLimit: () => Promise<void>;
    currentLimit: number;
    createLimit: (limit: number) => Promise<void>;
    strike: number;
    isCall: boolean;
  };
};

export type BuyPosition = {
  breakEven: number;
  strike: {
    strikePrice: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  size: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  side: string;
  premium: {
    amount: string;
    symbol: string;
    usdValue: string;
  };
  expiry: number;
  profit: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
};

const columnHelper = createColumnHelper<BuyPositionItem>();
export const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <CheckBox
          checked={info.getValue().isSelected}
          onClick={() => info.getValue().handleSelect()}
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">
          {formatAmount(info.getValue().strikePrice, 5)}
        </p>
      </span>
    ),
  }),
  columnHelper.accessor('breakEven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{formatAmount(info.getValue(), 5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <div className="flex flex-col items-start justfiy-start">
        <div className="flex items-center justify-start space-x-[3px]">
          <span className="text-white">
            {formatAmount(info.getValue().amount, 5)}
          </span>
          <span className="text-stieglitz text-xs">
            {info.getValue().symbol}
          </span>
        </div>
        <span className="text-stieglitz text-xs">
          $ {formatAmount(info.getValue().usdValue, 5)}
        </span>
      </div>
    ),
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
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <span className=" overflow-hidden whitespace-nowrap">
        {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
        {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
      </span>
    ),
  }),
  columnHelper.accessor('premium', {
    header: 'Premium',
    cell: (info) => {
      return (
        <div className="flex flex-col items-start justfiy-start">
          <div className="flex items-center justify-start space-x-[3px]">
            <span className="text-white">
              {formatAmount(info.getValue().amount, 5)}
            </span>
            <span className="text-stieglitz text-xs">
              {info.getValue().symbol}
            </span>
          </div>
          <span className="text-stieglitz text-xs">
            $ {formatAmount(info.getValue().usdValue, 5)}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('limitExercise', {
    header: 'Limit Price',
    cell: (info) => {
      const { createLimit, currentLimit, strike, isCall, cancelLimit } =
        info.getValue();
      return (
        <LimitExercisePopover
          strike={strike}
          isCall={isCall}
          currentLimit={currentLimit}
          cancelLimit={cancelLimit}
          createLimit={createLimit}
        />
      );
    },
  }),
  columnHelper.accessor('profit', {
    header: 'Profit',
    cell: (info) => {
      let { amount, usdValue, symbol } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <div className="flex flex-col">
          <span className="flex space-x-[3px] items-center">
            <span className={amountInNumber > 0 ? 'text-up-only' : 'stieglitz'}>
              {amountInNumber > 0 && '+'}
              {formatAmount(amountInNumber, 5)}
            </span>
            <span className="text-stieglitz text-xs">{symbol}</span>
          </span>
          <span className="text-stieglitz text-xs">
            $ {formatAmount(usdValue, 5)}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('exerciseButton', {
    header: '',
    cell: (info) => {
      return (
        <Button
          onClick={info.getValue().handleExercise}
          disabled={info.getValue().disabled}
        >
          Exercise
        </Button>
      );
    },
  }),
];
