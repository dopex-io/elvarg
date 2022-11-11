import { StateCreator } from 'zustand';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

/* 
 1. load all pools : ()
 2. get selected pool data : (poolId: string)
 3. get amountOut : (poolId: string, tokenIn: string, amountIn: string | BN)
 4. get price impact: (poolId: string, amountIn: BN, reserveA: BN, reserveB: BN)
 *5. use router for swaps? 
*/

const pools_temp = {
  DPXETH: {
    address: '0xabcdefabcdefabcdefabcdef',
    pair: [
      {
        symbol: 'ETH',
        address: '0x0',
      },
      {
        symbol: 'DPX',
        address: '0x1',
      },
    ],
  },
  RDPXETH: {
    address: '0xabcdefabcdefabcdefabcdef',
    pair: [
      {
        symbol: 'ETH',
        address: '0x0',
      },
      {
        symbol: 'DPX',
        address: '0x1',
      },
    ],
  },
};

interface Pools {
  [poolId: string]: {
    address: string;
    pair: { [key: string]: string }[];
  };
}

export interface AmmSlice {
  ammPools?: Pools;
  updateAmmPools: Function;
  getAmmPools: Function;
  getSelectedAmmPool: Function;
  getFeeCalculation: Function;
}

export const createAmmSlice: StateCreator<
  AmmSlice & WalletSlice & AssetsSlice,
  [['zustand/devtools', never]],
  [],
  AmmSlice
> = (set, get) => ({
  updateAmmPools: async () => {
    set((prevState) => ({ ...prevState, ammPools: pools_temp }));
  },
  getAmmPools: () => {
    const { ammPools: pools } = get();

    if (!pools) return;

    return pools;
  },
  getSelectedAmmPool: (id: string) => {
    const { ammPools: pools } = get();

    if (!pools || !pools[id]) return;

    return pools[id];
  },
  getFeeCalculation: (tokenIn: string, amountIn: number) => {
    console.log(tokenIn, amountIn);
  },
});
