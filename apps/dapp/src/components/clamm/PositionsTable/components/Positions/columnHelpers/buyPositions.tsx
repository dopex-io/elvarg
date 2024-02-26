import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import CheckBox from 'components/UI/CheckBox/CheckBox';

import { formatAmount } from 'utils/general';

export type BuyPositionItem = {
  breakEven: number;
  strike: {
    disabled: boolean;
    isSelected: boolean;
    price: number;
    handleSelect: () => Promise<void>;
  };
  size: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  side: string;
  premium: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  expiry: number;
  profit: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  share: () => void;
};

export const columnHelper = createColumnHelper<BuyPositionItem>();
export const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike',
    cell: (info) => (
      <span className="flex space-x-[4px] text-left items-center justify-start text-[13px]">
        <CheckBox
          disabled={info.getValue().disabled}
          checked={info.getValue().isSelected}
          onClick={() => info.getValue().handleSelect()}
        />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{formatAmount(info.getValue().price, 5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => (
      <div className="flex items-center space-x-[2px] text-[13px]">
        <span>
          {info.getValue()[0].toUpperCase() + info.getValue().slice(1)}
        </span>
        {info.getValue().toLowerCase() === 'put' ? (
          <ArrowDownRightIcon className="text-down-bad w-[14px] h-[14px]" />
        ) : (
          <ArrowUpRightIcon className="text-up-only w-[14px] h-[14px]" />
        )}
      </div>
    ),
  }),
  columnHelper.accessor('breakEven', {
    header: 'Breakeven',
    cell: (info) => (
      <span className="flex space-x-[4px] text-left items-center justify-start text-[13px]">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{formatAmount(info.getValue(), 5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <div className="flex flex-col items-start justify-start text-[13px]">
        <span className="flex space-x-[4px] text-left items-center justify-start text-[13px]">
          <p className="inline-block">
            {formatAmount(info.getValue().amount, 5)}
          </p>
          <p className="text-stieglitz inline-block text-xs">
            {info.getValue().symbol}
          </p>
        </span>
        <span className="text-stieglitz text-xs">
          $ {formatAmount(info.getValue().usdValue, 5)}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('premium', {
    header: 'Premium',
    cell: (info) => (
      <div className="flex flex-col items-start justify-start text-[13px]">
        <span className="flex space-x-[4px] text-left items-center justify-start text-[13px]">
          <p className="inline-block">
            {formatAmount(info.getValue().amount, 5)}
          </p>
          <p className="text-stieglitz inline-block text-xs">
            {info.getValue().symbol}
          </p>
        </span>
        <span className="text-stieglitz text-xs">
          $ {formatAmount(info.getValue().usdValue, 5)}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <span className="text-[13px] overflow-hidden whitespace-nowrap">
        {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
        {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
      </span>
    ),
  }),
  columnHelper.accessor('profit', {
    header: 'Profit',
    cell: (info) => {
      let { amount, usdValue, symbol } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <div className="flex flex-col items-start justify-start text-[13px]">
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
  columnHelper.accessor('share', {
    header: '',
    cell: (info) => {
      return (
        <ShareIcon
          height={18}
          width={18}
          className="text-white"
          role="button"
          onClick={info.getValue()}
        />
      );
    },
  }),
];
