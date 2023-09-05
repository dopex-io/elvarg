import { useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';
import { ClammBuyPosition } from 'store/Vault/clamm';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';
import computeOptionPnl from 'utils/math/computeOptionPnl';

import { MARKETS } from 'constants/clamm/markets';

interface BuyPositionData {
  strikeSymbol: string;
  strike: string;
  size: string;
  isPut: boolean;
  pnlAndPrice: {
    pnl: number;
    price: number;
    tokenSymbol: string;
  };
  expiry: number;
  button: {
    handleExercise: () => void;
    id: number;
  };
}

const columnHelper = createColumnHelper<BuyPositionData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue()}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <p className="overflow-hidden whitespace-nowrap">
        {format(info.getValue(), 'dd MMM yyyy')}
      </p>
    ),
  }),
  columnHelper.accessor('isPut', {
    header: 'Side',
    cell: (info) => <p>{info.getValue() ? 'Put' : 'Call'}</p>,
  }),
  columnHelper.accessor('pnlAndPrice', {
    header: 'PnL',
    cell: (info) => {
      const value = info.getValue();
      const usdPrice = formatAmount(value.price * value.pnl, 3);

      return (
        <>
          <span className="space-x-2">
            <p className="text-stieglitz inline-block">$</p>
            {Number(usdPrice) >= 0 ? (
              <p className="text-up-only inline-block">{usdPrice}</p>
            ) : (
              <p className="text-down-bad inline-block">{usdPrice}</p>
            )}
          </span>
          <p className="text-stieglitz">
            {formatAmount(value.pnl, 3)} {value.tokenSymbol}
          </p>
        </>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const value = info.getValue();
      return (
        <Button key={value.id} color={'primary'} onClick={value.handleExercise}>
          Exercise
        </Button>
      );
    },
  }),
];

type ExercisePositionProps = Pick<
  ClammBuyPosition,
  'optionId' | 'tickLower' | 'tickUpper' | 'size'
>;

const BuyPositions = ({
  buyPositions,
}: {
  buyPositions: ClammBuyPosition[] | undefined;
}) => {
  const { clammMarkPrice, optionPoolsContract } = useBoundStore();
  const [selectedPosition, setSelectedPosition] =
    useState<ExercisePositionProps>();

  const { config: exerciseOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionPoolsContract,
    functionName: 'exerciseOption',
    args: [
      {
        optionId: BigInt(selectedPosition?.optionId || '0x0'),
        pool: MARKETS['ARB-USDC'].uniswapPoolAddress,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        amountToExercise: parseEther((selectedPosition?.size || 0).toString()),
      },
    ],
  });
  const { write: exerciseOption } = useContractWrite(exerciseOptionConfig);

  const handleExercise = useCallback(
    (index: number) => {
      if (!buyPositions) return;
      setSelectedPosition({
        tickLower: buyPositions[index].tickLower,
        tickUpper: buyPositions[index].tickUpper,
        size: buyPositions[index].size,
        optionId: buyPositions[index].optionId,
      });
      exerciseOption?.();
    },
    [exerciseOption, buyPositions],
  );

  const positions: BuyPositionData[] = useMemo(() => {
    if (!buyPositions) return [];

    return buyPositions.map((position: ClammBuyPosition, index: number) => {
      return {
        strikeSymbol: position.strikeSymbol,
        strike: formatAmount(position.strike, 3),
        size: formatAmount(Number(position.size)),
        isPut: position.isPut,
        expiry: Date.now(),
        pnlAndPrice: {
          pnl: computeOptionPnl({
            side: position.isPut ? 'put' : 'call',
            strike: position.strike,
            size: position.size,
            price: clammMarkPrice,
          }),
          price: clammMarkPrice,
          tokenSymbol: position.strikeSymbol.split('-')[0],
        },
        button: {
          handleExercise: () => handleExercise(index),
          id: index,
        },
      };
    });
  }, [buyPositions, clammMarkPrice, handleExercise]);

  return (
    <div className="space-y-2">
      <TableLayout<BuyPositionData>
        data={positions}
        columns={columns}
        rowSpacing={2}
        isContentLoading={false}
      />
    </div>
  );
};

export default BuyPositions;
