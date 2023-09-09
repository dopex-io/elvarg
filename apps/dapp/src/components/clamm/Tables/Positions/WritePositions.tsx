import { useCallback, useMemo, useState } from 'react';
import { zeroAddress } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type WritePositionData = {
  button: {
    handleBurn: (index: number) => void;
    id: number;
    disabled: boolean;
  };
} & WritePositionForTable;

type WritePositionForTable = {
  tickLower: number;
  tickUpper: number;
  side: string;
  shares: bigint;
  size: {
    callAssetAmount: string;
    putAssetAmount: string;
    callAssetSymbol: string;
    putAssetSymbol: string;
  };
  earned: {
    callAssetAmount: string;
    putAssetAmount: string;
    callAssetSymbol: string;
    putAssetSymbol: string;
  };
  strike: number;
};

const columnHelper = createColumnHelper<WritePositionData>();

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
    cell: (info) => {
      const {
        callAssetAmount,
        putAssetAmount,
        callAssetSymbol,
        putAssetSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {Number(callAssetAmount) !== 0 && (
            <span>
              {formatAmount(callAssetAmount, 5)}{' '}
              <span className="text-stieglitz">{callAssetSymbol}</span>
            </span>
          )}
          {Number(putAssetAmount) !== 0 && (
            <span>
              {formatAmount(putAssetAmount, 5)}{' '}
              <span className="text-stieglitz">{putAssetSymbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('side', {
    header: 'Side',
    cell: (info) => <p>{info.getValue()}</p>,
  }),

  columnHelper.accessor('earned', {
    header: 'Earned',
    cell: (info) => {
      const {
        callAssetAmount,
        putAssetAmount,
        callAssetSymbol,
        putAssetSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {
            <span>
              {callAssetAmount}{' '}
              <span className="text-stieglitz">{callAssetSymbol}</span>
            </span>
          }
          <span>
            {putAssetAmount}{' '}
            <span className="text-stieglitz">{putAssetSymbol}</span>
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('button', {
    header: '',
    cell: (info) => {
      const { id, handleBurn, disabled } = info.getValue();
      return (
        <Button
          disabled={disabled}
          color={'primary'}
          onClick={() => handleBurn(id)}
        >
          Withdraw
        </Button>
      );
    },
  }),
];

type BurnPositionProps = {
  tickLower: number;
  tickUpper: number;
  shares: bigint;
};

const WritePositions = ({
  writePositions,
}: {
  writePositions: WritePositionForTable[];
}) => {
  const { positionManagerAddress, optionsPool } = useBoundStore();
  const [selectedPosition, setSelectedPosition] = useState<BurnPositionProps>();

  const { config: burnPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerAddress,
    functionName: 'burnPosition',
    args: [
      {
        pool: optionsPool?.uniswapV3PoolAddress ?? zeroAddress,
        tickLower: selectedPosition?.tickLower || 0,
        tickUpper: selectedPosition?.tickUpper || 0,
        shares: selectedPosition?.shares || 0n,
      },
    ],
  });
  const { write: burnPosition } = useContractWrite(burnPositionConfig);

  const handleBurn = useCallback(
    (index: number) => {
      if (!writePositions) return;
      setSelectedPosition({
        tickLower: writePositions[index].tickLower,
        tickUpper: writePositions[index].tickUpper,
        shares: BigInt(writePositions[index].shares),
      });
      burnPosition?.();
    },
    [burnPosition, writePositions],
  );

  const positions = useMemo(() => {
    return writePositions.map((position, index) => {
      return {
        ...position,
        button: {
          handleBurn,
          id: index,
          disabled: position.shares === 0n,
        },
      };
    });
  }, [writePositions, handleBurn]);

  return (
    <div>
      <TableLayout<WritePositionData>
        data={positions}
        columns={columns}
        rowSpacing={2}
        isContentLoading={false}
      />
    </div>
  );
};

export default WritePositions;
