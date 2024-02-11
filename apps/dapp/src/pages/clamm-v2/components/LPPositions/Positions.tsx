import React, { useMemo } from 'react';

import { useNetwork } from 'wagmi';

import TableLayout from 'components/common/TableLayout';

import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { LPPosition } from '.';
import { columns } from './columns';
import ManageDialog from './ManageDialog';

type Props = {
  positions: LPPosition[][];
};
const Positions = ({ positions }: Props) => {
  const { chain = { id: DEFAULT_CHAIN_ID } } = useNetwork();

  const positionsSorted = useMemo(() => {
    const handlerSortedPositions = [];

    for (const poolPositions of positions) {
      let totalEarned = {
        amount0: 0,
        amount1: 0,
        amount0Symbol: 'unknown',
        amount1Symbol: 'unknown',
      };

      let totalLiquidity = {
        amount0: 0,
        amount1: 0,
        amount0Symbol: 'unknown',
        amount1Symbol: 'unknown',
      };

      let totalWithdrawable = {
        amount0: 0,
        amount1: 0,
        amount0Symbol: 'unknown',
        amount1Symbol: 'unknown',
      };

      let range = {
        lower: 0,
        upper: 0,
      };

      let handler = 'unknown';
      let _positions = [];

      if (poolPositions && poolPositions.length > 0) {
        for (const position of poolPositions) {
          const { earned, liquidity, meta, strikes, tokens, withdrawable } =
            position;
          const { token0, token1 } = tokens;

          const amount0Symbol = getTokenSymbol({
            chainId: chain.id,
            address: token0.address,
          });
          const amount1Symbol = getTokenSymbol({
            chainId: chain.id,
            address: token1.address,
          });

          handler = meta.handler.name;
          totalEarned = {
            amount0: Number(earned.token0) + totalEarned.amount0,
            amount1: Number(earned.token1) + totalEarned.amount1,
            amount0Symbol,
            amount1Symbol,
          };
          totalLiquidity = {
            amount0: Number(liquidity.token0) + totalLiquidity.amount0,
            amount1: Number(liquidity.token1) + totalLiquidity.amount1,
            amount0Symbol,
            amount1Symbol,
          };
          totalWithdrawable = {
            amount0: Number(withdrawable.token0) + totalWithdrawable.amount0,
            amount1: Number(withdrawable.token1) + totalWithdrawable.amount1,
            amount0Symbol,
            amount1Symbol,
          };

          range = {
            lower: Math.min(
              range.lower === 0 ? strikes.put : range.lower,
              strikes.put,
            ),
            upper: Math.max(range.upper, strikes.call),
          };
          _positions.push({
            handler: meta.handler.name,
            totalEarned: {
              amount0: Number(earned.token0) + totalEarned.amount0,
              amount1: Number(earned.token1) + totalEarned.amount1,
              amount0Symbol,
              amount1Symbol,
            },
            totalLiquidity: {
              amount0: Number(liquidity.token0) + totalLiquidity.amount0,
              amount1: Number(liquidity.token1) + totalLiquidity.amount1,
              amount0Symbol,
              amount1Symbol,
            },
            totalWithdrawable: {
              amount0: Number(withdrawable.token0) + totalWithdrawable.amount0,
              amount1: Number(withdrawable.token1) + totalWithdrawable.amount1,
              amount0Symbol,
              amount1Symbol,
            },
            range: {
              lower: strikes.call,
              upper: strikes.put,
            },
          });
        }
      }

      handlerSortedPositions.push({
        handler,
        earned: totalEarned,
        liquidity: totalLiquidity,
        withdrawable: totalWithdrawable,
        range,
        positions: _positions,
        manage: () => {},
      });
    }

    return handlerSortedPositions;
  }, [positions, chain.id]);

  return (
    <>
      <TableLayout
        columns={columns}
        data={positionsSorted}
        isContentLoading={false}
      />
    </>
  );
};

export default Positions;
