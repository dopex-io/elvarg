import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { useBoundStore } from 'store';

import BgButtonGroup from 'components/clamm/AsidePanel/components/BgButtonGroup';
import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

import DepositHistory from './components/DepositHistory';
import ExerciseHistory from './components/ExerciseHistory';
import PurchaseHistory from './components/PurchaseHistory';
import WithdrawHistory from './components/WithdrawHistory';

type TradeHistoryData = {
  strike: number;
  side: string;
  size: {
    amount: string;
    symbol: string;
  };
  pnlOrPremium: {
    amount: string;
    symbol: string;
  };
  action: string;
  timestamp: number;
};

const columnHelper = createColumnHelper<TradeHistoryData>();
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: ({ getValue }) => (
      <div className="space-x-2 text-left flex items-center">
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{getValue().toFixed(5)}</p>
      </div>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: ({ getValue }) => (
      <div className="flex items-center space-x-2">
        <span>{formatAmount(getValue().amount, 5)} </span>
        <span className="text-stieglitz">{getValue().symbol}</span>
      </div>
    ),
  }),
  columnHelper.accessor('side', {
    header: 'side',
    cell: (info) => {
      return <p>{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor('action', {
    header: 'Action',
    cell: (info) => {
      return <p>{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor('pnlOrPremium', {
    header: 'Pnl / Premium',
    cell: ({ getValue }) => (
      <div className="flex items-center space-x-2">
        <span>{formatAmount(getValue().amount, 5)} </span>
        <span className="text-stieglitz">{getValue().symbol}</span>
      </div>
    ),
  }),
  columnHelper.accessor('timestamp', {
    header: 'Date',
    cell: (info) => (
      <p className="overflow-hidden whitespace-nowrap">
        {format(info.getValue() * 1000, 'dd LLL yyyy hh:mm:ss a')}
      </p>
    ),
  }),
];

const TradeHistory = () => {
  const { userClammPositions, loading, keys, optionsPool } = useBoundStore();

  // const history = useMemo(() => {
  //   if (!optionsPool) return [];

  //   const purchases = userClammPositions.optionsPurchases;
  //   const exercises = userClammPositions.optionsExercises;

  //   const exercisesParsed = exercises.map(
  //     ({
  //       amounts,
  //       callOrPut,
  //       premium,
  //       tickLowerPrice,
  //       tickUpperPrice,
  //       timestamp,
  //     }) => {
  //       const amount = formatUnits(
  //         amounts[callOrPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
  //         optionsPool[
  //           callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
  //         ],
  //       );

  //       const symbol =
  //         optionsPool[
  //           callOrPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
  //         ];

  //       const premiumParsed = formatUnits(
  //         premium,
  //         optionsPool[
  //           callOrPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
  //         ],
  //       );

  //       return {
  //         strike: callOrPut ? tickUpperPrice : tickLowerPrice,
  //         side: callOrPut ? 'Call' : 'Put',
  //         size: {
  //           amount: amount,
  //           symbol: symbol,
  //         },
  //         pnlOrPremium: {
  //           amount: premiumParsed,
  //           symbol:
  //             optionsPool[
  //               callOrPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
  //             ],
  //         },
  //         action: 'Exercise',
  //         timestamp,
  //       };
  //     },
  //   );

  //   const purchasesParsed = purchases.map(
  //     ({
  //       amounts,
  //       callOrPut,
  //       premium,
  //       tickLowerPrice,
  //       tickUpperPrice,
  //       timestamp,
  //     }) => {
  //       const amount = formatUnits(
  //         amounts[callOrPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
  //         optionsPool[
  //           callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
  //         ],
  //       );

  //       const symbol =
  //         optionsPool[
  //           callOrPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
  //         ];

  //       const premiumParsed = formatUnits(
  //         premium,
  //         optionsPool[
  //           callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
  //         ],
  //       );

  //       return {
  //         strike: callOrPut ? tickUpperPrice : tickLowerPrice,
  //         side: callOrPut ? 'Call' : 'Put',
  //         size: {
  //           amount: amount,
  //           symbol: symbol,
  //         },
  //         pnlOrPremium: {
  //           amount: premiumParsed,
  //           symbol: symbol,
  //         },
  //         action: 'Purchase',
  //         timestamp,
  //       };
  //     },
  //   );

  //   const history = exercisesParsed
  //     .concat(purchasesParsed)
  //     .sort((a, b) => b.timestamp - a.timestamp);

  //   return history;
  // }, [
  //   keys.callAssetAmountKey,
  //   keys.callAssetDecimalsKey,
  //   keys.callAssetSymbolKey,
  //   keys.putAssetAmountKey,
  //   keys.putAssetDecimalsKey,
  //   keys.putAssetSymbolKey,
  //   optionsPool,
  //   userClammPositions.optionsExercises,
  //   userClammPositions.optionsPurchases,
  // ]);

  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div className="space-y-2 flex flex-col w-full h-full bg-cod-gray p-2 rounded-lg">
      <div className="w-fit">
        <BgButtonGroup
          handleClick={setSelectedTab}
          active={selectedTab}
          labels={['Purchase', 'Exercise', 'Deposit', 'Withdraw']}
        />
      </div>
      {selectedTab === 0 && <PurchaseHistory />}
      {selectedTab === 1 && <ExerciseHistory />}
      {selectedTab === 2 && <DepositHistory />}
      {selectedTab === 3 && <WithdrawHistory />}
    </div>
  );
};

export default TradeHistory;
