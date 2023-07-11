import { ethers } from 'ethers';

import { providers } from '@0xsequence/multicall';
import { Addresses, ERC20__factory } from '@dopex-io/sdk';
import axios from 'axios';
import { arbitrum, polygon } from 'wagmi/chains';
import { StateCreator } from 'zustand';

import queryClient from 'queryClient';

import { FarmingSlice } from 'store/Farming';
import { vedpxAddress } from 'store/VeDPX';
import { WalletSlice } from 'store/Wallet';

import { CHAINS } from 'constants/chains';
import { TOKEN_DATA, TOKENS } from 'constants/tokens';

const initKeysToVal = (arr: Array<string>, val: any) => {
  return arr.reduce((acc, item) => {
    return { ...acc, [item]: val };
  }, {});
};

export interface AssetsSlice {
  tokens: string[];
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
  userAssetBalances: { [key: string]: string };
  isLoadingBalances: boolean;
  updateAssetBalances: Function;
  updateTokenPrices: Function;
}

export const createAssetsSlice: StateCreator<
  WalletSlice & AssetsSlice & FarmingSlice,
  [['zustand/devtools', never]],
  [],
  AssetsSlice
> = (set, get) => ({
  tokens: TOKENS.filter((item) => item !== '2CRV'),
  tokenPrices: [],
  userAssetBalances: initKeysToVal(TOKENS, '0'),
  isLoadingBalances: true,
  updateTokenPrices: async () => {
    const { tokens } = get();

    const cgIds: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const tokenKey = tokens[i];

      if (tokenKey) {
        const tokenData = TOKEN_DATA[tokenKey];
        tokenData?.cgId && tokenData?.cgId !== '' && cgIds.push(tokenData.cgId);
      }
    }

    const payload = await queryClient.fetchQuery({
      queryKey: ['token_prices'],
      queryFn: () =>
        axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`
        ),
    });

    const data = Object.keys(payload.data)
      .map((_key, index) => {
        const tokenKey = tokens[index];

        if (tokenKey) {
          const tokenData = TOKEN_DATA[tokenKey];
          if (tokenData && tokenData.cgId) {
            const temp = payload.data[tokenData.cgId];
            return {
              name: tokenKey,
              change24h: temp?.usd_24h_change || 0,
              price: temp?.usd || 0,
            };
          }
        }

        return null;
      })
      .filter((item) => {
        if (item === null) return false;
        return true;
      });

    set((prevState) => ({
      ...prevState,
      tokenPrices: data as {
        name: string;
        change24h: any;
        price: any;
      }[],
    }));
  },
  updateAssetBalances: async () => {
    const { accountAddress, userAssetBalances, contractAddresses, chainId } =
      get();

    if (!accountAddress || !contractAddresses) return;

    const chainIds = [chainId];

    if (chainId === 42161) {
      chainIds.push(137);
    } else if (chainId === 137) {
      chainIds.push(42161);
    }

    chainIds.map(async (chainId) => {
      const provider = new providers.MulticallProvider(
        new ethers.providers.StaticJsonRpcProvider(CHAINS[chainId]?.rpc)
      );
      let assets = Object.keys(userAssetBalances)
        .map((asset) => {
          return Addresses[chainId][asset] ? asset : '';
        })
        .filter((asset) => asset !== '');

      let assetAddresses = Object.keys(userAssetBalances)
        .map((asset) => {
          return Addresses[chainId][asset] ?? '';
        })
        .filter((asset) => asset !== '');

      // Include NFTs
      const NFTs = Addresses[chainId]['NFTS'];
      if (NFTs) {
        Object.keys(NFTs).map((key: string) => {
          assets.push(key);
        });
        Object.values(NFTs).map((address) => {
          assetAddresses.push(address);
        });
      }

      // Include veDPX
      if (chainId === 42161) {
        assets.push('veDEPX');
        assetAddresses.push(vedpxAddress);
      }

      const balanceCalls = assetAddresses.map((assetAddress) =>
        ERC20__factory.connect(assetAddress, provider).balanceOf(
          accountAddress ?? ''
        )
      );

      const balances = await Promise.all(balanceCalls);

      for (let i = 0; i < assetAddresses.length; i++) {
        const _asset = assets[i];
        const _balance = balances[i];

        if (_asset && _balance) userAssetBalances[_asset] = _balance.toString();
      }

      if (chainId === 56) {
        userAssetBalances['BNB'] = (
          await provider.getBalance(accountAddress ?? '')
        ).toString();
      } else if (chainId === 43114) {
        userAssetBalances['AVAX'] = (
          await provider.getBalance(accountAddress ?? '')
        ).toString();
      } else if (chainId === 137) {
        userAssetBalances['MATIC'] = (
          await provider.getBalance(accountAddress ?? '')
        ).toString();
      } else {
        userAssetBalances['ETH'] = (
          await provider.getBalance(accountAddress ?? '')
        ).toString();
      }
    });

    const usdcArbBalance = (
      await ERC20__factory.connect(
        '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        new providers.MulticallProvider(
          new ethers.providers.StaticJsonRpcProvider(CHAINS[arbitrum.id]?.rpc)
        )
      ).balanceOf(accountAddress ?? '')
    ).toString();
    userAssetBalances['USDC-arb'] = usdcArbBalance;

    const usdcMaticBalance = (
      await ERC20__factory.connect(
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        new providers.MulticallProvider(
          new ethers.providers.StaticJsonRpcProvider(CHAINS[polygon.id]?.rpc)
        )
      ).balanceOf(accountAddress ?? '')
    ).toString();
    userAssetBalances['USDC-matic'] = usdcMaticBalance;

    set((prevState) => ({
      ...prevState,
      userAssetBalances,
      isLoadingBalances: false,
    }));
  },
});
