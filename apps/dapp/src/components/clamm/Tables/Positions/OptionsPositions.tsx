import { useCallback, useMemo, useState } from 'react';
import { zeroAddress } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

interface OptionsPositionTablesData {
  tickLower: number;
  tickUpper: number;
  strike: number;
  size: {
    amount: string;
    symbol: string;
  };
  pnl: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  side: string;
  exercisableAmount: bigint;
  expiry: number;
  exercised: boolean;
  button: {
    handleExercise: (index: number) => void;
    id: number;
    disabled: boolean;
  };
}

const columnHelper = createColumnHelper<OptionsPositionTablesData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <p>
        {formatAmount(info.getValue().amount, 5)}{' '}
        <span className="text-stieglitz">{info.getValue().symbol}</span>
      </p>
    ),
  }),
  columnHelper.accessor('expiry', {
    header: 'Expiry',
    cell: (info) => (
      <p className="overflow-hidden whitespace-nowrap">
        {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
        {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
      </p>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('pnl', {
    header: 'PnL',
    cell: (info) => {
      let { amount, usdValue, symbol } = info.getValue();
      const amountInNumber = Number(amount);

      return (
        <>
          <span className="space-x-2">
            {Number(amountInNumber) === 0 && (
              <p className="text-stieglitz inline-block">
                {formatAmount(amountInNumber, 5)}
              </p>
            )}
            {Number(amountInNumber) > 0 && (
              <p className="text-up-only inline-block">
                {formatAmount(amountInNumber, 5)}
              </p>
            )}
            {Number(amountInNumber) < 0 && (
              <p className="text-down-bad inline-block">
                {formatAmount(amountInNumber, 5)}
              </p>
            )}
            <p className="text-stieglitz inline-block">{symbol}</p>
          </span>
          {/* <p className="text-stieglitz">${formatAmount(usdValue, 5)}</p> */}
        </>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const { id, handleExercise, disabled } = info.getValue();
      return (
        <Button disabled={disabled} onClick={() => handleExercise(id)}>
          Exercise
        </Button>
      );
    },
  }),
];

type ExercisePositionProps = {
  tickLower: number;
  tickUpper: number;
  expiry: bigint;
  callOrPut: boolean;
  amountToExercise: bigint;
};

type OptionsPositionsForTable = {
  tickLower: number;
  tickUpper: number;
  strike: number;
  size: {
    amount: string;
    symbol: string;
  };
  pnl: {
    amount: string;
    symbol: string;
    usdValue: number;
  };
  side: string;
  exercisableAmount: bigint;
  expiry: number;
  exercised: boolean;
};

const OptionsPositions = ({
  optionsPositions,
}: {
  optionsPositions: OptionsPositionsForTable[];
}) => {
  const { optionsPool } = useBoundStore();

  const [selectedPosition, setSelectedPosition] =
    useState<ExercisePositionProps>();

  const { config: exerciseOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionsPool?.address ?? zeroAddress,
    functionName: 'exerciseOptionRoll',
    args: [
      {
        pool: optionsPool?.uniswapV3PoolAddress ?? zeroAddress,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        expiry: selectedPosition?.expiry || 0n,
        callOrPut: selectedPosition?.callOrPut || false,
        amountToExercise: selectedPosition?.amountToExercise || 0n,
      },
    ],
  });
  const { write: exerciseOption } = useContractWrite(exerciseOptionConfig);

  const handleExercise = useCallback(
    (index: number) => {
      if (!optionsPositions) return;

      setSelectedPosition({
        tickLower: optionsPositions[index].tickLower,
        tickUpper: optionsPositions[index].tickUpper,
        expiry: BigInt(optionsPositions[index].expiry),
        callOrPut: optionsPositions[index].side === 'Call' ? true : false,
        amountToExercise: optionsPositions[index].exercisableAmount - 1n,
      });

      exerciseOption?.();
    },
    [exerciseOption, optionsPositions],
  );

  const positions: OptionsPositionTablesData[] = useMemo(() => {
    return optionsPositions.map((position, index) => ({
      ...position,
      button: {
        handleExercise,
        id: index,
        disabled:
          position.expiry < Number(new Date().getTime()) / 1000 ||
          position.pnl.usdValue === 0,
      },
    }));
  }, [handleExercise, optionsPositions]);

  return (
    <div className="space-y-2">
      <TableLayout<OptionsPositionTablesData>
        data={positions}
        columns={columns}
        rowSpacing={2}
        isContentLoading={false}
      />
    </div>
  );
};

export default OptionsPositions;
