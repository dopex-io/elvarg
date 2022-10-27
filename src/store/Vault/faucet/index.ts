import { StateCreator } from 'zustand';
import { Faucet__factory } from 'mocks/factories/Faucet__factory';
import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';
import { BigNumber } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';

const FAUCET: string = '0xeE1CA33F5924F08dD3d7931c42EE5dFB725C00b3';

export const OLP_TOKENS: { [name: string]: string } = {
  USD: '0x2521a83db3ddbbe57e3397bd278497abb250bbc5',
  DPX: '0xf54fcf65ada818b878eb9119d7ab38c708af8fa5',
  'Call token $1,111': '0xa90c549c2c2af9c0cc2d4fd332220deb5b493596',
  'Call token $2,222': '0xa9e2b25c4a6b510d95321db0fe41402747369037',
  'Call token $3,333': '0x260019bf63a233ae5d6145e609dc8b35e48fd5a4',
  'Put token $888': '0xbddae4a2aac8c13dde143bea3e444fdbfa97da1e',
  'Put token $777': '0x023eac2845534938ab4c3d5e244c104880a8be3a',
  'Put token $666': '0x86148a68117ddc3934cae87b56562dd4f49568b7',
};

export interface FaucetSlice {
  getFaucetContract: Function;
  balances?: BigNumber[];
  updateBalances: Function;
}

export const createFaucetSlice: StateCreator<
  FaucetSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  FaucetSlice
> = (set, get) => ({
  getFaucetContract: () => {
    const { provider } = get();

    if (!provider) return;

    return Faucet__factory.connect(FAUCET, provider);
  },
  balances: [],
  updateBalances: async () => {
    const { provider } = get();

    try {
      const balancesPromise: any = [];

      Object.entries(OLP_TOKENS).forEach(async ([_, token]) => {
        balancesPromise.push(
          ERC20__factory.connect(token, provider).balanceOf(FAUCET)
        );
      });

      const balances = await Promise.all(balancesPromise);

      set((prevState) => ({
        ...prevState,
        balances: balances,
      }));
    } catch (err) {
      console.log(err);
    }
  },
});
