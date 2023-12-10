import React, { useCallback, useMemo } from 'react';
import { BaseError, formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/20/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
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

type BuyPositionItem = BuyPosition & {
  exerciseButton: {
    handleExercise: (meta: any) => void;
    disabled: boolean;
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
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
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

const BuyPositions = ({
  selectPosition,
  selectedPositions,
  unselectPosition,
  loading,
  removePosition,
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
        removePosition(index);
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

          removePosition(index);
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
    [selectedOptionsPool, walletClient, updateBuyPositions, removePosition],
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
