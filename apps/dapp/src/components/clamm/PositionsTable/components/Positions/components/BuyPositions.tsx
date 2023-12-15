import React, { useCallback, useMemo } from 'react';
import { BaseError, formatUnits } from 'viem';

import toast from 'react-hot-toast';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import { PositionsTableProps } from 'components/clamm/PositionsTable';
import TableLayout from 'components/common/TableLayout';

import getExerciseTxData from 'utils/clamm/varrock/getExerciseTxData';
import { cn, formatAmount } from 'utils/general';
import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { BuyPositionItem, columns } from './columnHelpers/buyPositions';

const BuyPositions = ({
  selectPosition,
  selectedPositions,
  unselectPosition,
  loading,
}: PositionsTableProps) => {
  const { chain } = useNetwork();
  const { buyPositions, updateBuyPositions } = useClammPositions();
  const { selectedOptionsPool, markPrice } = useClammStore();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const handleExercise = useCallback(
    async (positionId: string, index: number) => {
      if (!selectedOptionsPool || !walletClient) return;

      const loadingToastId = toast.loading('Opening wallet');
      let oneInchExerciseFailed = false;
      try {
        const exerciseTxData = await getExerciseTxData({
          optionMarket: selectedOptionsPool.optionsPoolAddress,
          positionId: positionId,
          slippage: '10',
          type: '1inch',
        });

        const { publicClient } = wagmiConfig;
        const request = await walletClient.prepareTransactionRequest({
          account: walletClient.account,
          to: exerciseTxData.to,
          data: exerciseTxData.txData,
          type: 'legacy',
        });
        const hash = await walletClient.sendTransaction(request);
        await publicClient.waitForTransactionReceipt({
          hash,
        });
        await updateBuyPositions?.();
        toast.success('Transaction sent');
      } catch (err) {
        const error = err as BaseError;
        console.error(err);
        if (error.shortMessage === 'User rejected the request.') {
          toast.remove(loadingToastId);
          toast.error(error.shortMessage);
          return;
        } else {
          oneInchExerciseFailed = true;
          toast.error('Failed to exercise through 1inch, using uniswap V3');
        }
        toast.error(error.shortMessage);
      }

      if (oneInchExerciseFailed) {
        try {
          const exerciseTxData = await getExerciseTxData({
            optionMarket: selectedOptionsPool.optionsPoolAddress,
            positionId: positionId,
            slippage: '3',
            type: 'uni-v3',
          });

          if (exerciseTxData.error) {
            toast.error('Failed to exercise');
            return;
          }

          const { publicClient } = wagmiConfig;
          const request = await walletClient.prepareTransactionRequest({
            account: walletClient.account,
            to: exerciseTxData.to,
            data: exerciseTxData.txData,
            type: 'legacy',
          });
          const hash = await walletClient.sendTransaction(request);
          await publicClient.waitForTransactionReceipt({
            hash,
          });

          await updateBuyPositions?.();
          toast.success('Transaction sent');
        } catch (err) {
          const error = err as BaseError;
          console.error(err);
          toast.error(error.shortMessage);
        }
      }
      toast.remove(loadingToastId);
    },
    [selectedOptionsPool, walletClient, updateBuyPositions],
  );

  const positions = useMemo(() => {
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    return buyPositions
      .map(
        (
          { expiry, premium, profit, side, size, strike, meta },
          index: number,
        ) => {
          const readablePremium = formatUnits(
            BigInt(premium.amountInToken),
            premium.decimals,
          );

          const isSelected = Boolean(selectedPositions.get(index));

          const isPut = side.toLowerCase() === 'put';
          const priceDifference = isPut
            ? strike - markPrice
            : markPrice - strike;

          const optionsAmount =
            side.toLowerCase() === 'put'
              ? Number(size.usdValue) / Number(strike)
              : Number(formatUnits(BigInt(size.amountInToken), size.decimals));

          const profitUsd =
            priceDifference < 0 ? 0 : priceDifference * optionsAmount;
          const profitAmount = isPut ? profitUsd / markPrice : profitUsd;

          const sizeInNumber = Number(
            formatUnits(BigInt(size.amountInToken), size.decimals),
          );
          const sizeUsd = isPut ? sizeInNumber : sizeInNumber * markPrice;

          const breakEven =
            side.toLowerCase() === 'put'
              ? Number(strike) - Number(premium.usdValue) / optionsAmount
              : Number(strike) + Number(premium.usdValue) / optionsAmount;

          return {
            breakEven,
            expiry: Number(expiry),
            premium: {
              amount: readablePremium,
              symbol: getTokenSymbol({
                chainId,
                address: premium.tokenAddress,
              }),
              usdValue: premium.usdValue,
            },
            profit: {
              amount: profitAmount,
              usdValue: profitUsd,
              symbol: getTokenSymbol({
                chainId,
                address: profit.tokenAddress,
              }),
            },
            side: side.charAt(0).toUpperCase() + side.slice(1),
            size: {
              amount: sizeInNumber,
              symbol: getTokenSymbol({
                chainId,
                address: size.tokenAddress,
              }),
              usdValue: sizeUsd,
            },
            strike: {
              handleSelect: () => {
                if (!isSelected) {
                  selectPosition(index, meta);
                } else {
                  unselectPosition(index);
                }
              },
              isSelected: isSelected,
              strikePrice: Number(strike),
            },
            exerciseButton: {
              handleExercise: async () => {
                await handleExercise(String(meta.tokenId), index);
              },
              disabled: profitAmount === 0,
            },
          };
        },
      )
      .sort(
        (a: any, b: any) =>
          Number(a.strike.strikePrice) - Number(b.strike.strikePrice),
      );
  }, [
    chain?.id,
    buyPositions,
    markPrice,
    handleExercise,
    selectPosition,
    selectedPositions,
    unselectPosition,
  ]);

  const totalProfitUsd = useMemo(() => {
    return positions.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.profit.usdValue),
      0,
    );
  }, [positions]);

  const optionsSummary = useMemo(() => {
    const totalProfitUsd = positions.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.profit.usdValue),
      0,
    );

    const totalOptions = positions.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        (currentValue.side.toLowerCase() === 'put'
          ? Number(currentValue.size.amount) /
            Number(currentValue.strike.strikePrice)
          : Number(currentValue.size.amount))
      );
    }, 0);

    const totalPremiumUsd = positions.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.premium.usdValue),
      0,
    );

    return {
      totalProfitUsd,
      totalOptions,
      totalPremiumUsd,
    };
  }, [positions]);

  return (
    <div className="w-full flex flex-col space-y-[12px] py-[12px]">
      <div className="bg-cod-gray flex px-[12px] items-center justify-end space-x-[12px]">
        <div className="flex items-center justify-center space-x-[4px]">
          <span className="text-stieglitz text-xs">Total profit:</span>
          <span className="text-xs flex items-center justify-center space-x-[2px]">
            <span className="text-stieglitz">$</span>
            <span className={cn(totalProfitUsd > 0 && 'text-up-only')}>
              {formatAmount(optionsSummary.totalProfitUsd, 3)}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center space-x-[4px]">
          <span className="text-stieglitz text-xs">Total premium:</span>
          <span className="text-xs flex items-center justify-center space-x-[2px]">
            <span className="text-stieglitz">$</span>
            <span>{formatAmount(optionsSummary.totalPremiumUsd, 3)}</span>
          </span>
        </div>
        <div className="flex items-center justify-center space-x-[4px]">
          <span className="text-stieglitz text-xs">Total size:</span>
          <span className="text-xs flex items-center justify-center space-x-[4px]">
            <span>{formatAmount(optionsSummary.totalOptions, 3)}</span>
            <span className="text-stieglitz text-xs">
              {selectedOptionsPool?.callToken.symbol}
            </span>
          </span>
        </div>
      </div>
      <TableLayout<BuyPositionItem>
        data={positions}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading}
        pageSize={10}
      />
    </div>
  );
};

export default BuyPositions;
