import React, { useCallback, useMemo } from 'react';
import { Address, formatUnits, Hex } from 'viem';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';
import getPercentageDifference from 'utils/math/getPercentageDifference';

import { DEFAULT_CHAIN_ID } from 'constants/env';

type BuyPositionItem = BuyPosition & {
  exerciseButton: {
    handleExercise: (meta: any) => void;
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
    usdValue: number;
  };
  side: string;
  premium: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  expiry: number;
  profit: {
    percentage: number;
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
        <Checkbox
          checked={info.getValue().isSelected}
          onChange={info.getValue().handleSelect}
          className="text-mineshaft"
          size="small"
        />
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
            {formatAmount(info.getValue().amount, 5)}
          </span>
          <span className="text-stieglitz">{info.getValue().symbol}</span>
        </div>
        <span className="text-stieglitz text-sm">
          $ {formatAmount(info.getValue().usdValue, 5)}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue()}</p>,
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
    header: 'premium',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      return (
        <div className="flex flex-col items-start justfiy-start">
          <div className="flex items-center justify-start space-x-[3px]">
            <span className="text-white">
              {formatAmount(info.getValue().amount, 5)}
            </span>
            <span className="text-stieglitz">{info.getValue().symbol}</span>
          </div>
          <span className="text-stieglitz text-sm">
            $ {formatAmount(info.getValue().usdValue, 5)}
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
          <span className={amountInNumber > 0 ? 'text-up-only' : 'stieglitz'}>
            {amountInNumber > 0 && '+'}
            {formatAmount(amountInNumber, 5)} {symbol}{' '}
            {`(${formatAmount(percentage, 2)}%)`}
          </span>
          <span className="text-stieglitz">$ {formatAmount(usdValue, 5)}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('exerciseButton', {
    header: '',
    cell: (info) => {
      return <Button onClick={info.getValue().handleExercise}>Exericse</Button>;
    },
  }),
];

const BuyPositions = ({
  positions,
  selectPosition,
  selectedPositions,
  unselectPosition,
}: any) => {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });

  const handleExercise = useCallback(
    async (txData: Hex, to: Address) => {
      if (!walletClient) return;
      const { publicClient } = wagmiConfig;

      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: to,
        data: txData,
        type: 'legacy',
      });

      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });
    },
    [walletClient],
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

        const isSelected = Boolean(selectedPositions.get(index));

        return {
          expiry,
          premium: {
            amount: readablePremium,
            symbol: premium.symbol,
            usdValue: premium.usdValue,
          },
          profit: {
            amount: profit.amount,
            usdVlaue: profit.usdValue,
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
            usdValue: 0,
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
              const { txData, to } = meta.exerciseTx;
              await handleExercise(txData, to);
            },
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
