import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

import {
  PerpetualAtlanticVault__factory,
  // PerpetualAtlanticVault,
  PerpetualAtlanticVault,
  // ERC20,
  // ERC20__factory,
  USDC, // replace with ERC20
  USDC__factory, // replace with ERC20__factory
} from '@dopex-io/sdk';

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
- fundingPercentage() // deprecated
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
  // totalRewardsCollected: [BigNumber, BigNumber];
  // rewardDistributionRatios: [BigNumber, BigNumber];
  // rewardTokensToDistribute: [BigNumber, BigNumber];
  positionPointer: BigNumber;
}

interface APPContractData {
  contract?: PerpetualAtlanticVault;
  underlyingSymbol: string;
  underlyingToken?: USDC; // todo: change to ERC20
  collateralSymbol: string;
  collateralToken?: USDC; // todo: change to ERC20
  vaultData: VaultData;
  utilizationRate: BigNumber;
  latestFundingPaymentPointer: BigNumber;
}

export interface WritePosition {
  totalCollateral: BigNumber;
  activeCollateral: BigNumber;
  accuredPremium: BigNumber;
  withdrawableCollateral: BigNumber;
  rewardDistributionRatios: BigNumber[];
  // strikes: Array<BigNumber>;
  // lastUpdatedTime: BigNumber | number;
  // lastUpdatedFundingPercentage: BigNumber;
  // user: string;
  positionId: BigNumber | number;
}

interface APPUserData {
  writePositions: WritePosition[];
}

export interface APPSlice {
  appContractData: APPContractData;
  updateAPPContractData: Function;
  appUserData: APPUserData;
  updateAPPUserData: Function;
}

export const createAppSlice: StateCreator<
  APPSlice & WalletSlice & AssetsSlice,
  [['zustand/devtools', never]],
  [],
  APPSlice
> = (set, get) => ({
  appContractData: {
    underlyingSymbol: '',
    collateralSymbol: '',
    utilizationRate: BigNumber.from(0),
    vaultData: {
      totalCollateral: BigNumber.from(0),
      activeCollateral: BigNumber.from(0),
      totalPremium: BigNumber.from(0),
      positionPointer: BigNumber.from(0),
      // totalRewardsCollected: [BigNumber.from(0), BigNumber.from(0)],
      // rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
      // rewardTokensToDistribute: [BigNumber.from(0), BigNumber.from(0)],
    },
    latestFundingPaymentPointer: BigNumber.from(0),
  },
  updateAPPContractData: async () => {
    const { signer, provider, contractAddresses } = get();

    if (!signer || !provider || !contractAddresses) return;

    const _contract: PerpetualAtlanticVault =
      PerpetualAtlanticVault__factory.connect(
        '0xe6e340d132b5f46d1e472debcd681b2abc16e57e',
        signer
      );

    const [
      underlyingSymbol,
      collateralToken,
      vaultData,
      latestFundingPaymentPointer,
    ] = await Promise.all([
      _contract.underlyingSymbol(),
      _contract.collateralToken(),
      _contract.vaultData(),
      _contract.latestFundingPaymentPointer(),
    ]);

    const collateralContract = USDC__factory.connect(collateralToken, signer);

    const collateralSymbol = await collateralContract.symbol();

    const utilizationRate = vaultData.activeCollateral
      .mul(100)
      .div(vaultData.totalCollateral);

    set((prevState) => ({
      ...prevState,
      appContractData: {
        contract: _contract,
        underlyingSymbol,
        collateralSymbol,
        utilizationRate,
        collateralToken: collateralContract,
        vaultData,
        latestFundingPaymentPointer,
      },
    }));
  },
  appUserData: {
    writePositions: [
      {
        totalCollateral: BigNumber.from(0),
        activeCollateral: BigNumber.from(0),
        accuredPremium: BigNumber.from(0),
        withdrawableCollateral: BigNumber.from(0),
        rewardDistributionRatios: [BigNumber.from(0), BigNumber.from(0)],
        strikes: [],
        lastUpdatedTime: BigNumber.from(0),
        lastUpdatedFundingPercentage: BigNumber.from(0),
        user: '',
        positionId: BigNumber.from(0),
      },
    ],
  },
  updateAPPUserData: async () => {
    const { accountAddress, contractAddresses, appContractData } = get();

    if (!accountAddress || !contractAddresses || !appContractData.contract)
      return;

    const userTokenIds = (
      await appContractData.contract.balanceOf(accountAddress)
    ).toNumber();

    let writePositionIds: BigNumber[] = [];
    let writePositions: WritePosition[] = [];

    for (let i = 0; i < userTokenIds; i++) {
      const tokenId: BigNumber =
        await appContractData.contract.tokenOfOwnerByIndex(
          accountAddress,
          BigNumber.from(i)
        );
      if (!tokenId) continue;
      writePositionIds.push(tokenId);
    }

    for (let i = 0; i < writePositionIds.length; i++) {
      writePositions.push({
        ...(await appContractData.contract.getWritePosition(
          writePositionIds[i]!
        )),
        positionId: writePositionIds[i]!,
      });
    }

    set((prevState) => ({
      ...prevState,
      appUserData: { ...prevState.appUserData, writePositions },
    }));
  },
});
