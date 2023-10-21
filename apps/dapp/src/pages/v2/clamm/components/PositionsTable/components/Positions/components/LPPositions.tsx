import React, { useMemo } from 'react';

import { Checkbox } from '@mui/material';

import { createColumnHelper } from '@tanstack/react-table';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type LPPositionItem = {
  strike: number;
  size: {
    callAssetAmount: number;
    putAssetAmount: number;
    callAssetSymbol: string;
    putAssetSymbol: string;
  };
  withdrawable: {
    callAssetAmount: number;
    putAssetAmount: number;
    callAssetSymbol: string;
    putAssetSymbol: string;
  };
  earned: {
    callAssetAmount: number;
    putAssetAmount: number;
    callAssetSymbol: string;
    putAssetSymbol: string;
  };
  select: {
    handleSelect: Function;
    disabled: boolean;
  };
};

const columnHelper = createColumnHelper<LPPositionItem>();

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
  columnHelper.accessor('select', {
    header: '',
    cell: (info) => {
      return <Checkbox className="text-mineshaft" size="small" />;
    },
  }),
];

const LPPositions = () => {
  const lpPositions = useMemo(() => {
    return [
      {
        strike: 1000,
        size: {
          callAssetAmount: 100231,
          putAssetAmount: 1231231,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        withdrawable: {
          callAssetAmount: 123123,
          putAssetAmount: 123123,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        earned: {
          callAssetAmount: 123123,
          putAssetAmount: 123123,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        select: {
          handleSelect: () => {},
          disabled: false,
        },
      },
      {
        strike: 1000,
        size: {
          callAssetAmount: 100231,
          putAssetAmount: 1231231,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        withdrawable: {
          callAssetAmount: 123123,
          putAssetAmount: 123123,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        earned: {
          callAssetAmount: 123123,
          putAssetAmount: 123123,
          callAssetSymbol: 'ARB',
          putAssetSymbol: 'USDC',
        },
        select: {
          handleSelect: () => {},
          disabled: true,
        },
      },
    ];
  }, []);
  return (
    <TableLayout<LPPositionItem>
      data={lpPositions}
      columns={columns}
      rowSpacing={3}
      isContentLoading={false}
      pageSize={10}
    />
  );
};

export default LPPositions;
