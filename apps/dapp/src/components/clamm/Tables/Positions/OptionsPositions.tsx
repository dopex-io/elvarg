import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import parseOptionsPosition from 'utils/clamm/parseOptionsPosition';
import getUserOptionsPositions from 'utils/clamm/subgraph/getUserOptionsPositions';
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
  premium: {
    amount: string;
    symbol: string;
  };
  side: string;
  exercisableAmount: bigint;
  expiry: number;
  button: {
    handleExercise: (index: number) => void;
    id: number;
    disabled: boolean;
  };
}

type ExercisePositionProps = {
  pool: Address;
  tickLower: number;
  tickUpper: number;
  expiry: bigint;
  callOrPut: boolean;
  amountToExercise: bigint;
};

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
  columnHelper.accessor('premium', {
    header: 'premium',
    cell: (info) => {
      const { amount, symbol } = info.getValue();
      return (
        <p>
          {Number(amount).toFixed(5)}{' '}
          <span className="text-stieglitz">{symbol}</span>
        </p>
      );
    },
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

const OptionsPositions = () => {
  const { optionsPool, loading, keys, userClammPositions, markPrice } =
    useBoundStore();

  const [exerciseParams, setExerciseParams] = useState<ExercisePositionProps>({
    pool: zeroAddress,
    tickLower: 0,
    tickUpper: 0,
    amountToExercise: 0n,
    callOrPut: false,
    expiry: 0n,
  });

  const { config } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionsPool?.address ?? zeroAddress,
    functionName: 'exerciseOptionRoll',
    args: [exerciseParams],
  });

  const { write } = useContractWrite(config);

  const positions = useMemo(() => {
    if (!optionsPool) return [];

    return userClammPositions.optionsPositions.map(
      (
        {
          amounts,
          callOrPut,
          exercisableAmount,
          expiry,
          premium,
          tickLower,
          tickLowerPrice,
          tickUpper,
          tickUpperPrice,
        },
        index,
      ) => {
        const sizeAmount = formatUnits(
          amounts[callOrPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
          optionsPool[
            callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
          ],
        );
        let size = {
          amount: sizeAmount,
          symbol:
            optionsPool[
              callOrPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
            ],
        };

        let _pnl =
          (callOrPut
            ? markPrice - tickUpperPrice
            : tickLowerPrice - markPrice) * Number(sizeAmount);

        let usdValue = _pnl;
        _pnl = callOrPut ? _pnl : _pnl / markPrice;

        if (_pnl < 0) {
          _pnl = 0;
          usdValue = 0;
        }

        const pnl = {
          amount: _pnl.toString(),
          symbol:
            optionsPool[
              callOrPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
            ],
          usdValue: usdValue,
        };

        return {
          tickLower,
          tickUpper,
          pnl,
          strike: callOrPut ? tickUpperPrice : tickLowerPrice,
          side: callOrPut ? 'Call' : 'Put',
          size,
          expiry,
          exercisableAmount,
          premium: {
            amount: formatUnits(
              premium,
              optionsPool[
                callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
              ],
            ),
            symbol:
              optionsPool[
                callOrPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
              ],
          },
          button: {
            handleExercise: () => {
              setExerciseParams({
                pool: optionsPool.uniswapV3PoolAddress,
                tickLower,
                tickUpper,
                callOrPut,
                amountToExercise: exercisableAmount,
                expiry: BigInt(expiry),
              });

              if (write) {
                write();
              }
            },
            id: index,
            disabled:
              expiry < Number(new Date().getTime()) / 1000 ||
              pnl.usdValue === 0,
          },
        };
      },
    );
  }, [
    write,
    markPrice,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    optionsPool,
    userClammPositions.optionsPositions,
  ]);

  return (
    <div className="space-y-2">
      <TableLayout<OptionsPositionTablesData>
        data={positions}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading.optionsPositions}
      />
    </div>
  );
};

export default OptionsPositions;
