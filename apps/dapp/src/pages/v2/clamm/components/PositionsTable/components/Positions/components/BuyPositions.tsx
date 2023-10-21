import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import { formatAmount } from 'utils/general';

type BuyPositionItem = {
  strike: number;
  size: {
    amount: number;
    symbol: string;
    usdValue: number;
  };
  profit: {
    amount: number;
    symbol: number;
    usdValue: number;
    percentage: number;
  };
  expiry: number;
  button: {
    meta: any;
    loading: boolean;
    disabled: boolean;
  };
};

const columnHelper = createColumnHelper<BuyPositionItem>();
const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <div className="flex space-x-2 text-left">
        <span className="text-stieglitz inline-block">$</span>
        <span className="inline-block">{info.getValue().toFixed(5)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => (
      <div className="flex space-x-2 text-left">
        <span>{formatAmount(info.getValue().amount, 5)}</span>
        <span className="text-stieglitz">{info.getValue().symbol}</span>
      </div>
    ),
  }),
  //   columnHelper.accessor('expiry', {
  //     header: 'Expiry',
  //     cell: (info) => (
  //       <span className=" overflow-hidden whitespace-nowrap">
  //         {formatDistance(Number(info.getValue()) * 1000, new Date())}{' '}
  //         {Number(info.getValue()) * 1000 < new Date().getTime() && 'ago'}
  //       </span>
  //     ),
  //   }),
  //   columnHelper.accessor('side', {
  //     header: 'Side',
  //     cell: (info) => <p>{info.getValue()}</p>,
  //   }),
  //   columnHelper.accessor('premium', {
  //     header: 'premium',
  //     cell: (info) => {
  //       const { amount, symbol } = info.getValue();
  //       return (
  //         <p>
  //           {Number(amount).toFixed(5)}{' '}
  //           <span className="text-stieglitz">{symbol}</span>
  //         </p>
  //       );
  //     },
  //   }),
  //   columnHelper.accessor('pnl', {
  //     header: 'PnL',
  //     cell: (info) => {
  //       let { amount, usdValue, symbol } = info.getValue();
  //       const amountInNumber = Number(amount);

  //       return (
  //         <>
  //           <span className="space-x-2">
  //             {Number(amountInNumber) === 0 && (
  //               <p className="text-stieglitz inline-block">
  //                 {formatAmount(amountInNumber, 5)}
  //               </p>
  //             )}
  //             {Number(amountInNumber) > 0 && (
  //               <p className="text-up-only inline-block">
  //                 {formatAmount(amountInNumber, 5)}
  //               </p>
  //             )}
  //             {Number(amountInNumber) < 0 && (
  //               <p className="text-down-bad inline-block">
  //                 {formatAmount(amountInNumber, 5)}
  //               </p>
  //             )}
  //             <p className="text-stieglitz inline-block">{symbol}</p>
  //           </span>
  //           {/* <p className="text-stieglitz">${formatAmount(usdValue, 5)}</p> */}
  //         </>
  //       );
  //     },
  //   }),
  //   columnHelper.accessor('button', {
  //     header: '',
  //     cell: (info) => {
  //       const { id, handleExercise, disabled } = info.getValue();
  //       return (
  //         <Button disabled={disabled} onClick={() => handleExercise(id)}>
  //           Exercise
  //         </Button>
  //       );
  //     },
  //   }),
];

// Calculate PNL Helper
const BuyPositions = () => {
  const handleExercise = useCallback(async () => {}, []);
  return <div>BuyPositions</div>;
};

export default BuyPositions;
