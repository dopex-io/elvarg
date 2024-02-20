import React, { useMemo } from 'react';
import { formatUnits, getAddress } from 'viem';

import { useNetwork } from 'wagmi';

import TableLayout from 'components/common/TableLayout';

import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { LPPosition } from '.';
import { columns } from './columns';

type Props = {
  positions: LPPosition[][];
  refetches: ((...args: any) => Promise<any>)[];
};

const Positions = ({ positions, refetches }: Props) => {
  const { chain = { id: DEFAULT_CHAIN_ID } } = useNetwork();

  const positionsSorted = useMemo(() => {
    const handlerSortedPositions = [];
    let index = 0;
    if (positions.length > 0 && positions[0] && positions[0].length > 0) {
      for (const poolPositions of positions) {
        const refetch = refetches[index];
        index++;
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

        let deprecated = false;
        let handler = 'unknown';
        let _positions = [];

        if (poolPositions && poolPositions.length > 0) {
          for (const position of poolPositions) {
            const {
              earned,
              liquidity,
              meta,
              strikes,
              tokens,
              withdrawable,
              reserved,
            } = position;
            const { token0, token1 } = tokens;
            const { tickLower, tickUpper, initialLiquidity } = meta;
            deprecated = meta.handler.deprecated;

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
              amount0:
                Number(formatUnits(BigInt(earned.token0), token0.decimals)) +
                totalEarned.amount0,
              amount1:
                Number(formatUnits(BigInt(earned.token1), token1.decimals)) +
                totalEarned.amount1,
              amount0Symbol,
              amount1Symbol,
            };
            totalLiquidity = {
              amount0:
                Number(formatUnits(BigInt(liquidity.token0), token0.decimals)) +
                totalLiquidity.amount0,
              amount1:
                Number(formatUnits(BigInt(liquidity.token1), token1.decimals)) +
                totalLiquidity.amount1,
              amount0Symbol,
              amount1Symbol,
            };
            totalWithdrawable = {
              amount0:
                Number(
                  formatUnits(BigInt(withdrawable.token0), token0.decimals),
                ) + totalWithdrawable.amount0,
              amount1:
                Number(
                  formatUnits(BigInt(withdrawable.token1), token1.decimals),
                ) + totalWithdrawable.amount1,
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

            const amount0Utilization =
              1 -
              Number(
                formatUnits(BigInt(withdrawable.token0), token0.decimals),
              ) /
                Number(formatUnits(BigInt(liquidity.token0), token0.decimals));
            const amount1Utilization =
              1 -
              Number(
                formatUnits(BigInt(withdrawable.token1), token1.decimals),
              ) /
                Number(formatUnits(BigInt(liquidity.token1), token1.decimals));

            _positions.push({
              utilization:
                ((isNaN(amount0Utilization) ? 0 : amount0Utilization) +
                  (isNaN(amount1Utilization) ? 0 : amount1Utilization)) *
                100,
              handler: meta.handler.name,
              earned: {
                amount0: earned.token0,
                amount1: earned.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              liquidity: {
                amount0: liquidity.token0,
                amount1: liquidity.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              reserved: {
                amount0: reserved.token0,
                amount1: reserved.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
                withdrawable: {
                  amount0: reserved.withdrawable.token0,
                  amount1: reserved.withdrawable.token1,
                  liquidity: reserved.withdrawable.liquidity,
                },
              },
              withdrawable: {
                amount0: withdrawable.token0,
                amount1: withdrawable.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              withdraw: {
                initialLiquidity,
                shares: meta.shares,
                withdrawableLiquidity: meta.withdrawableLiquidity,
                hook: getAddress(meta.hook),
                tokenId: meta.tokenId,
                amount0: withdrawable.token0,
                amount1: withdrawable.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
                handler: getAddress(meta.handler.handler),
                pool: getAddress(meta.handler.pool),
                tickLower,
                tickUpper,
              },
              range: {
                lower: strikes.call,
                upper: strikes.put,
              },
            });
          }
        }

        handlerSortedPositions.push({
          handler: {
            name: handler,
            deprecated,
          },
          earned: totalEarned,
          liquidity: totalLiquidity,
          withdrawable: totalWithdrawable,
          range,
          manage: {
            positions: _positions,
            refetch,
          },
        });
      }
    }
    return handlerSortedPositions;
  }, [positions, chain.id, refetches]);

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
