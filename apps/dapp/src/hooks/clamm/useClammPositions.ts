import { useCallback, useEffect, useState } from 'react';
import { formatEther, formatUnits } from 'viem';

import request from 'graphql-request';
import { Address } from 'wagmi';

import queryClient from 'queryClient';

import {
  getTotalMintSize,
  getTotalPremium,
  getUserClammPositions,
} from 'graphql/clamm';

import { useBoundStore } from 'store';
import {
  ClammBuyPosition,
  ClammPair,
  ClammWritePosition,
} from 'store/Vault/clamm';

import getErc1155Balance from 'utils/clamm/getErc1155Balance';
import getPoolSlot0 from 'utils/clamm/getPoolSlot0';
import getWritePosition from 'utils/clamm/getWritePosition';
import getWritePositionId from 'utils/clamm/getWritePositionId';
import {
  getAmountsForLiquidity,
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import parseLiquidityFromMintPositionTxData from 'utils/clamm/parseLiquidityFromMintPositionTxData';
import splitMarketPair from 'utils/clamm/splitMarketPair';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import { CHAINS } from 'constants/chains';
import { MARKETS } from 'constants/clamm/markets';
import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export interface RewardsInfo {
  rewardAmount: bigint;
  periodFinish: bigint;
  rewardRate: bigint;
  rewardRateStored: bigint;
  lastUpdateTime: bigint;
  totalSupply: bigint;
  decimalsPrecision: bigint;
  rewardToken: Address;
}

interface TokenIdInfo {
  totalLiquidity: bigint;
  totalSupply: bigint;
  liquidityUsed: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
}

export interface RewardAccrued {
  symbol: string;
  name: string;
  amount: bigint;
  address: Address;
  isOption: boolean;
}

interface Args {
  market: string;
}

const useClammPositions = (args: Args) => {
  const { market } = args;
  //   const { address } = useAccount();
  const ARC = '0x2a9a9f63f13dd70816c456b2f2553bb648ee0f8f';
  const CARROT = '0x29ed22a9e56ee1813e6ff69fc6cac676aa24c09c';
  const address = CARROT;
  const { selectedPair, chainId, isPut, selectedUniswapPool } = useBoundStore();

  const [writePositions, setWritePositions] = useState<ClammWritePosition[]>();
  const [buyPositions, setBuyPositions] = useState<ClammBuyPosition[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateClammPositions = useCallback(async () => {
    setLoading(true);
    if (!address || MARKETS[market as ClammPair] === undefined) {
      setLoading(false);
      return;
    }

    const [
      positionsQueryResult,
      totalMintSizeQueryResult,
      totalPremiumQueryResult,
    ] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['getUserClammPositions', address.toLowerCase()],
        queryFn: async () =>
          request(DOPEX_CLAMM_SUBGRAPH_API_URL, getUserClammPositions, {
            user: address.toLowerCase(),
          }),
      }),
      queryClient.fetchQuery({
        queryKey: ['getTotalMintSize'],
        queryFn: async () =>
          request(DOPEX_CLAMM_SUBGRAPH_API_URL, getTotalMintSize),
      }),
      queryClient.fetchQuery({
        queryKey: ['getTotalPremium'],
        queryFn: async () =>
          request(DOPEX_CLAMM_SUBGRAPH_API_URL, getTotalPremium),
      }),
    ]);

    const poolAddress = MARKETS[market as ClammPair].uniswapPoolAddress;
    const totalSharesRaw: bigint = (
      totalMintSizeQueryResult as any
    ).writePositions.reduce(
      (acc: bigint, item: any) => acc + BigInt(item.size),
      0n,
    );
    const totalShares = Number(formatEther(totalSharesRaw));
    const totalPremiumRaw: bigint = (
      totalPremiumQueryResult as any
    ).buyPositions.reduce(
      (acc: bigint, item: any) => acc + BigInt(item.premium),
      0n,
    );
    const totalPremium = Number(formatEther(totalPremiumRaw));

    if (!positionsQueryResult.users[0] || !poolAddress) {
      setLoading(false);
    }

    const slot0 = await getPoolSlot0(poolAddress);
    // @ts-ignore
    const currentTick = slot0[1];

    const { underlyingTokenSymbol, collateralTokenSymbol } =
      splitMarketPair(selectedPair);

    const tickScaleFlipped =
      selectedUniswapPool.token0 !== selectedUniswapPool.underlyingToken;

    const decimals0 =
      CHAINS[chainId].tokenDecimals[
        tickScaleFlipped ? collateralTokenSymbol : underlyingTokenSymbol
      ];
    const decimals1 =
      CHAINS[chainId].tokenDecimals[
        tickScaleFlipped ? underlyingTokenSymbol : collateralTokenSymbol
      ];

    const _buyPositions: ClammBuyPosition[] =
      positionsQueryResult.users[0].userBuyPositions
        .filter((position) => {
          const poolId = position.id.split('#')[0] as string;
          return (
            poolAddress &&
            poolId.toLowerCase() === poolAddress.toLowerCase() &&
            position.isPut === isPut
          );
        })
        .map((item) => {
          const liquidity = parseLiquidityFromMintPositionTxData(item.txInput);
          const optionsSize = getAmountsForLiquidity(
            selectedUniswapPool.sqrtX96,
            getSqrtRatioAtTick(BigInt(item.tickLower)),
            getSqrtRatioAtTick(BigInt(item.tickUpper)),
            liquidity,
          );

          const strike = calculateStrike({
            isPut: item.isPut,
            tickLower: item.tickLower,
            tickUpper: item.tickUpper,
            decimals0: decimals0,
            decimals1: decimals1,
          });
          return {
            strikeSymbol: market,
            optionId: item.id,
            strike: Number(strike),
            tickLower: item.tickLower,
            tickUpper: item.tickUpper,
            size:
              optionsSize.amount0 === 0n
                ? formatUnits(optionsSize.amount1, decimals1)
                : formatUnits(optionsSize.amount0, decimals0),
            isPut: item.isPut,
            expiry: item.expiry,
          };
        });
    setBuyPositions(_buyPositions);

    const _writePositions: ClammWritePosition[] = (
      await Promise.all(
        positionsQueryResult.users[0].userWritePositions
          .filter((position) => {
            const poolId = position.id.split('#')[0] as string;
            return (
              poolAddress && poolId.toLowerCase() === poolAddress.toLowerCase()
            );
          })
          .map(async (item) => {
            let positionIsPut = true;

            if (
              selectedUniswapPool.token0 == selectedUniswapPool.underlyingToken
            ) {
              if (currentTick > item.tickLower) {
                positionIsPut = true;
              } else if (currentTick < item.tickUpper) {
                positionIsPut = false;
              }
            } else {
              if (currentTick > item.tickLower) {
                positionIsPut = false;
              } else if (currentTick < item.tickUpper) {
                positionIsPut = true;
              }
            }
            // if (positionIsPut === isPut) {
            const strike = calculateStrike({
              isPut: positionIsPut,
              tickLower: item.tickLower,
              tickUpper: item.tickUpper,
              decimals0: decimals0,
              decimals1: decimals1,
            });

            const positionId = getWritePositionId(
              poolAddress,
              item.tickLower,
              item.tickUpper,
            );

            const position = await getWritePosition(positionId);

            if (position.length === 7) {
              const positionInfo: TokenIdInfo = {
                totalLiquidity: position[0],
                totalSupply: position[1],
                liquidityUsed: position[2],
                feeGrowthInside0LastX128: position[3],
                feeGrowthInside1LastX128: position[4],
                tokensOwed0: position[5],
                tokensOwed1: position[6],
              };

              const precisionForCalcs = BigInt(1e10);

              const shares = (await getErc1155Balance(
                address,
                positionId,
              )) as bigint;
              const userLiquidity =
                (shares * positionInfo.totalLiquidity + 1n) /
                positionInfo.totalSupply;

              const userSharesBalance =
                ((await getErc1155Balance(address, positionId)) as bigint) ??
                0n;

              const userLiquidityShare =
                (userSharesBalance * precisionForCalcs) /
                positionInfo.totalSupply;

              const liquidityNotUtilizedPercentage =
                ((positionInfo.totalLiquidity - positionInfo.liquidityUsed) *
                  precisionForCalcs) /
                positionInfo.totalLiquidity;

              const withdrawableShares =
                (userSharesBalance * liquidityNotUtilizedPercentage) /
                precisionForCalcs;

              // TODO: fix 0n
              const earned = getAmountsForLiquidity(1n, 1n, 1n, userLiquidity);

              const userCurrentShare = Number(formatEther(item.size));
              const userDepositShare = userCurrentShare / totalShares;
              const userPremiums =
                (totalPremium * userDepositShare) / totalShares;

              const liquidtyAmounts = getAmountsForLiquidity(
                selectedUniswapPool.sqrtX96,
                getSqrtRatioAtTick(BigInt(item.tickLower)),
                getSqrtRatioAtTick(BigInt(item.tickUpper)),
                BigInt(item.size),
              );
              const balance = (await getErc1155Balance(
                address,
                positionId,
              )) as bigint;

              const size = {
                token0: liquidtyAmounts.amount0,
                token1: liquidtyAmounts.amount1,
              };

              return {
                strikeSymbol: market,
                optionId: item.id,
                strike: Number(strike),
                tickLower: item.tickLower,
                tickUpper: item.tickUpper,
                size: size,
                isPut: positionIsPut,
                earned: Number(formatEther(earned.amount0)),
                premiums: userPremiums,
                premiums2: {
                  token0: 0n,
                  token1: 0n,
                },
                tokenId: Number(positionId),
                balance,
                withdrawable: withdrawableShares,
              } as ClammWritePosition;
            }
            // }
            // return undefined;
          }),
      )
    ).filter((item): item is ClammWritePosition => item !== undefined);
    setWritePositions(_writePositions);

    setLoading(false);
  }, [
    address,
    chainId,
    isPut,
    market,
    selectedPair,
    selectedUniswapPool.sqrtX96,
    selectedUniswapPool.token0,
    selectedUniswapPool.underlyingToken,
  ]);

  useEffect(() => {
    updateClammPositions();
  }, [updateClammPositions]);

  return {
    writePositions,
    buyPositions,
    isLoading: loading,
  };
};

const calculateStrike = ({
  isPut,
  tickLower,
  tickUpper,
  decimals0,
  decimals1,
}: {
  isPut: boolean;
  tickLower: number;
  tickUpper: number;
  decimals0: number;
  decimals1: number;
}): number => {
  const strike = isPut
    ? ((1 / 1.0001 ** tickLower) * 10 ** decimals0) / 10 ** decimals1
    : ((1 / 1.0001 ** tickUpper) * 10 ** decimals0) / 10 ** decimals1;
  return strike;
};

export default useClammPositions;
