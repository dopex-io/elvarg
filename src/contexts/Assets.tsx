import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { ERC20__factory, Addresses } from '@dopex-io/sdk';
import axios from 'axios';
import noop from 'lodash/noop';

import { WalletContext } from './Wallet';

import { TOKEN_DATA, TOKENS } from 'constants/tokens';

interface AssetsContextInterface {
  tokens: string[];
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
  userAssetBalances: { [key: string]: string };
  updateAssetBalances: Function;
}

const initKeysToVal = (arr: Array<string>, val: any) => {
  return arr.reduce((acc, item) => {
    return { ...acc, [item]: val };
  }, {});
};

export const CHAIN_ID_TO_NATIVE: { [key: number]: number | string } = {
  42161: 'ETH',
  56: 'BNB',
  43114: 'AVAX',
  1: 'ETH',
  1337: 'ETH',
};

export const IS_NATIVE = (asset: string) => {
  return ['ETH', 'BNB', 'AVAX'].includes(asset);
};

const initialState: AssetsContextInterface = {
  tokens: TOKENS.filter((item) => item !== '2CRV'),
  tokenPrices: [],
  userAssetBalances: initKeysToVal(TOKENS, '0'),
  updateAssetBalances: noop,
};

export const AssetsContext =
  createContext<AssetsContextInterface>(initialState);

export const AssetsProvider = (props: { children: ReactNode }) => {
  const { provider, contractAddresses, accountAddress, chainId } =
    useContext(WalletContext);

  const [state, setState] = useState<AssetsContextInterface>(initialState);

  useEffect(() => {
    const updateTokenPrices = async () => {
      const cgIds: string[] = [];

      for (let i = 0; i < state.tokens.length; i++) {
        const tokenKey = state.tokens[i];

        if (tokenKey) {
          const tokenData = TOKEN_DATA[tokenKey];
          tokenData?.cgId && cgIds.push(tokenData.cgId);
        }
      }

      const payload = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`
      );

      const data = Object.keys(payload.data)
        .map((_key, index) => {
          const tokenKey = state.tokens[index];

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

      setState((prevState) => ({
        ...prevState,
        tokenPrices: data as {
          name: string;
          change24h: any;
          price: any;
        }[],
      }));
    };

    updateTokenPrices();
    const intervalId = setInterval(updateTokenPrices, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [state.tokens]);

  const updateAssetBalances = useCallback(async () => {
    if (!provider || !accountAddress || !contractAddresses) return;
    (async function () {
      const userAssetBalances = initialState.userAssetBalances;

      const assets = Object.keys(userAssetBalances)
        .map((asset) => {
          return Addresses[chainId][asset] ? asset : '';
        })
        .filter((asset) => asset !== '');

      const assetAddresses = Object.keys(userAssetBalances)
        .map((asset) => {
          return Addresses[chainId][asset] ?? '';
        })
        .filter((asset) => asset !== '');

      const balanceCalls = assetAddresses.map((assetAddress) =>
        ERC20__factory.connect(assetAddress, provider).balanceOf(accountAddress)
      );

      const balances = await Promise.all(balanceCalls);

      for (let i = 0; i < assetAddresses.length; i++) {
        const _asset = assets[i];
        const _balance = balances[i];

        if (_asset && _balance) userAssetBalances[_asset] = _balance.toString();
      }

      if (chainId === 56) {
        userAssetBalances['BNB'] = (
          await provider.getBalance(accountAddress)
        ).toString();
      } else if (chainId === 43114) {
        userAssetBalances['AVAX'] = (
          await provider.getBalance(accountAddress)
        ).toString();
      } else {
        userAssetBalances['ETH'] = (
          await provider.getBalance(accountAddress)
        ).toString();
      }

      setState((prevState) => ({ ...prevState, userAssetBalances }));
    })();
  }, [accountAddress, provider, contractAddresses, chainId]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances]);

  const contextValue = {
    ...state,
    updateAssetBalances,
  };

  return (
    <AssetsContext.Provider value={contextValue}>
      {props.children}
    </AssetsContext.Provider>
  );
};
