import { Address, formatUnits, parseUnits } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { optionsPurchasedQuery } from 'graphql/clamm';

import { TokenAmountKeysToData } from 'store/Vault/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

import getSqrtx96Price from './getSqrtx96Price';
import { getAmountsForLiquidity } from './liquidityAmountMath';
import { getSqrtRatioAtTick } from './tickMath';

async function getStats(
  uniswapV3PoolAddress: Address,
  callAssetAmountKey: TokenAmountKeysToData,
  putAssetAmountKey: TokenAmountKeysToData,
  callAssetDecimals: number,
  putAssetDecimals: number,
  token0Decimals: number,
  token1Decimals: number,
  inversePrice: boolean,
  callback: (totalVolumeUsd: number) => void,
) {
  const { optionsPositionPurchases } = await queryClient.fetchQuery({
    queryKey: ['clamm-options-purchased'],
    queryFn: async () =>
      request(DOPEX_CLAMM_SUBGRAPH_API_URL, optionsPurchasedQuery, {
        poolAddress: uniswapV3PoolAddress.toLowerCase(),
        first: 1000,
      }),
  });

  let totalVolumeUsd = 0;
  optionsPositionPurchases.forEach(
    ({ sqrtx96Price, tickLower, tickUpper, options, isPut }) => {
      const optionsLiquidityAmounts = getAmountsForLiquidity(
        BigInt(sqrtx96Price),
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        BigInt(options),
      );

      const underlyingPriceAtPoint = getSqrtx96Price(
        BigInt(sqrtx96Price),
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
      );

      const optionsAmounts = {
        token0Amount: optionsLiquidityAmounts.amount0,
        token1Amount: optionsLiquidityAmounts.amount1,
      };

      const amountFromAsset =
        optionsAmounts[isPut ? putAssetAmountKey : callAssetAmountKey];

      const optionsAmountNumber = Number(
        formatUnits(
          amountFromAsset,
          isPut ? putAssetDecimals : callAssetDecimals,
        ),
      );

      totalVolumeUsd +=
        (isPut
          ? optionsAmountNumber
          : optionsAmountNumber * underlyingPriceAtPoint) * 2;
    },
  );

  callback(totalVolumeUsd);

  return { totalVolumeUsd };
}

export default getStats;
