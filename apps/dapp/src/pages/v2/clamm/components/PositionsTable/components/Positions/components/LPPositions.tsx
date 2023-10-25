import React, { useMemo } from 'react';

import { Checkbox } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { createColumnHelper } from '@tanstack/react-table';

import TableLayout from 'components/common/TableLayout';

import { formatAmount } from 'utils/general';

type LPPositionItem = LPPosition & {
  select: {
    handleSelect: Function;
    disabled: boolean;
  };
};

export type LPPosition = {
  strike: number;
  size: {
    callTokenAmount: number;
    putTokenAmount: number;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  withdrawable: {
    callTokenAmount: number;
    putTokenAmount: number;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  earned: {
    callTokenAmount: number;
    putTokenAmount: number;
    callTokenSymbol: number;
    putTokenSymbol: number;
  };
};

const columnHelper = createColumnHelper<LPPositionItem>();

const columns = [
  columnHelper.accessor('strike', {
    header: 'Strike Price',
    cell: (info) => (
      <span className="flex space-x-2 text-left items-center justify-start">
        <Checkbox className="text-mineshaft" size="small" />
        <p className="text-stieglitz inline-block">$</p>
        <p className="inline-block">{info.getValue().toFixed(5)}</p>
      </span>
    ),
  }),
  columnHelper.accessor('size', {
    header: 'Size',
    cell: (info) => {
      const {
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();

      return (
        <div className="flex flex-col items-start justify-center">
          {Number(callTokenAmount) !== 0 && (
            <span>
              {formatAmount(callTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{callTokenSymbol}</span>
            </span>
          )}
          {Number(putTokenAmount) !== 0 && (
            <span>
              {formatAmount(putTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{putTokenSymbol}</span>
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
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {Number(callTokenAmount) !== 0 && (
            <span>
              {formatAmount(callTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{callTokenSymbol}</span>
            </span>
          )}
          {Number(putTokenAmount) !== 0 && (
            <span>
              {formatAmount(putTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{putTokenSymbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('withdrawable', {
    header: 'Withdrawable',
    cell: (info) => {
      const {
        callTokenAmount,
        putTokenAmount,
        callTokenSymbol,
        putTokenSymbol,
      } = info.getValue();
      return (
        <div className="flex flex-col items-start justify-center">
          {Number(callTokenAmount) !== 0 && (
            <span>
              {formatAmount(callTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{callTokenSymbol}</span>
            </span>
          )}
          {Number(putTokenAmount) !== 0 && (
            <span>
              {formatAmount(putTokenAmount, 5)}{' '}
              <span className="text-stieglitz">{putTokenSymbol}</span>
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('select', {
    header: '',
    cell: (info) => {
      return <Button>Withdraw</Button>;
    },
  }),
];

const LPPositions = ({ positions }: { positions: LPPosition[] }) => {
  const lpPositions = useMemo(() => {
    console.log(positions);
    return positions.map(({ earned, size, strike, withdrawable }) => {
      return {
        earned,
        size,
        strike,
        withdrawable,
        select: {
          handleSelect: () => {},
          disabled: true,
        },
      };
    });
  }, [positions]);
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
