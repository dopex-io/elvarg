import React, { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

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
      purchases.forEach(({ premium, tokenSymbol, tokenDecimals }) => {
        const curr = _total.get(tokenSymbol);
        const amountInNumber = Number(formatUnits(premium, tokenDecimals));

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
        const amountInNumber = Number(formatUnits(amount, tokenDecimals));
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

  const totalProtocolFees = useMemo(() => {
    const _total = new Map<string, number>();
    if (isTrade) {
      if (purchases.size > 0) {
        purchases.forEach(({ premium, tokenSymbol, tokenDecimals }) => {
          const curr = _total.get(tokenSymbol);
          const amountInNumber = Number(formatUnits(premium, tokenDecimals));

          if (curr) {
            _total.set(tokenSymbol, curr + amountInNumber * 0.34);
            return _total;
          } else {
            _total.set(tokenSymbol, amountInNumber * 0.34);
            return _total;
          }
        });
      }
    }
    return _total;
  }, [isTrade, purchases]);

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
            tokenAmount: formatUnits(premium, tokenDecimals),
            tokenSymbol: tokenSymbol,
          });
        });
      } else {
        deposits.forEach(({ strike, amount, tokenDecimals, tokenSymbol }) => {
          _total.push({
            strike: formatAmount(strike, 5),
            tokenAmount: formatUnits(amount, tokenDecimals),
            tokenSymbol: tokenSymbol,
          });
        });
      }
    }
    return _total;
  }, [isTrade, purchases, deposits]);

  if (totalItems.length === 0) return null;

  return (
    <div className="p-[12px] bg-umbra space-y-[4px]">
      <div className="w-full h-fit flex flex-col space-y-[4px] items-center justify-center">
        {totalItems.map(({ strike, tokenAmount, tokenSymbol }, index) => (
          <div key={index} className="w-full flex items-center justify-between">
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
      </div>
      <div className="w-full flex flex-col space-y-[4px]">
        <div
          className={cx(
            'flex w-full items-center justify-between font-medium text-[13px] text-stieglitz',
            totalItems.length === 0 && 'cursor-not-allowed',
          )}
        >
          <span className="font-medium text-[13px]">
            Total {isTrade ? 'premium' : 'deposit'}
          </span>
          <div className="flex items-center justify-center">
            <span className="flex items-center justify-center space-x-[8px]">
              {Array.from(total).map(([symbol, amount], index) => (
                <span
                  key={index}
                  className="text-[13px] flex items-center justify-center space-x-[4px]"
                >
                  <span className="text-white">{formatAmount(amount, 6)}</span>
                  <span className="text-stieglitz">{symbol}</span>
                </span>
              ))}
            </span>
          </div>
        </div>
        {isTrade && (
          <div
            className={cx(
              'flex w-full items-center justify-between font-medium text-[13px] text-stieglitz',
              totalProtocolFees.size === 0 && 'cursor-not-allowed',
            )}
          >
            <span className="font-medium text-[13px]">Protocol Fees</span>
            <div className="flex items-center justify-center">
              <span className="flex items-center justify-center space-x-[8px]">
                {Array.from(totalProtocolFees).map(
                  ([symbol, amount], index) => (
                    <span
                      key={index}
                      className="text-[13px] flex items-center justify-center space-x-[4px]"
                    >
                      <span className="text-white">
                        {formatAmount(amount, 6)}
                      </span>
                      <span className="text-stieglitz">{symbol}</span>
                    </span>
                  ),
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostSummary;
