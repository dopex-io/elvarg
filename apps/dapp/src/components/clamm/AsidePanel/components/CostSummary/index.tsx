import React, { useMemo } from 'react';
import { formatUnits } from 'viem';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';

import { cn, formatAmount } from 'utils/general';

import { PROTOCOL_FEES_MULTIPLIER } from 'constants/clamm';

const CostSummary = () => {
  const { isTrade, markPrice, selectedOptionsPool, rangeSelectorMode } =
    useClammStore();
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

  const usdTotal = useMemo(() => {
    let _usdTotal = 0;
    totalItems.forEach(({ strike, tokenAmount }) => {
      const isCall = Number(strike) > markPrice;
      const usdValue = isCall
        ? markPrice * Number(tokenAmount)
        : Number(tokenAmount);
      _usdTotal += usdValue;
    });
    return _usdTotal * PROTOCOL_FEES_MULTIPLIER;
  }, [markPrice, totalItems]);

  const totalNotionalSize = useMemo(() => {
    let size = 0;
    purchases.forEach(({ amount }) => {
      size += amount;
    });
    return size;
  }, [purchases]);

  if (totalItems.length === 0) return null;

  return (
    <div className="p-[12px] bg-umbra space-y-[4px]">
      <div className="w-full h-fit flex flex-col space-y-[4px] items-center justify-center">
        {!rangeSelectorMode ||
          (isTrade &&
            totalItems.map(({ strike, tokenAmount, tokenSymbol }, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <span className="text-[12px] flex items-center justify-center space-x-[2px]">
                  <span className="text-stieglitz">$</span>
                  <span>{strike}</span>
                </span>
                <span className="text-[12px] flex items-center justify-center space-x-[4px]">
                  <span>{tokenAmount}</span>
                  <span className="text-stieglitz">{tokenSymbol}</span>
                </span>
              </div>
            )))}
      </div>
      <div className="w-full flex flex-col space-y-[4px]">
        <div
          className={cn(
            'flex w-full items-center justify-between font-medium text-[12px] text-stieglitz',
            totalItems.length === 0 && 'cursor-not-allowed',
          )}
        >
          <span className="font-medium text-[12px]">
            Total {isTrade ? 'premium' : 'deposit'}
          </span>
          <div className="flex items-center justify-center">
            <span className="flex items-center justify-center space-x-[8px]">
              {Array.from(total).map(([symbol, amount], index) => (
                <span
                  key={index}
                  className="text-[12px] flex items-center justify-center space-x-[4px]"
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
            className={cn(
              'flex w-full items-center justify-between font-medium text-[12px] text-stieglitz',
              totalProtocolFees.size === 0 && 'cursor-not-allowed',
            )}
          >
            <span className="font-medium text-[12px]">Protocol Fees</span>
            <div className="flex items-center justify-center">
              <span className="flex items-center justify-center space-x-[8px]">
                {Array.from(totalProtocolFees).map(
                  ([symbol, amount], index) => (
                    <span
                      key={index}
                      className="text-[12px] flex items-center justify-center space-x-[4px]"
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
        {isTrade && (
          <div className="flex justify-between w-full">
            <span className="text-stieglitz text-[12px]">Total Cost</span>
            <span className="text-[12px] flex items-center space-x-[2px]">
              <span className="text-stieglitz">$</span>
              <span className="text-white">{formatAmount(usdTotal, 3)}</span>
            </span>
          </div>
        )}
        {isTrade && (
          <div className="flex justify-between w-full">
            <span className="text-stieglitz text-[12px]">Total Size</span>
            <span className="text-[12px] flex items-center space-x-[4px]">
              <span className="text-white">
                {formatAmount(totalNotionalSize, 3)}
              </span>
              <span className="text-stieglitz text-xs">
                {selectedOptionsPool?.callToken.symbol}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostSummary;
