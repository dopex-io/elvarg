import React, { useMemo } from 'react';
import { formatUnits } from 'viem';

import { Disclosure } from '@dopex-io/ui';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';

import { formatAmount } from 'utils/general';

const CostSummary = () => {
  const { isTrade } = useClammStore();
  const { purchases, deposits } = useClammTransactionsStore();

  const total = useMemo(() => {
    const _total = new Map<string, number>();
    if (purchases.size > 0) {
      // setTotal((prev) => {
      purchases.forEach(({ premium, tokenSymbol, tokenDecimals }) => {
        const curr = _total.get(tokenSymbol);
        const amountInNumber = Number(
          formatAmount(formatUnits(premium, tokenDecimals), 5),
        );
        if (curr) {
          _total.set(tokenSymbol, curr + amountInNumber);
          return _total;
        } else {
          _total.set(tokenSymbol, amountInNumber);
          return _total;
        }
      });
    }
    if (deposits.size > 0) {
      deposits.forEach(({ amount, tokenSymbol, tokenDecimals }) => {
        const curr = _total.get(tokenSymbol);
        const amountInNumber = Number(
          formatAmount(formatUnits(amount, tokenDecimals), 5),
        );
        if (curr) {
          _total.set(tokenSymbol, curr + amountInNumber);
          return _total;
        } else {
          _total.set(tokenSymbol, amountInNumber);
          return _total;
        }
      });
    }
    return _total;
  }, [deposits, purchases]);

  const totalItems = useMemo(() => {
    const _total: {
      tokenSymbol: string;
      tokenAmount: string;
      strike: string;
    }[] = [];
    if (purchases.size === 0 && deposits.size === 0) {
      return _total;
    } else {
      if (isTrade) {
        purchases.forEach(({ strike, premium, tokenDecimals, tokenSymbol }) => {
          _total.push({
            strike: formatAmount(strike, 5),
            tokenAmount: formatAmount(formatUnits(premium, tokenDecimals), 5),
            tokenSymbol: tokenSymbol,
          });
        });
      } else {
        deposits.forEach(({ strike, amount, tokenDecimals, tokenSymbol }) => {
          _total.push({
            strike: formatAmount(strike, 5),
            tokenAmount: formatAmount(formatUnits(amount, tokenDecimals), 5),
            tokenSymbol: tokenSymbol,
          });
        });
      }
    }
    return _total;
  }, [isTrade, purchases, deposits]);

  return (
    <div className="p-[12px] bg-umbra rounded-t-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              disabled={totalItems.length === 0}
              className={cx(
                'flex w-full items-center justify-between font-medium text-[13px] text-stieglitz',
                totalItems.length === 0 && 'cursor-not-allowed',
              )}
            >
              <span className="text-steiglitz font-medium text-[13px]">
                Total {isTrade ? 'premium' : 'deposit'}
              </span>

              <div className="flex items-center justify-center">
                <span className="flex items-center justify-center space-x-[8px]">
                  {Array.from(total).map(([symbol, amount], index) => (
                    <span
                      key={index}
                      className="text-[13px] flex items-center justify-center space-x-[4px]"
                    >
                      <span className="text-white">{amount}</span>
                      <span className="text-stieglitz">{symbol}</span>
                    </span>
                  ))}
                </span>
                <ChevronDownIcon
                  className={cx(
                    'w-[18px] h-[18px] text-stieglitz',
                    open && 'rotate-180 transform',
                  )}
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="w-full h-fit p-[12px] flex flex-col space-y-[12px] items-center justify-center">
              {totalItems.map(({ strike, tokenAmount, tokenSymbol }, index) => (
                <div
                  key={index}
                  className="w-full flex items-center justify-between"
                >
                  <span className="text-[13px] flex items-center justify-center space-x-[2px]">
                    <span className="text-stieglitz">$</span>
                    <span>{strike}</span>
                  </span>
                  <span className="text-[13px] flex items-center justify-center space-x-[4px]">
                    <span>{tokenAmount}</span>
                    <span className="text-stieglitz">{tokenSymbol}</span>
                  </span>
                </div>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default CostSummary;
