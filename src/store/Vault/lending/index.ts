import { StateCreator } from 'zustand';
import {
  SsovV3Viewer__factory,
  SSOVOptionPricing__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { SsovV4Put__factory } from 'mocks/factories';
import { SsovV4Put } from 'mocks';
import { BigNumber, ethers } from 'ethers';
import axios from 'axios';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { TOKEN_ADDRESS_TO_DATA } from 'constants/tokens';
import { DOPEX_API_BASE_URL } from 'constants/index';

import { TokenData } from 'types';

const SSOV = '0x94bA72E58Be755c64d7cA1C543DE264A65ccEb66';
const CHAIN_ID = 421613;

export interface SsovV4EpochData {
  collateralSymbol?: string;
  underlyingSymbol?: string;
  collateralAddress?: string;
  tokenPrice?: BigNumber;
  underlyingPrice?: BigNumber;
  collateralPrice?: BigNumber;
}

export interface SsovV4EpochStrikeData {
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  availableCollateralForStrikes: BigNumber[];
  epochStrikeTokens: string[];
  totalCollateral: BigNumber;
  activeCollateral: BigNumber;
  borrowedCollateral: BigNumber;
}

export interface DebtPositionInterface {
  epoch: BigNumber;
  strike: BigNumber;
  supplied: BigNumber;
  borrowed: BigNumber;
  tokenId: BigNumber;
}

export interface UserDebtPositions {
  debtPositions: DebtPositionInterface[];
}

export interface SsovV4Slice {}

export const createSsovV4Slice: StateCreator<
  WalletSlice & CommonSlice & SsovV4Slice,
  [['zustand/devtools', never]],
  [],
  SsovV4Slice
> = (set, get) => ({
  getLendingContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();
    if (!selectedPoolName || !provider) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    try {
      return SsovV4Put__factory.connect(ssovAddress, provider);
    } catch (err) {
      console.log(err);
      throw new Error('Fail to get ssov lending contract');
    }
  },
  updateSsovV4Data: async () => {
    set((prevState) => ({ ...prevState, ssovEpochData: null }));
  },
  updateSsovV4EpochStrikeData: async () => {
    set((prevState) => ({ ...prevState, ssovEpochData: null }));
  },
  getSsovViewerAddress: () => {
    const { selectedPoolName, contractAddresses } = get();
    if (!selectedPoolName || !contractAddresses) return;
    return contractAddresses['SSOV-V3'].VIEWER;
  },
});
