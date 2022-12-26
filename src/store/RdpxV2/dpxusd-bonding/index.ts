import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

interface Bond {
  tokenId: number;
  amount: BigNumber | number;
  maturity: number;
  mintTime: number;
}

interface RdpxV2TreasuryData {
  addresses: string[];
  rdpxReserve: BigNumber;
  lpReserve: BigNumber;
  dscReserve: BigNumber;
  upperPeg: BigNumber;
  firstLowerPeg: BigNumber;
  secondLowerPeg: BigNumber;
  alphaTokenRatio: BigNumber;
  rdpxRatio: BigNumber;
  bondMaturity: number | BigNumber;
  totalSupply: BigNumber;
}

/*
  1) Contract Data
    - getters are available for addresses, rdpxReserve, lpReserve, dscReserve, upperPeg, 
      firstLowerPeg, secondLowerPeg, alphaTokenRatio, rdpxRatio, bondMaturity
    - supply (Stats component) : contract.totalSupply()
    - collateral ratio (Stats component) : Calculate from (dscReserve / alphaToken) * 100
    - rdpx price : contract.getRdpxPrice()
    - dsc price : contract.getDscPrice()
    - bond cost : contract.calculateBondCost(amount),  amount is number of dsc bonds to mint
  2) User Data:
    - get user bonds
      - getBalance(accountAddress)
      - tokenOfOwnerByIndex(index) [loop over getBalance() return value]
      - bonds[id]: loop over IDs returned from token tokenOfOwnerByIndex()
*/
interface UserDscBondData {
  bonds: Bond[];
  address: string | undefined;
}

const initialTreasuryContractData: RdpxV2TreasuryData = {
  addresses: [],
  rdpxReserve: BigNumber.from(0),
  lpReserve: BigNumber.from(0),
  dscReserve: BigNumber.from(0),
  upperPeg: BigNumber.from(101000000),
  firstLowerPeg: BigNumber.from(99000000),
  secondLowerPeg: BigNumber.from(98500000),
  alphaTokenRatio: BigNumber.from(7500000000),
  rdpxRatio: BigNumber.from(2500000000),
  bondMaturity: 0,
  totalSupply: BigNumber.from(0),
};

export interface DpxusdBondingSlice {
  bondDsc: Function;
  redeem: Function;
  getBondMaturity: Function;
  mintUpperDepeg: Function;
  mintSecondLowerDepeg: Function;
  getBondCost: Function;
  getDscPrice: Function;
  treasuryContractData: RdpxV2TreasuryData;
  updateContractData: Function;
  updateUserDscBondsData: Function;
  userDscBondData: UserDscBondData;
}

const initialUserDscBondData: UserDscBondData = {
  bonds: [],
  address: undefined,
};

export const createDpxusdBondingSlice: StateCreator<
  WalletSlice & AssetsSlice,
  [],
  [['zustand/devtools', never]],
  DpxusdBondingSlice
> = (_, get) => ({
  treasuryContractData: initialTreasuryContractData,
  updateContractData: async () => {},
  userDscBondData: initialUserDscBondData,
  updateUserData: async () => {},
  bondDsc: async (amount: number, to: string) => {
    const { signer, accountAddress } = get();
    if (!signer || !accountAddress) return;
    console.log(amount, to);
    // return Factory.connect(signer).bond(amount, accountAddress);
  },
  redeem: async (bondId: number, to: string) => {
    const { signer, accountAddress } = get();
    if (!signer || !accountAddress) return;
    console.log(bondId, to);
    // return Factory.connect(signer).redeem(bondId, accountAddress);
  },
  getBondMaturity: async (bondId: number) => {
    console.log(bondId);
    // return Factory.connect(contractAddress, provider).getBondMaturity(bondId);
  },
  updateUserDscBondsData: () => {},
  mintUpperDepeg: (amount: number, to: string) => {
    console.log(amount, to);
  },
  mintSecondLowerDepeg: (amount: number, to: string) => {
    console.log(amount, to);
  },
  getBondCost: async (dscAmount: number) => {
    console.log(dscAmount);
  },
  getDscPrice: async () => {},
});
