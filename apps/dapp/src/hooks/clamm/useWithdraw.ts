import { useMemo } from 'react';
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  Hex,
} from 'viem';

import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import UniswapV3Pool from 'abis/clamm/UniswapV3Pool';
import UniswapV3SingleTickLiquidityHandler from 'abis/clamm/UniswapV3SingleTickLiquidityHandler';
import { useContractReads } from 'wagmi';

import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

type PositionsToWithdraw = {
  strikeId: bigint;
  shares: bigint;
  handler: Address;
  pool: Address;
  tickLower: number;
  tickUpper: number;
  token0: Token;
  token1: Token;
  strike: number;
};

type Props = {
  positions: PositionsToWithdraw[];
};

type Token = {
  decimals: number;
  symbol: string;
};

const useReactiveLPPositions = ({ positions }: Props) => {
  const { data: positionAssets } = useContractReads({
    contracts: positions.map(({ handler, shares, strikeId }) => ({
      abi: UniswapV3SingleTickLiquidityHandler,
      address: handler,
      functionName: 'convertToAssets',
      args: [shares, strikeId],
    })),
  });

  const { data: sqrtPricesX96 } = useContractReads({
    contracts: positions.map(({ pool }) => ({
      abi: UniswapV3Pool,
      address: pool,
      functionName: 'slot0',
    })),
  });

  const { data: strikesDatas } = useContractReads({
    contracts: positions.map(({ handler, shares, strikeId }) => ({
      abi: UniswapV3SingleTickLiquidityHandler,
      address: handler,
      functionName: 'tokenIds',
      args: [strikeId],
    })),
  });

  const { data: sharesAvailableData } = useContractReads({
    contracts: strikesDatas
      ? strikesDatas.map((strikeData, index) => {
          const _strikeData = strikeData.error
            ? [0n, 0n, 0n]
            : (strikeData.result as bigint[]);
          return {
            abi: UniswapV3SingleTickLiquidityHandler,
            address: positions[index].handler,
            functionName: 'convertToShares',
            args: [_strikeData[0] - _strikeData[1], positions[index].strikeId],
          };
        })
      : [],
  });

  const sharesAvailable = useMemo(() => {
    if (!sharesAvailableData) return [];
    return sharesAvailableData.filter(({ result }) => Boolean(result));
  }, [sharesAvailableData]);

  const positionsWithdrawable = useMemo(() => {
    if (!positionAssets || !sqrtPricesX96 || !strikesDatas || !sharesAvailable)
      return [];
    return positions
      .map(
        (
          {
            tickLower,
            tickUpper,
            token0,
            token1,
            shares,
            pool,
            handler,
            strike,
          },
          index,
        ) => {
          const sqrtPriceX96 =
            (sqrtPricesX96[index].result as bigint | undefined) ?? 0n;
          const liquidity =
            (positionAssets[index].result as bigint | undefined) ?? 0n;

          const sharesAvailableInStrike =
            (sharesAvailable[index]?.result as bigint | undefined) ?? 0n;

          const { amount0, amount1 } = getAmountsForLiquidity(
            sqrtPriceX96,
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );
          const token0Amount = formatUnits(amount0, token0.decimals);
          const token1Amount = formatUnits(amount1, token1.decimals);
          const sharesWithdrawable =
            sharesAvailableInStrike >= shares
              ? shares
              : sharesAvailableInStrike;

          const handlerTxData = encodeAbiParameters(
            [
              { name: 'pool', type: 'address' },
              { name: 'tickLower', type: 'int24' },
              { name: 'tickUpper', type: 'int24' },
              { name: 'shares', type: 'uint128' },
            ],
            [pool, tickLower, tickUpper, sharesWithdrawable],
          );
          const withdrawTx = encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'burnPosition',
            args: [handler, handlerTxData],
          });

          return {
            token0: {
              amount: token0Amount,
              symbol: token0.symbol,
            },
            token1: {
              amount: token1Amount,
              symbol: token1.symbol,
            },
            withdrawTx,
            strike,
            sharesWithdrawable,
          };
        },
      )
      .filter(({ sharesWithdrawable }) => sharesWithdrawable != 0n);
  }, [positions, positionAssets, sqrtPricesX96, strikesDatas, sharesAvailable]);

  return { positionsWithdrawable };
};

export default useReactiveLPPositions;
