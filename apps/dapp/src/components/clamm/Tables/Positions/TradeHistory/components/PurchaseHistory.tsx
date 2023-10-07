import React, { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import { useBoundStore } from 'store';

import TableLayout from 'components/common/TableLayout';

import parseOptionsPurchase from 'utils/clamm/parseOptionsPurchase';
import getUserOptionsPurchases from 'utils/clamm/subgraph/getUserOptionsPurchases';
import { formatAmount, getExplorerTxURL } from 'utils/general';

type PurchaseHistory = {
  strike: string;
  options: {
    amount: string;
    symbol: string;
  };
  premium: {
    amount: string;
    symbol: string;
  };
  timestamp: number;
  txHash: string;
  side: string;
};

const PurchaseHistory = () => {
  const { optionsPool, userAddress, keys, chainId } = useBoundStore();
  const [history, setHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columnHelper = createColumnHelper<PurchaseHistory>();

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
    columnHelper.accessor('options', {
      header: 'Options',
      cell: (info) => {
        const { amount, symbol } = info.getValue();
        return (
          <div className="flex flex-col items-start justify-center">
            <span>
              {amount} <span className="text-stieglitz">{symbol}</span>
            </span>
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
    columnHelper.accessor('premium', {
      header: 'Premium',
      cell: (info) => (
        <span className="flex space-x-2 text-left">
          <p className="text-white inline-block">{info.getValue().amount}</p>
          <p className="text-stieglitz inline-block">
            {info.getValue().symbol}
          </p>
        </span>
      ),
    }),
    columnHelper.accessor('timestamp', {
      header: 'Purchased',
      cell: (info) => (
        <span className="space-x-2 text-left">
          <p className="text-stieglitz inline-block">
            {formatDistance(info.getValue() * 1000, new Date().getTime())} ago
          </p>
        </span>
      ),
    }),
    columnHelper.accessor('txHash', {
      header: 'Transaction',
      cell: (info) => (
        <span className="flex items-center justify-end space-x-2 text-right text-sm">
          <a href={info.getValue()} role="link" target="_blank">
            <ArrowTopRightOnSquareIcon
              className="text-stieglitz hover:text-white"
              height={'20px'}
            />
          </a>
        </span>
      ),
    }),
  ];

  const getPurchaseHistory = useCallback(async () => {
    if (!optionsPool) return;

    setLoading(true);
    try {
      const {
        uniswapV3PoolAddress,
        inversePrice,
        token1Decimals,
        token0Decimals,
      } = optionsPool;
      const purchaseHistoryRaw = await getUserOptionsPurchases(
        uniswapV3PoolAddress,
        userAddress,
      );

      const parsedPurchaseHistory = purchaseHistoryRaw.map((position) =>
        parseOptionsPurchase(
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          position,
        ),
      );

      const readablePurchaseHistory = parsedPurchaseHistory.map(
        ({ amounts, strike, isPut, timestamp, txHash, premium }) => {
          const decimals =
            optionsPool[
              !isPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
            ];
          const optionsAmount = formatUnits(
            amounts[!isPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
            decimals,
          );

          const premiumParsed = formatUnits(premium, decimals);
          return {
            strike: strike.toFixed(5),
            options: {
              amount: formatAmount(optionsAmount, 5),
              symbol:
                optionsPool[
                  !isPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
                ],
            },
            premium: {
              amount: Number(premiumParsed).toFixed(5),
              symbol:
                optionsPool[
                  !isPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
                ],
            },
            timestamp,
            txHash: getExplorerTxURL(chainId, txHash),
            side: isPut ? 'Put' : 'Call',
          };
        },
      );
      setHistory(
        readablePurchaseHistory.sort((a, b) => b.timestamp - a.timestamp),
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, [
    chainId,
    optionsPool,
    userAddress,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
  ]);

  useEffect(() => {
    getPurchaseHistory();
  }, [getPurchaseHistory]);

  return (
    <div className="space-y-2">
      <TableLayout<PurchaseHistory>
        data={history}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading}
      />
    </div>
  );
};

export default PurchaseHistory;
