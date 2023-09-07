import { useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { format, formatDistance } from 'date-fns';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';
import { OptionsPosition } from 'store/Vault/clamm';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';
import computeOptionPnl from 'utils/math/computeOptionPnl';

import { MARKETS } from 'constants/clamm/markets';

interface OptionsPositionTablesData {
  strike: string;
  size: string;
  side: string;
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

const columnHelper = createColumnHelper<OptionsPositionTablesData>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="space-x-2 text-left">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{formatAmount(info.getValue(), 5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => <p>{formatAmount(info.getValue(), 5)}</p>,
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
  columnHelper.accessor('pnlAndPrice', {
    header: 'PnL',
    cell: (info) => {
      const value = info.getValue();
      const usdPrice = formatAmount(value.price * value.pnl, 3);

      return (
        <>
          <span className="space-x-2">
            <p className="text-stieglitz inline-block">$</p>
            {Number(usdPrice) === 0 && (
              <p className="text-stieglitz inline-block">{usdPrice}</p>
            )}
            {Number(usdPrice) > 0 && (
              <p className="text-up-only inline-block">{usdPrice}</p>
            )}
            {Number(usdPrice) < 0 && (
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

type ExercisePositionProps = {
  tickLower: number;
  tickUpper: number;
  expiry: bigint;
  callOrPut: boolean;
  amountToExercise: bigint;
};

const OptionsPositions = ({
  optionsPositions,
}: {
  optionsPositions: OptionsPosition[] | undefined;
}) => {
  const { tokenPrices, selectedUniswapPool } = useBoundStore();
  const clammMarkPrice =
    tokenPrices.find(
      ({ name }) =>
        name.toLowerCase() ===
        selectedUniswapPool.underlyingTokenSymbol.toLowerCase(),
    )?.price ?? 0;

  const [selectedPosition, setSelectedPosition] =
    useState<ExercisePositionProps>();

  const { config: exerciseOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: selectedUniswapPool.optionPool,
    functionName: 'exerciseOptionRoll',
    args: [
      {
        pool: MARKETS['ARB-USDC'].uniswapPoolAddress,
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
        callOrPut: optionsPositions[index].callOrPut,
        amountToExercise: optionsPositions[index].amount.contractReadable,
      });
      exerciseOption?.();
    },
    [exerciseOption, optionsPositions],
  );

  const positions: OptionsPositionTablesData[] = useMemo(() => {
    if (!optionsPositions || optionsPositions.length === 0) return [];

    return optionsPositions.map((position, index) => {
      return {
        strike: position.strike,
        size: position.amount.userReadable,
        side: position.callOrPut ? 'Call' : 'Put',
        pnlAndPrice: {
          pnl: computeOptionPnl({
            side: position.callOrPut ? 'call' : 'put',
            strike: Number(position.strike),
            size: Number(position.amount.userReadable),
            price: clammMarkPrice,
          }),
          price: clammMarkPrice,
          tokenSymbol: position.callOrPut
            ? selectedUniswapPool.underlyingTokenSymbol
            : selectedUniswapPool.collateralTokenSymbol,
        },
        expiry: position.expiry,
        button: {
          handleExercise: () => handleExercise(index),
          id: index,
        },
      };
    });
  }, [
    optionsPositions,
    clammMarkPrice,
    handleExercise,
    selectedUniswapPool.collateralTokenSymbol,
    selectedUniswapPool.underlyingTokenSymbol,
  ]);

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
