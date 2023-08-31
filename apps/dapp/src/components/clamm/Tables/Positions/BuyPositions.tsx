import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

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

import { DECIMALS_STRIKE } from 'constants/index';

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

const BuyPositions = ({
  buyPositions,
}: {
  buyPositions: ClammBuyPosition[];
}) => {
  const { clammMarkPrice, uniswapPoolContract, optionPoolsContract } =
    useBoundStore();

  // uint256 optionId;
  // IUniswapV3Pool pool;
  // int24 tickLower;
  // int24 tickUpper;
  // uint256 amountToExercise;
  const tickLower = 2299; // TODO: any decimals?
  const tickUpper = 2302;
  const amountToExercise = 0;
  const optionId = 0;
  const { config: exerciseOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionPoolsContract,
    functionName: 'exerciseOption',
    args: [
      {
        optionId: BigInt(optionId),
        pool: uniswapPoolContract,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amountToExercise: BigInt(amountToExercise),
      },
    ],
  });
  const { write: exerciseOption } = useContractWrite(exerciseOptionConfig);

  const handleExercise = useCallback(
    (index: number) => {
      exerciseOption?.();
    },
    [exerciseOption],
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
