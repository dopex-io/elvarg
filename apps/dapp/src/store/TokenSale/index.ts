import { BigNumber } from 'ethers';

import { ERC20__factory, TokenSale__factory } from '@dopex-io/sdk';
import { StateCreator } from 'zustand';

import { WalletSlice } from 'store/Wallet';

export interface TokenSaleSlice {
  token: string;
  weiDeposited: string | BigNumber;
  saleStart: number | BigNumber;
  saleWhitelistStart: number | BigNumber;
  maxWhitelistDeposit: number | BigNumber;
  saleClose: BigNumber;
  maxDeposits: string | BigNumber;
  tokensAllocated: string | BigNumber;
  claimAmount: string | BigNumber;
  deposits: string | BigNumber;
  dpxBalance: string | BigNumber;
  blockTime: number;
  userAddress: string;
  dpxTokenSaleAddress: string;
  updateUserData: Function;
  updateSaleData: Function;
}

export const createTokenSaleSlice: StateCreator<
  WalletSlice & TokenSaleSlice,
  [['zustand/devtools', never]],
  [],
  TokenSaleSlice
> = (set, get) => ({
  token: '',
  weiDeposited: '',
  saleStart: 0,
  saleWhitelistStart: 0,
  maxWhitelistDeposit: 0,
  saleClose: BigNumber.from(0),
  maxDeposits: '',
  tokensAllocated: '',
  claimAmount: '',
  deposits: '',
  dpxBalance: '',
  blockTime: 0,
  userAddress: '',
  dpxTokenSaleAddress: '',
  updateSaleData: async () => {
    const { provider, contractAddresses } = get();

    if (!provider || !contractAddresses || !contractAddresses['TokenSale'])
      return;

    const readTokenSaleContract = TokenSale__factory.connect(
      contractAddresses['TokenSale'],
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
    const blockTime = await (async () =>
      (
        await provider.getBlock('latest')
      ).timestamp)();
    const token = contractAddresses['DPX'];
    const dpxTokenSaleAddress = contractAddresses['TokenSale'];

    set((prevState) => ({
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
  },
  updateUserData: async () => {
    const { provider, accountAddress, contractAddresses } = get();
    if (
      !provider ||
      !accountAddress ||
      !contractAddresses ||
      !contractAddresses['TokenSale']
    )
      return;

    const readTokenSaleContract = TokenSale__factory.connect(
      contractAddresses['TokenSale'],
      provider
    );

    const readDPXTokenContract = ERC20__factory.connect(
      contractAddresses['DPX'],
      provider
    );

    const [claimAmount, deposits, dpxBalance] = await Promise.all([
      readTokenSaleContract.claimAmount(accountAddress),
      readTokenSaleContract.deposits(accountAddress),
      readDPXTokenContract.balanceOf(accountAddress),
    ]);

    const userAddress = accountAddress;

    set((prevState) => ({
      ...prevState,
      claimAmount,
      deposits,
      dpxBalance,
      userAddress,
    }));
  },
});
