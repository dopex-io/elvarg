import React, { useMemo } from 'react';
import { formatUnits } from 'viem';

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
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  withdrawable: {
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
  };
  earned: {
    callTokenAmount: string;
    putTokenAmount: string;
    callTokenSymbol: string;
    putTokenSymbol: string;
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
          <span>
            {formatAmount(callTokenAmount, 5)}{' '}
            <span className="text-stieglitz">{callTokenSymbol}</span>
          </span>
          <span>
            {formatAmount(putTokenAmount, 5)}{' '}
            <span className="text-stieglitz">{putTokenSymbol}</span>
          </span>
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
          <span>
            {formatAmount(callTokenAmount, 5)}{' '}
            <span className="text-stieglitz">{callTokenSymbol}</span>
          </span>
          <span>
            {formatAmount(putTokenAmount, 5)}{' '}
            <span className="text-stieglitz">{putTokenSymbol}</span>
          </span>
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

const LPPositions = ({ positions }: { positions: any }) => {
  const lpPositions = useMemo(() => {
    return positions.map(
      ({
        strikePrice,
        token0LiquidityInToken,
        token1LiquidityInToken,
        token0Earned,
        token1Earned,
        token0Symbol,
        token0Decimals,
        token1Decimals,
        token1Symbol,
        token0Withdrawable,
        token1Withdrawable,
      }: any) => {
        return {
          earned: {
            callTokenAmount: formatUnits(
              BigInt(token0Earned),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1Earned),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          size: {
            callTokenAmount: formatUnits(
              BigInt(token0LiquidityInToken),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1LiquidityInToken),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          strike: strikePrice,
          withdrawable: {
            callTokenAmount: formatUnits(
              BigInt(token0Withdrawable),
              Number(token0Decimals),
            ),
            putTokenAmount: formatUnits(
              BigInt(token1Withdrawable),
              Number(token1Decimals),
            ),
            callTokenSymbol: token0Symbol,
            putTokenSymbol: token1Symbol,
          },
          select: {
            handleSelect: () => {},
            disabled: true,
          },
        };
      },
    );
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
