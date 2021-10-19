import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { TokenSale__factory, ERC20__factory } from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

interface TokenSaleExtra {
  tokenSaleSdk?: any;
  updateUserData?: Function;
}

interface TokenSaleData {
  token: string;
  weiDeposited: string;
  saleStart: number;
  saleWhitelistStart: number;
  maxWhitelistDeposit: number;
  saleClose: number;
  maxDeposits: string;
  tokensAllocated: string;
  claimAmount: string;
  deposits: string;
  dpxBalance: string;
  blockTime: number;
  userAddress: string;
  dpxTokenSaleAddress: string;
}

interface TokenSaleContextInterface extends TokenSaleExtra, TokenSaleData {}

const initialData = {
  token: null,
  weiDeposited: null,
  saleStart: null,
  saleWhitelistStart: null,
  maxWhitelistDeposit: null,
  saleClose: null,
  maxDeposits: null,
  tokensAllocated: null,
  claimAmount: null,
  deposits: null,
  dpxBalance: null,
  blockTime: null,
  userAddress: null,
  dpxTokenSaleAddress: null,
};

export const TokenSaleContext =
  createContext<TokenSaleContextInterface>(initialData);

export const TokenSaleProvider = (props) => {
  const { accountAddress, contractAddresses, provider } =
    useContext(WalletContext);
  const [state, setState] = useState(initialData);

  const updateSaleData = useCallback(async () => {
    if (!provider || !contractAddresses) return;

    const readTokenSaleContract = TokenSale__factory.connect(
      contractAddresses.tokenSale,
      provider
    );

    const [
      weiDeposited,
      saleStart,
      saleWhitelistStart,
      maxWhitelistDeposit,
      saleClose,
      maxDeposits,
      tokensAllocated,
    ] = await Promise.all([
      readTokenSaleContract.weiDeposited(),
      readTokenSaleContract.saleStart(),
      readTokenSaleContract.saleWhitelistStart(),
      readTokenSaleContract.maxWhitelistDeposit(),
      readTokenSaleContract.saleClose(),
      readTokenSaleContract.maxDeposits(),
      readTokenSaleContract.dpxTokensAllocated(),
    ]);
    const blockTime = (async () =>
      (await provider.getBlock('latest')).timestamp)();
    const token = contractAddresses.DPX;
    const dpxTokenSaleAddress = contractAddresses.tokenSale;

    setState((prevState) => ({
      ...prevState,
      token,
      weiDeposited,
      saleStart,
      saleWhitelistStart,
      maxWhitelistDeposit,
      saleClose,
      maxDeposits,
      tokensAllocated,
      blockTime,
      dpxTokenSaleAddress,
    }));
  }, [provider, contractAddresses]);

  const updateUserData = useCallback(async () => {
    if (!provider || !accountAddress || !contractAddresses) return;

    const readTokenSaleContract = TokenSale__factory.connect(
      contractAddresses.tokenSale,
      provider
    );

    const readDPXTokenContract = ERC20__factory.connect(
      contractAddresses.DPX,
      provider
    );

    const [claimAmount, deposits, dpxBalance] = await Promise.all([
      readTokenSaleContract.claimAmount(accountAddress),
      readTokenSaleContract.deposits(accountAddress),
      readDPXTokenContract.balanceOf(accountAddress),
    ]);

    const userAddress = accountAddress;

    setState((prevState) => ({
      ...prevState,
      claimAmount,
      deposits,
      dpxBalance,
      userAddress,
    }));
  }, [accountAddress, provider, contractAddresses]);

  useEffect(() => {
    updateSaleData();
  }, [updateSaleData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  let contextValue = {
    ...state,
    updateUserData,
  };

  return (
    <TokenSaleContext.Provider value={contextValue}>
      {props.children}
    </TokenSaleContext.Provider>
  );
};
