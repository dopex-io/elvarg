import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import wagmiConfig from 'wagmi-config';
import { writeContract } from 'wagmi/actions';

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
  withdrawable: {
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
      <span className="flex space-x-2 text-left items-start justify-start">
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
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
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

const WritePositions = () => {
  const {
    userAddress,
    positionManagerAddress,
    optionsPool,
    loading,
    userClammPositions,
    keys,
    fullReload,
  } = useBoundStore();

  const handleBurn = useCallback(
    async (tickLower: number, tickUpper: number, shares: bigint) => {
      if (!optionsPool) return;
      const { request } = await wagmiConfig.publicClient.simulateContract({
        address: positionManagerAddress,
        abi: PositionsManager__factory.abi,
        functionName: 'burnPosition',
        args: [
          {
            pool: optionsPool.uniswapV3PoolAddress,
            tickLower: tickLower,
            tickUpper: tickUpper,
            shares: shares,
          },
        ],
        account: userAddress,
      });

      const { hash } = await writeContract(request);

      await wagmiConfig.publicClient.waitForTransactionReceipt({
        hash,
      });
      await fullReload();
    },
    [optionsPool, userAddress, positionManagerAddress, fullReload],
  );

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
            withdrawableLiquidity,
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

          const withdrawable = {
            callAssetAmount: formatUnits(
              withdrawableLiquidity[keys.callAssetAmountKey],
              optionsPool[keys.callAssetDecimalsKey],
            ),
            putAssetAmount: formatUnits(
              withdrawableLiquidity[keys.putAssetAmountKey],
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
            withdrawable,
            tickLower,
            tickUpper,
            side,
            shares,
            size: sizeAmounts,
            earned: earnedAmounts,
            strike: side == 'Put' ? tickLowerPrice : tickUpperPrice,
            button: {
              handleBurn: () => {
                handleBurn(tickLower, tickUpper, shares - 1n);
              },
              id: index,
              disabled: shares < 2n,
            },
          };
        },
      )
      .filter((position) => position.shares > 1n);
  }, [
    handleBurn,
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
