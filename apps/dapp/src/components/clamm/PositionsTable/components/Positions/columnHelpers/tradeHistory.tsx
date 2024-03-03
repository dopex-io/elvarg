import { Address, Hex } from 'viem';

import {
  ArrowDownRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { cn, formatAmount } from 'utils/general';

export type PurchaseHistoryItem = {
  premium: string;
  size: string;
  ttl: number;
  timestamp: number;
  strike: number;
  type: string;
  txHash: Hex;
  token: {
    address: Address;
    decimals: number;
    symbol: string;
  };
};

export type ExerciseHistoryItem = {
  strike: number;
  exercisePrice: number;
  premium: string;
  timestamp: number;
  priceAtAction: number;
  ttl: string;
  profit: string;
  size: string;
  sizeToken: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  profitToken: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  type: string;
  txHash: Hex;
};

export type HistoryPositionsItem = {
  strike: {
    price: number;
    side: string;
  };
  other: {
    onShare: (() => void) | null;
    txUrl: string;
  };
  size: {
    amount: string;
    symbol: string;
  };
  timestamp: number;
  actionInfo: {
    label: string;
    amount: string;
    symbol: string;
  }[];
  market: {
    action: string;
    callToken: {
      symbol: string;
      imgSrc: string;
    };
    putToken: {
      symbol: string;
      imgSrc: string;
    };
  };
};
export const historyPositionsColumnHelper =
  createColumnHelper<HistoryPositionsItem>();
export const historyPositionsColumns = [
  historyPositionsColumnHelper.accessor('market', {
    header: ' ',
    cell: ({ getValue }) => {
      const { callToken, putToken, action } = getValue();
      return (
        <div className="flex flex-col space-y-[4px]">
          <span className="text-stieglitz text-[13px] font-medium">
            {action === 'purchase' ? 'Purchase' : 'Exercise'}
          </span>
          <div className="flex items-center justify-start space-x-[4px]">
            <div className="flex -space-x-1 sm:-space-x-2 self-center">
              <img
                className="object-scale-down sm:w-[18px] sm:h-[18px] z-10 border border-gray-500 rounded-full"
                src={callToken.imgSrc}
                alt={callToken.symbol}
              />
              <img
                className="object-scale-down sm:w-[18px] sm:h-[18px]"
                src={putToken.imgSrc}
                alt={putToken.symbol}
              />
            </div>
            <span className="text-[13px]">
              {callToken.symbol} - {putToken.symbol}
            </span>
          </div>
        </div>
      );
    },
  }),
  historyPositionsColumnHelper.accessor('strike', {
    header: ' ',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col items-start">
          <span className="text-stieglitz text-[13px]">Strike</span>
          <div className="flex items-center justify-start space-x-[4px]">
            <span className="text-[13px] text-stieglitz">$</span>
            <span className="text-[13px]">
              {formatAmount(getValue().price, 4)}
            </span>
            {getValue().side === 'put' ? (
              <ArrowDownRightIcon className="text-down-bad w-[14px] h-[14px]" />
            ) : (
              <ArrowUpRightIcon className="text-up-only w-[14px] h-[14px]" />
            )}
          </div>
        </div>
      );
    },
  }),
  historyPositionsColumnHelper.accessor('size', {
    header: ' ',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col items-start">
          <span className="text-stieglitz text-[13px]">Size</span>
          <div className="flex items-center justify-start space-x-[4px]">
            <span className="text-[13px]">
              {formatAmount(getValue().amount, 4)}
            </span>
            <span className="text-[13px] text-stieglitz">
              {getValue().symbol}
            </span>
          </div>
        </div>
      );
    },
  }),
  historyPositionsColumnHelper.accessor('actionInfo', {
    header: ' ',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col items-start">
          {getValue().map(({ amount, label, symbol }, index) => (
            <div
              key={index}
              className="flex items-center justify-start space-x-[4px]"
            >
              <span className="text-[13px] text-stieglitz">{label}</span>
              <span className="text-[13px] flex items-center space-x-[4px]">
                <span
                  className={cn(
                    label === 'Profit' ? 'text-up-only' : 'text-white',
                  )}
                >
                  {amount}
                </span>
                <span className={'text-xs text-stieglitz'}>{symbol}</span>
              </span>
            </div>
          ))}
        </div>
      );
    },
  }),
  historyPositionsColumnHelper.accessor('timestamp', {
    header: ' ',
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center justify-end space-x-[4px]">
          <span className="text-[13px]">
            {format(new Date(getValue() * 1000), 'HH:mm:ss dd MMM yyyy')}
          </span>
        </div>
      );
    },
  }),
  historyPositionsColumnHelper.accessor('other', {
    header: ' ',
    cell: ({ getValue }) => {
      const { txUrl, onShare } = getValue();
      return (
        <div className="flex items-center justify-end space-x-[4px]">
          {onShare && (
            <ShareIcon
              role="button"
              onClick={onShare}
              className="h-[18px] w-[18px]"
            />
          )}
          <a href={txUrl} target="_blank">
            <ArrowTopRightOnSquareIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      );
    },
  }),
];
