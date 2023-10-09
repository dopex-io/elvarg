import React, { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import {
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';

import { useBoundStore } from 'store';

import useShare from 'hooks/useShare';

import TableLayout from 'components/common/TableLayout';

import parseOptionsExercises from 'utils/clamm/parseOptionsExercises';
import getUserOptionsExercises from 'utils/clamm/subgraph/getUserOptionsExercises';
import { formatAmount, getExplorerTxURL } from 'utils/general';
import getPercentageDifference from 'utils/math/getPercentageDifference';

type ExerciseHistory = {
  timestamp: number;
  side: string;
  strike: string;
  options: {
    amount: string;
    symbol: string;
  };
  profit: {
    amount: string;
    symbol: string;
  };
  actions: {
    txHash: string;
    share: {
      shareDetails: any;
      openShare: (args: any) => void;
    };
  };
};

const ExerciseHistory = () => {
  const { userAddress, optionsPool, chainId, keys } = useBoundStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const share = useShare((state) => state.open);

  const handleShare = useCallback(
    (details: any) => {
      const { strikePrice, exercisePrice, options, side } = details;

      share({
        title: `${options.amount}x ${options.symbol} ${side}`,
        percentage: details.percentageDifference,
        customPath: '/clamm',
        stats: [
          { name: 'Strike Price', value: strikePrice.toFixed(5) },
          { name: 'Exercise price', value: exercisePrice.toFixed(5) },
        ],
      });
    },
    [share],
  );

  const columnHelper = createColumnHelper<ExerciseHistory>();

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
    columnHelper.accessor('profit', {
      header: 'Profit',
      cell: (info) => (
        <span className="flex space-x-2 text-left">
          <p className="text-up-only inline-block">{info.getValue().amount}</p>
          <p className="text-stieglitz inline-block">
            {info.getValue().symbol}
          </p>
        </span>
      ),
    }),
    columnHelper.accessor('timestamp', {
      header: 'Exercised',
      cell: (info) => (
        <span className="space-x-2 text-left">
          <p className="text-stieglitz inline-block">
            {formatDistance(info.getValue() * 1000, new Date().getTime())} ago
          </p>
        </span>
      ),
    }),
    columnHelper.accessor('actions', {
      header: '',
      cell: (info) => (
        <span className="flex items-center justify-end space-x-4 text-right text-sm">
          <button
            onClick={() =>
              info
                .getValue()
                .share.openShare(info.getValue().share.shareDetails)
            }
          >
            <ShareIcon
              className="text-stieglitz hover:text-white"
              height={'20px'}
            />
          </button>
          <a href={info.getValue().txHash} role="link" target="_blank">
            <ArrowTopRightOnSquareIcon
              className="text-stieglitz hover:text-white"
              height={'20px'}
            />
          </a>
        </span>
      ),
    }),
  ];

  const getExerciseHistory = useCallback(async () => {
    if (!userAddress || !optionsPool) return;

    const {
      token0Decimals,
      token1Decimals,
      inversePrice,
      uniswapV3PoolAddress,
    } = optionsPool;

    setLoading(true);
    try {
      const exerciseHistoryRaw = await getUserOptionsExercises(
        uniswapV3PoolAddress,
        userAddress,
      );

      const parsedHistory = exerciseHistoryRaw.map((position) =>
        parseOptionsExercises(
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          position,
        ),
      );

      const readableHistory = parsedHistory.map(
        ({
          amounts,
          isPut,
          profit,
          strike,
          timestamp,
          txHash,
          exercisePrice,
        }) => {
          const decimals =
            optionsPool[
              !isPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
            ];
          const optionsAmount = formatUnits(
            amounts[!isPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
            decimals,
          );

          const pnlParsed = formatUnits(
            profit,
            optionsPool[
              isPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
            ],
          );

          return {
            timestamp,
            side: isPut ? 'Put' : 'Call',
            strike: strike.toFixed(5),
            options: {
              amount: formatAmount(optionsAmount, 5),
              symbol:
                optionsPool[
                  !isPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
                ],
            },
            profit: {
              amount: Number(pnlParsed).toFixed(5),
              symbol:
                optionsPool[
                  isPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
                ],
            },
            actions: {
              txHash: getExplorerTxURL(chainId, txHash),
              share: {
                shareDetails: {
                  percentageDifference: getPercentageDifference(
                    isPut ? strike : exercisePrice,
                    isPut ? exercisePrice : strike,
                  ),
                  strikePrice: strike,
                  exercisePrice,
                  side: isPut ? 'Put' : 'Call',
                  options: {
                    amount: formatAmount(optionsAmount, 5),
                    symbol: optionsPool[keys.callAssetSymbolKey],
                  },
                },
                openShare: handleShare,
              },
            },
          };
        },
      );

      setHistory(readableHistory.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, [
    handleShare,
    optionsPool,
    userAddress,
    chainId,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
  ]);

  useEffect(() => {
    getExerciseHistory();
  }, [getExerciseHistory]);

  return (
    <div className="space-y-2">
      <TableLayout<ExerciseHistory>
        data={history}
        columns={columns}
        rowSpacing={3}
        isContentLoading={loading}
      />
    </div>
  );
};

export default ExerciseHistory;
