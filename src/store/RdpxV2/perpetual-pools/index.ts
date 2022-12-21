import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

/*
store: 
updateAtlanticPerpetualPool:
- underlyingSymbol(): in contract
- baseSymbol: get from 'await ERC20__factory.connect(vault.collateralToken(), signer).symbol()'
- vaultData()
  - totalCollateral: BigNumber
  - activeCollateral: BigNumber
  - totalPremium: BigNumber
  - totalRewardsCollected: BigNumber[2]
  - rewardDistributionRatios: BigNumber[2]
  - rewardTokensToDistribute: BigNumber[2]
- fundingPercentage()
- utilizationRate -- calculated from activeCollateral / totalCollateral
updateUserAPPData():
- getWritePosition()
  - pool.balanceOf(accountAddress)
  - pool.tokenOfOwnerByIndex(index) : iterate over balanceOf above
  - pool.getWritePosition(tokenId)
    uint256 totalCollateral;
    uint256 activeCollateral;
    uint256 accuredPremium;
    uint256 withdrawableCollateral;
    uint256[] rewardDistributionRatios;
    uint256[] strikes; // strikes the user has written options for
    uint256 lastUpdatedTime;
    uint256 lastUpdatedFundingPercentage;
*/

interface VaultData {
  totalCollateral: BigNumber;
  activeCollateral: BigNumber;
  totalPremium: BigNumber;
  totalRewardsCollected: [BigNumber, BigNumber];
  rewardDistributionRatios: [BigNumber, BigNumber];
  rewardTokensToDistribute: [BigNumber, BigNumber];
}

interface APPContractData {
  underlyingSymbol: string;
  baseSymbol: string;
  vaultData: VaultData;
  fundingPercentage: BigNumber;
}

interface WritePosition {
  totalCollateral: BigNumber;
  activeCollateral: BigNumber;
  accruedPremium: BigNumber;
  withdrawableCollateral: BigNumber;
  rewardDistributionRatios: [BigNumber, BigNumber];
  strikes: Array<BigNumber>;
  lastUpdatedTime: BigNumber | number;
  lastUpdatedFundingPercentage: BigNumber;
  user: string;
  positionId: BigNumber | number;
}

interface APPUserData {
  writePosition: WritePosition;
}

export interface APPSlice {
  appContractData: APPContractData;
  updateAPPContractData: Function;
  appUserData: APPUserData;
  updateAPPUserData: Function;
}

// todo: replace with contract data
const dummyAppContractData: APPContractData = {
  underlyingSymbol: 'RDPX',
  baseSymbol: 'USDC',
  vaultData: {
    totalCollateral: BigNumber.from(10_000),
    activeCollateral: BigNumber.from(5_000),
    totalPremium: BigNumber.from(200),
    totalRewardsCollected: [BigNumber.from(0), BigNumber.from(0)],
    rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
    rewardTokensToDistribute: [BigNumber.from(0), BigNumber.from(0)],
  },
  fundingPercentage: BigNumber.from(15),
};

// todo: replace with contract data
const dummyAppUserData: APPUserData = {
  writePosition: {
    totalCollateral: BigNumber.from(1000),
    activeCollateral: BigNumber.from(500),
    accruedPremium: BigNumber.from(50),
    withdrawableCollateral: BigNumber.from(500),
    rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
    strikes: [BigNumber.from(17), BigNumber.from(20)],
    lastUpdatedTime: 1671644513,
    lastUpdatedFundingPercentage: BigNumber.from(2),
    user: '0x0abcdef123456789abcdef123456789abcdef1234',
    positionId: 1,
  },
};

export const createAppSlice: StateCreator<
  APPSlice & WalletSlice & AssetsSlice,
  [['zustand/devtools', never]],
  [],
  APPSlice
> = (set, get) => ({
  appContractData: {
    underlyingSymbol: '',
    baseSymbol: '',
    vaultData: {
      totalCollateral: BigNumber.from(0),
      activeCollateral: BigNumber.from(0),
      totalPremium: BigNumber.from(0),
      totalRewardsCollected: [BigNumber.from(0), BigNumber.from(0)],
      rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
      rewardTokensToDistribute: [BigNumber.from(0), BigNumber.from(0)],
    },
    fundingPercentage: BigNumber.from(0),
  },
  updateAPPContractData: async () => {
    const { provider, chainId } = get();

    if (!provider || !chainId) return;

    set((prevState) => ({
      ...prevState,
      appContractData: dummyAppContractData,
    }));
  },
  appUserData: {
    writePosition: {
      totalCollateral: BigNumber.from(0),
      activeCollateral: BigNumber.from(0),
      accruedPremium: BigNumber.from(0),
      withdrawableCollateral: BigNumber.from(0),
      rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
      strikes: [],
      lastUpdatedTime: BigNumber.from(0),
      lastUpdatedFundingPercentage: BigNumber.from(0),
      user: '',
      positionId: BigNumber.from(0),
    },
  },
  updateAPPUserData: async () => {
    const { accountAddress, contractAddresses } = get();

    if (!accountAddress || !contractAddresses) return;

    set((prevState) => ({ ...prevState, appUserData: dummyAppUserData }));
  },
});
