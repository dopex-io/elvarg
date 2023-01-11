import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import { ERC721__factory, ERC721 } from '@dopex-io/sdk';

type RdpxV2Treasury = any;
// class RdpxV2Treasury__factory {
//   bondContract() {}
//   addresses() {}
//   rdpxReserve() {}
//   lpReserve() {}
//   dscReserve() {}
//   UPPER_PEG() {}
//   DSC_FIRST_LOWER_PEG() {}
//   DSC_SECOND_LOWER_PEG() {}
//   alphaTokenRatio() {}
//   rdpxRatio() {}
//   bondMaturity() {}
//   totalSupply() {}
// }

interface RdpxV2Bonds extends ERC721 {}
// class RdpxV2Bonds__factory {}

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

interface Bond {
  tokenId: number;
  amount: BigNumber | number;
  maturity: number;
  mintTime: number;
}

interface RdpxV2TreasuryData {
  bondsContract?: RdpxV2Bonds | any;
  treasuryContract?: RdpxV2Treasury;
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
  bondsContract: {},
  treasuryContract: {},
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
  WalletSlice & AssetsSlice & DpxusdBondingSlice,
  [],
  [['zustand/devtools', never]],
  DpxusdBondingSlice
> = (set, get) => ({
  treasuryContractData: initialTreasuryContractData,
  updateContractData: async () => {
    const { contractAddresses, provider } = get();

    if (!contractAddresses || !provider) return;

    const treasuryAddress = contractAddresses['RDPX-V2']['Treasury'];
    let rdpxV2Treasury: RdpxV2Treasury;

    rdpxV2Treasury = ERC721__factory.connect(treasuryAddress, provider);

    const [
      bondContract,
      treasuryContract,
      addresses,
      rdpxReserve,
      lpReserve,
      dscReserve,
      upperPeg,
      firstLowerPeg,
      secondLowerPeg,
      alphaTokenRatio,
      rdpxRatio,
      bondMaturity,
      totalSupply,
    ] = await Promise.all([
      rdpxV2Treasury.bondContract(),
      rdpxV2Treasury,
      rdpxV2Treasury.addresses(),
      rdpxV2Treasury.rdpxReserve(),
      rdpxV2Treasury.lpReserve(),
      rdpxV2Treasury.dscReserve(),
      rdpxV2Treasury.UPPER_PEG(),
      rdpxV2Treasury.DSC_FIRST_LOWER_PEG(),
      rdpxV2Treasury.DSC_SECOND_LOWER_PEG(),
      rdpxV2Treasury.alphaTokenRatio(),
      rdpxV2Treasury.rdpxRatio(),
      rdpxV2Treasury.bondMaturity(),
      rdpxV2Treasury.totalSupply(),
    ]);

    set((prevState) => ({
      ...prevState,
      treasuryContractData: {
        bondContract,
        treasuryContract,
        addresses,
        rdpxReserve,
        lpReserve,
        dscReserve,
        upperPeg,
        firstLowerPeg,
        secondLowerPeg,
        alphaTokenRatio,
        rdpxRatio,
        bondMaturity,
        totalSupply,
      },
    }));
  },
  userDscBondData: initialUserDscBondData,
  updateUserData: async () => {},
  bondDsc: async (amount: number, to: string) => {
    const { signer, accountAddress } = get();
    if (!signer || !accountAddress) return;
    console.log(amount, to);
    // return Treasury__factory.connect(signer).bond(amount, accountAddress);
  },
  redeem: async (bondId: number, to: string) => {
    const { signer, accountAddress } = get();
    if (!signer || !accountAddress) return;
    console.log(bondId, to);
    // return Treasury__factory.connect(signer).redeem(bondId, accountAddress);
  },
  getBondMaturity: async (bondId: number) => {
    console.log(bondId);
    // return Treasury__factory.connect(contractAddress, provider).getBondMaturity(bondId);
  },
  updateUserDscBondsData: async () => {
    const { accountAddress, provider, treasuryContractData } = get();

    if (
      !provider ||
      treasuryContractData.addresses.length === 0 ||
      !accountAddress
    )
      return;

    const { bondsContract } = treasuryContractData;

    if (!bondsContract) return;

    const userBalance = (
      await bondsContract.balanceOf(accountAddress)
    ).toNumber();

    const bonds: Bond[] = [];

    for (let i = 0; i < userBalance; i++) {
      const index = await bondsContract.tokenOfOwnerByIndex(accountAddress, i); // push token IDs
      const bondData = await treasuryContractData.treasuryContract.bonds(index);
      bonds.push(bondData);
    }

    set((prevState) => ({
      ...prevState,
      userDscBondData: {
        bonds: bonds,
        address: accountAddress,
      },
    }));
  },
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
