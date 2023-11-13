import React, { useCallback, useMemo } from 'react';
import { BaseError, formatUnits } from 'viem';

import { Checkbox } from '@mui/material';

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

import useClammStore from 'hooks/clamm/useClammStore';

import TableLayout from 'components/common/TableLayout';

import formatValue from 'utils/clamm/formatValue';
import getExerciseTxData from 'utils/clamm/varrock/getExerciseTxData';
import { OptionsPositionsResponse } from 'utils/clamm/varrock/types';
import getPercentageDifference from 'utils/math/getPercentageDifference';

import { DEFAULT_CHAIN_ID } from 'constants/env';

type BuyPositionItem = BuyPosition & {
  exerciseButton: {
    handleExercise: (meta: any) => void;
    disabled: boolean;
  };
};

export type BuyPosition = {
  strike: {
    strikePrice: number;
    isSelected: boolean;
    handleSelect: () => void;
  };
  size: {
    amount: string;
    symbol: string;
    usdValue: string;
  };
  side: string;
  premium: {
    amount: string;
    symbol: string;
    usdValue: string;
  };
  expiry: number;
  profit: {
    percentage: number;
    amount: string;
    symbol: string;
    usdValue: string;
  };
};

const columnHelper = createColumnHelper<BuyPositionItem>();
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().strikePrice.toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <div className="flex flex-col items-start justfiy-start">
        <div className="flex items-center justify-start space-x-[3px]">
          <span className="text-white">
            {formatValue(info.getValue().amount)}
          </span>
          <span className="text-stieglitz text-xs">
            {info.getValue().symbol}
          </span>
        </div>
        <span className="text-stieglitz text-xs">
          $ {formatValue(info.getValue().usdValue)}
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
      const { amount, symbol } = info.getValue();
      return (
        <div className="flex flex-col items-start justfiy-start">
          <div className="flex items-center justify-start space-x-[3px]">
            <span className="text-white">
              {formatValue(info.getValue().amount)}
            </span>
            <span className="text-stieglitz text-xs">
              {info.getValue().symbol}
            </span>
          </div>
          <span className="text-stieglitz text-xs">
            $ {formatValue(info.getValue().usdValue)}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('profit', {
    header: 'Profit',
    cell: (info) => {
      let { amount, usdValue, symbol, percentage } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <div className="flex flex-col">
          <span className="flex space-x-[3px] items-center">
            <span className={amountInNumber > 0 ? 'text-up-only' : 'stieglitz'}>
              {amountInNumber > 0 && '+'}
              {formatValue(amountInNumber)}
            </span>
            <span className="text-stieglitz text-xs">{symbol}</span>
          </span>
          <span className="text-stieglitz text-xs">
            $ {formatValue(usdValue)}
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

type Props = {
  positions: OptionsPositionsResponse[];
  selectPosition: (key: number, positionInfo: any) => void;
  selectedPositions: Map<number, any>;
  unselectPosition: (key: number) => void;
};
const BuyPositions = ({
  positions,
  selectPosition,
  selectedPositions,
  unselectPosition,
}: Props) => {
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const handleExercise = useCallback(
    async (positionId: string) => {
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
        const reciept = await publicClient.waitForTransactionReceipt({
          hash,
        });

        toast.success('Transaction sent');
      } catch (err) {
        const error = err as BaseError;
        console.error(err);
        oneInchExerciseFailed = true;
        toast.error('Failed to exercise through 1inch, using uniswap V3');
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
          const reciept = await publicClient.waitForTransactionReceipt({
            hash,
          });

          toast.success('Transaction sent');
        } catch (err) {
          const error = err as BaseError;
          console.error(err);
          toast.error(error.shortMessage);
        }
      }

      toast.remove(loadingToastId);
    },
    [selectedOptionsPool, walletClient],
  );

  const buyPositions = useMemo(() => {
    return positions.map(
      (
        { expiry, premium, profit, side, size, strike, meta }: any,
        index: number,
      ) => {
        const readablePremium = formatUnits(
          premium.amountInToken,
          premium.decimals,
        );

        const readableProfit = formatUnits(
          profit.amountInToken,
          profit.decimals,
        );

        const isSelected = Boolean(selectedPositions.get(index));

        return {
          expiry,
          premium: {
            amount: readablePremium,
            symbol: premium.symbol,
            usdValue: premium.usdValue,
          },
          profit: {
            amount: readableProfit,
            usdValue: profit.usdValue,
            symbol: profit.symbol,
            percentage: Math.max(
              getPercentageDifference(
                Number(profit.amount),
                Number(readablePremium),
              ),
              0,
            ),
          },
          side: side.charAt(0).toUpperCase() + side.slice(1),
          size: {
            amount: formatUnits(size.amountInToken, size.decimals),
            symbol: size.symbol,
            usdValue: size.usdValue,
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
              await handleExercise(String(meta.tokenId));
            },
            disabled: formatValue(readableProfit) === '0',
          },
        };
      },
    );
  }, [
    positions,
    handleExercise,
    selectPosition,
    selectedPositions,
    unselectPosition,
  ]);

  return (
    <TableLayout<BuyPositionItem>
      data={buyPositions}
      columns={columns}
      rowSpacing={3}
      isContentLoading={false}
      pageSize={10}
    />
  );
};

export default BuyPositions;
