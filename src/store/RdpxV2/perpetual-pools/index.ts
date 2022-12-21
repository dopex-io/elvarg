import { StateCreator } from 'zustand';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

export interface APPSlice {
  appContractData: any;
  updateAPPContractData: Function;
  appUserData: any;
  updateAPPUserData: Function;
}

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
*/

export const createAppSlice: StateCreator<
  APPSlice & WalletSlice & AssetsSlice,
  [['zustand/devtools', never]],
  [],
  APPSlice
> = (_, __) => ({
  appContractData: {},
  updateAPPContractData: async () => {},
  appUserData: {},
  updateAPPUserData: async () => {},
});
