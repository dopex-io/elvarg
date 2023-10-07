import React, { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import parseWritePositionBurn from 'utils/clamm/parseWritePositionBurn';
import getUserWritePositionMints from 'utils/clamm/subgraph/getUserWritePositionMints';
import { formatAmount, getExplorerTxURL } from 'utils/general';

type DepositHistory = {
  strike: string;
  side: string;
  liquidity: {
    callAssetAmount: string;
    callAssetSymbol: string;
    putAssetAmount: string;
    putAssetSymbol: string;
  };
  timestamp: number;
  tx: string;
};

const DepositHistory = () => {
  const { userAddress, optionsPool, keys, chainId } = useBoundStore();
  const [history, setHistory] = useState<DepositHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columnHelper = createColumnHelper<DepositHistory>();

  const columns = [
    columnHelper.accessor('strike', {
      header: 'Strike',
      cell: (info) => (
        <span className="space-x-2 text-left">
          <p className="text-stieglitz inline-block">$</p>
          <p className="inline-block">{info.getValue()}</p>
        </span>
      ),
    }),
    columnHelper.accessor('liquidity', {
      header: 'Amounts',
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
      cell: (info) => (
        <span className="space-x-2 text-left">
          <p className="text-stieglitz inline-block">{info.getValue()}</p>
        </span>
      ),
    }),
    columnHelper.accessor('timestamp', {
      header: 'Withdrawn',
      cell: (info) => (
        <span className="space-x-2 text-left">
          <p className="text-stieglitz inline-block">
            {formatDistance(info.getValue() * 1000, new Date().getTime())} ago
          </p>
        </span>
      ),
    }),
    columnHelper.accessor('tx', {
      header: 'Transaction',
      cell: (info) => (
        <span className="flex items-center justify-end space-x-2 text-right text-sm">
          <a href={info.getValue()} role="link">
            <ArrowTopRightOnSquareIcon
              className="text-stieglitz hover:text-white"
              height={'20px'}
            />
          </a>
        </span>
      ),
    }),
  ];

  const getDepositHistory = useCallback(async () => {
    if (!optionsPool || !userAddress) return;
    const {
      token0Decimals,
      token1Decimals,
      inversePrice,
      uniswapV3PoolAddress,
    } = optionsPool;
    setLoading(true);
    try {
      const depositHistoryRaw = await getUserWritePositionMints(
        uniswapV3PoolAddress,
        userAddress,
      );
      const parsedHistory = depositHistoryRaw.map((position) =>
        parseWritePositionBurn(
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          position,
        ),
      );

      const readableHistory = parsedHistory.map(
        ({ strike, liquidity, timestamp, txHash }) => {
          const callAssetAmount = formatUnits(
            liquidity[keys.callAssetAmountKey],
            optionsPool[keys.callAssetDecimalsKey],
          );

          const putAssetAmount = formatUnits(
            liquidity[keys.putAssetAmountKey],
            optionsPool[keys.putAssetDecimalsKey],
          );

          let side = 'Neutral';
          if (Number(callAssetAmount) > 0 && Number(putAssetAmount) === 0) {
            side = 'Call';
          }

          if (Number(putAssetAmount) > 0 && Number(callAssetAmount) === 0) {
            side = 'Put';
          }
          return {
            strike: strike.toFixed(5),
            side,
            liquidity: {
              callAssetAmount,
              callAssetSymbol: optionsPool[keys.callAssetSymbolKey],
              putAssetAmount,
              putAssetSymbol: optionsPool[keys.putAssetSymbolKey],
            },
            timestamp,
            tx: getExplorerTxURL(chainId, txHash),
          };
        },
      );

      setHistory(readableHistory);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [
    chainId,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    optionsPool,
    userAddress,
  ]);

  useEffect(() => {
    getDepositHistory();
  }, [getDepositHistory]);
  return (
    <div className="space-y-2">
      <TableLayout<DepositHistory>
        data={history}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading}
      />
    </div>
  );
};

export default DepositHistory;
