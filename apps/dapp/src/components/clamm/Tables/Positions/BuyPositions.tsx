import { useCallback, useMemo, useState } from 'react';

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

interface BuyPositionData {
  strikeSymbol: string;
  strike: string;
  size: string;
  isPut: boolean;
  pnl: string;
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
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => (
      <>
        <span className="space-x-2">
          <p className="text-stieglitz inline-block">$</p>
          {Number(info.getValue()) >= 0 ? (
            <p className="text-up-only inline-block">{info.getValue()}</p>
          ) : (
            <p className="text-down-bad inline-block">{info.getValue()}</p>
          )}
        </span>
        <p className="text-stieglitz">0.21 ETH</p>
      </>
    ),
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
  buyPositions: ClammBuyPosition[];
}) => {
  const { clammMarkPrice, uniswapPoolContract, optionPoolsContract } =
    useBoundStore();
  const [selectedPosition, setSelectedPosition] =
    useState<ExercisePositionProps>();

  const { config: exerciseOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionPoolsContract,
    functionName: 'exerciseOption',
    args: [
      {
        optionId: BigInt(selectedPosition?.optionId || '0x0'),
        pool: uniswapPoolContract,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        amountToExercise: BigInt(selectedPosition?.size || 0),
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

  const positions: BuyPositionData[] = useMemo(
    () =>
      buyPositions.map((position: ClammBuyPosition, index: number) => {
        return {
          strikeSymbol: position.strikeSymbol,
          strike: formatAmount(position.strike, 3),
          size: formatAmount(Number(position.size)),
          isPut: position.isPut,
          expiry: Date.now(),
          pnl: formatAmount(
            computeOptionPnl({
              side: position.isPut ? 'put' : 'call',
              strike: position.strike,
              size: position.size,
              price: clammMarkPrice,
            }),
            3,
          ),
          button: {
            handleExercise: () => handleExercise(index),
            id: index,
          },
        };
      }),
    [buyPositions, clammMarkPrice, handleExercise],
  );

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
