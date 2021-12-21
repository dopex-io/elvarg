import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { ERC20, ERC20__factory } from '@dopex-io/sdk';
import axios from 'axios';

import { WalletContext } from './Wallet';

import { ASSETS_LIST } from 'constants/index';

import { AssetData } from 'types';

interface AssetsContextInterface {
  usdtContract?: ERC20;
  usdtDecimals: number;
  selectedBaseAsset: string;
  selectedBaseAssetContract?: ERC20;
  selectedBaseAssetDecimals: number;
  baseAssets: string[];
  quoteAssets: string[];
  tokens: string[];
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
  baseAssetsWithPrices?: AssetData;
  userAssetBalances: { [key: string]: string };
  handleChangeSelectedBaseAsset?: Function;
  updateAssetBalances?: Function;
}

const initialState: AssetsContextInterface = {
  usdtDecimals: 6,
  selectedBaseAsset: 'WETH',
  selectedBaseAssetDecimals: 18,
  baseAssets: ['WETH', 'WBTC'],
  quoteAssets: ['USDT'],
  tokens: ['DPX', 'RDPX', 'ETH', 'GOHM'],
  tokenPrices: [],
  userAssetBalances: {
    ETH: '0',
    WETH: '0',
    WBTC: '0',
    DPX: '0',
    RDPX: '0',
    USDT: '0',
  },
};

const ASSET_TO_COINGECKO_ID = {
  ETH: 'ethereum',
  WBTC: 'bitcoin',
  DPX: 'dopex',
  RDPX: 'dopex-rebate-token',
  GOHM: 'governance-ohm',
};

export const AssetsContext =
  createContext<AssetsContextInterface>(initialState);

export const AssetsProvider = (props) => {
  const { provider, contractAddresses, accountAddress } =
    useContext(WalletContext);
  const [state, setState] = useState<AssetsContextInterface>(initialState);

  const handleChangeSelectedBaseAsset = useCallback(
    async (baseAsset) => {
      if (!provider || !contractAddresses) return;
      const selectedBaseAssetContract = ERC20__factory.connect(
        contractAddresses[baseAsset],
        provider
      );

      // Update when a base asset does not have 18 decimals

      setState((s) => ({
        ...s,
        selectedBaseAsset: baseAsset,
        selectedBaseAssetContract,
      }));
    },
    [provider, contractAddresses]
  );

  useEffect(() => {
    handleChangeSelectedBaseAsset('WETH');
  }, [handleChangeSelectedBaseAsset]);

  useEffect(() => {
    if (!provider || !contractAddresses) return;
    const usdtContract = ERC20__factory.connect(
      contractAddresses.USDT,
      provider
    );

    setState((s) => ({
      ...s,
      usdtContract,
    }));
  }, [provider, contractAddresses]);

  useEffect(() => {
    const updateTokenPrices = async () => {
      const cgIds = [];

      for (let i = 0; i < state.tokens.length; i++) {
        cgIds.push(ASSET_TO_COINGECKO_ID[state.tokens[i]]);
      }

      const payload = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`
      );

      const data = Object.keys(payload.data).map((_key, index) => {
        const temp = payload.data[ASSET_TO_COINGECKO_ID[state.tokens[index]]];
        return {
          name: state.tokens[index],
          change24h: temp['usd_24h_change'],
          price: temp.usd,
        };
      });

      setState((prevState) => ({ ...prevState, tokenPrices: data }));
    };

    updateTokenPrices();
  }, [state.tokens]);

  // useEffect(() => {
  //   if (!state.baseAssets.length || !provider || !contractAddresses) return;

  //   const getPrices = async () => {
  //     setState((prevState) => ({ ...prevState, loading: true }));

  //     const _baseAssetsWithPrices = {};

  //     const pricePromises = [];

  //     for (let i = 0; i < state.baseAssets.length; i++) {
  //       const asset = ASSET_TO_COINGECKO_ID[state.baseAssets[i]];
  //       const promise = axios
  //         .get(
  //           `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd,eth,btc&include_24hr_change=true`
  //         )
  //         .then((payload) => {
  //           let key;
  //           if (payload.data.ethereum) {
  //             key = 'ethereum';
  //           } else {
  //             key = 'bitcoin';
  //           }
  //           return {
  //             change: payload.data[key]['usd_24h_change'],
  //             price: ethersUtils
  //               .parseUnits(String(payload.data[key].usd), 8)
  //               .toString(),
  //             priceEth: payload.data[key].eth,
  //             priceBtc: payload.data[key].btc,
  //             priceUsd: payload.data[key].usd,
  //           };
  //         });

  //       pricePromises.push(promise);
  //     }

  //     const data = await Promise.all(pricePromises);

  //     for (let i = 0; i < data.length; i++) {
  //       const asset = state.baseAssets[i];
  //       const { price, priceEth, priceBtc, priceUsd } = data[i];
  //       _baseAssetsWithPrices[asset] = {
  //         ...BASE_ASSET_MAP[asset],
  //         price,
  //         priceEth,
  //         priceBtc,
  //         priceUsd,
  //       };
  //     }

  //     setState((prevState) => {
  //       if (
  //         prevState.baseAssetsWithPrices === undefined ||
  //         Object.keys(prevState.baseAssetsWithPrices).length <=
  //           Object.keys(_baseAssetsWithPrices).length
  //       ) {
  //         return {
  //           ...prevState,
  //           baseAssetsWithPrices: _baseAssetsWithPrices,
  //         };
  //       } else {
  //         return { ...prevState };
  //       }
  //     });
  //   };

  //   getPrices();
  //   const intervalId = setInterval(getPrices, 60000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [state.baseAssets, contractAddresses, provider]);

  const updateAssetBalances = useCallback(async () => {
    if (!provider || !accountAddress || !contractAddresses) return;
    (async function () {
      const assetAddresses = ASSETS_LIST.map((asset) => {
        return contractAddresses[asset];
      });
      const userAssetBalances = {
        ETH: '0',
        WETH: '0',
        WBTC: '0',
        DPX: '0',
        RDPX: '0',
        USDT: '0',
        GOHM: '0',
      };

      const balanceCalls = assetAddresses.map((assetAddress) =>
        ERC20__factory.connect(assetAddress, provider).balanceOf(accountAddress)
      );

      const balances = await Promise.all(balanceCalls);

      for (let i = 0; i < assetAddresses.length; i++) {
        userAssetBalances[ASSETS_LIST[i]] = balances[i].toString();
      }

      userAssetBalances['ETH'] = (
        await provider.getBalance(accountAddress)
      ).toString();

      setState((prevState) => ({ ...prevState, userAssetBalances }));
    })();
  }, [accountAddress, provider, contractAddresses]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances]);

  const contextValue = {
    ...state,
    updateAssetBalances,
    handleChangeSelectedBaseAsset,
  };

  return (
    <AssetsContext.Provider value={contextValue}>
      {props.children}
    </AssetsContext.Provider>
  );
};
