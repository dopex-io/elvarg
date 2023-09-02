import { useCallback } from 'react';
import { Address } from 'viem';

import { useBoundStore } from 'store';

import getPoolSlot0 from 'utils/clamm/getPoolSlot0';
import getPoolTickSpacing from 'utils/clamm/getPoolTickSpacing';
import splitMarketPair from 'utils/clamm/splitMarketPair';

import { CHAINS } from 'constants/chains';

export type ClammStrike = {
  strike: number;
  upperTick: number;
  lowerTick: number;
};

const useClammStrikes = () => {
  const { selectedPair, isPut, chainId } = useBoundStore();
  const generateClammStrikesForPair = useCallback(
    async (poolAddress: Address, range: number) => {
      const { underlyingTokenSymbol, collateralTokenSymbol } =
        splitMarketPair(selectedPair);

      const decimals0 = CHAINS[chainId].tokenDecimals[underlyingTokenSymbol];
      const decimals1 = CHAINS[chainId].tokenDecimals[collateralTokenSymbol];

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

      const strikes: ClammStrike[] = [];

      for (let i = 1; i < range + 1; i++) {
        let strike = 0;
        let upperTick = 0;
        let lowerTick = 0;
        if (isPut) {
          lowerTick = startTick - tickSpacing * i - tickSpacing;
          upperTick = startTick - tickSpacing * i;
          strike =
            ((1 / 1.0001 ** lowerTick) * 10 ** decimals0) / 10 ** decimals1;
        } else {
          upperTick = startTick + tickSpacing * i + tickSpacing;
          lowerTick = startTick + tickSpacing * i;
          strike =
            ((1 / 1.0001 ** upperTick) * 10 ** decimals0) / 10 ** decimals1;
        }
        strikes.push({ strike: strike, upperTick, lowerTick });
      }

      return strikes;
    },
    [isPut, chainId, selectedPair],
  );

  return [generateClammStrikesForPair];
};

export default useClammStrikes;
