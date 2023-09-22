import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import parseWritePosition, {
  WritePosition,
} from 'utils/clamm/parseWritePosition';
import getUserWritePositions from 'utils/clamm/subgraph/getUserWritePositions';
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
      <span className="flex space-x-2 text-left">
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
          <div className="flex space-x-1">
            <span>{formatAmount(callAssetAmount, 5)}</span>
            <span className="text-stieglitz">{callAssetSymbol}</span>
          </div>
          <div className="flex space-x-1">
            <span>{formatAmount(putAssetAmount, 5)}</span>
            <span className="text-stieglitz">{putAssetSymbol}</span>
          </div>
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
  pool: Address;
  tickLower: number;
  tickUpper: number;
  shares: bigint;
};

const WritePositions = () => {
  const {
    positionManagerAddress,
    optionsPool,
    loading,
    userClammPositions,
    keys,
  } = useBoundStore();

  const [burnParams, setBurnParams] = useState<BurnPositionProps>({
    pool: zeroAddress,
    tickLower: 0,
    tickUpper: 0,
    shares: 0n,
  });

  const { config, isLoading } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerAddress,
    functionName: 'burnPosition',
    args: [burnParams],
  });

  const { write } = useContractWrite(config);

  const positions = useMemo(() => {
    if (!optionsPool) return [];

    return userClammPositions.writePositions
      .map(
        (
          {
            shares,
            earned,
            size,
            tickLower,
            tickUpper,
            tickLowerPrice,
            tickUpperPrice,
          },
          index,
        ) => {
          const sizeAmounts = {
            callAssetAmount: formatUnits(
              size[keys.callAssetAmountKey],
              optionsPool[keys.callAssetDecimalsKey],
            ),
            putAssetAmount: formatUnits(
              size[keys.putAssetAmountKey],
              optionsPool[keys.putAssetDecimalsKey],
            ),
            callAssetSymbol: optionsPool[keys.callAssetSymbolKey],
            putAssetSymbol: optionsPool[keys.putAssetSymbolKey],
          };

          const earnedAmounts = {
            callAssetAmount: formatUnits(
              earned[keys.callAssetAmountKey],
              optionsPool[keys.callAssetDecimalsKey],
            ),
            putAssetAmount: formatUnits(
              earned[keys.putAssetAmountKey],
              optionsPool[keys.putAssetDecimalsKey],
            ),
            callAssetSymbol: optionsPool[keys.callAssetSymbolKey],
            putAssetSymbol: optionsPool[keys.putAssetSymbolKey],
          };

          let side = '';
          if (optionsPool.inversePrice) {
            if (optionsPool.tick <= tickLower) {
              side = 'Put';
            } else if (optionsPool.tick >= tickUpper) {
              side = 'Call';
            } else {
              side = 'Neutral';
            }
          } else {
            if (optionsPool.tick <= tickLower) {
              side = 'Call';
            } else if (optionsPool.tick >= tickUpper) {
              side = 'Put';
            } else {
              side = 'Neutral';
            }
          }

          return {
            tickLower,
            tickUpper,
            side,
            shares,
            size: sizeAmounts,
            earned: earnedAmounts,
            strike: side == 'Put' ? tickLowerPrice : tickUpperPrice,
            button: {
              handleBurn: () => {
                setBurnParams({
                  pool: optionsPool.uniswapV3PoolAddress,
                  tickLower,
                  tickUpper,
                  shares: shares - 1n,
                });

                if (write) {
                  write();
                }
              },
              id: index,
              disabled: shares < 2n || isLoading,
            },
          };
        },
      )
      .filter((position) => position.shares > 1n);
  }, [
    isLoading,
    write,
    optionsPool,
    userClammPositions.writePositions,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
  ]);

  return (
    <div className="space-y-2">
      <TableLayout<WritePositionData>
        data={positions}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading.writePositions}
      />
    </div>
  );
};

export default WritePositions;
