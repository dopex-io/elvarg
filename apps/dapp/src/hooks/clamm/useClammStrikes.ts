import { useCallback } from 'react';
import { Address } from 'viem';

import { useBoundStore } from 'store';

import getPoolSlot0 from 'utils/clamm/getPoolSlot0';
import getPoolTickSpacing from 'utils/clamm/getPoolTickSpacing';
import splitMarketPair from 'utils/clamm/splitMarketPair';

import { CHAINS } from 'constants/chains';

const useClammStrikes = () => {
  const { selectedPair, isPut, chainId } = useBoundStore();
  const generateClammStrikesForPair = useCallback(
    async (poolAddress: Address, range: number) => {
      const { underlyingTokenSymbol, collateralTokenSymbol } =
        splitMarketPair(selectedPair);

      const decimals0 = CHAINS[chainId].tokenDecimals[underlyingTokenSymbol];
      const decimals1 = CHAINS[chainId].tokenDecimals[collateralTokenSymbol];
      console.log(decimals0);
      console.log(decimals1);

      const slot0 = await getPoolSlot0(poolAddress);
      const tickSpacing = await getPoolTickSpacing(poolAddress);
      // @ts-ignore
      const currentTick = slot0[1];

      let tickModuloFromTickSpace = currentTick % tickSpacing;

      const startTick =
        currentTick < 0
          ? isPut
            ? currentTick + (-tickModuloFromTickSpace - tickSpacing)
            : currentTick - tickModuloFromTickSpace
          : isPut
          ? currentTick - tickModuloFromTickSpace
          : currentTick - (tickModuloFromTickSpace - tickSpacing);

      const strikes = [];
      strikes.push(1.0001 ** startTick * 10 ** decimals0) / 10 ** decimals1;

      for (let i = 1; i < range + 1; i++) {
        if (isPut) {
          strikes.push(
            1.0001 ** (startTick - tickSpacing * i) * 10 ** decimals0,
          ) /
            10 ** decimals1;
        } else {
          strikes.push(
            1.0001 ** (startTick + tickSpacing * i) * 10 ** decimals0,
          ) /
            10 ** decimals1;
        }
      }
      return strikes;
    },
    [isPut, chainId, selectedPair],
  );

  return [generateClammStrikesForPair];
};

export default useClammStrikes;
