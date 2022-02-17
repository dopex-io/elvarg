import { BigNumber } from 'ethers';

export interface UserData {
  deposits: BigNumber;
  minted: boolean;
}

export interface Data {
  isDepositPeriod: boolean;
  isFarmingPeriod: boolean;
  maxLpDeposits: BigNumber;
  mintPrice: BigNumber;
  totalDeposits: BigNumber;
}

export interface DiamondPepeContextInterface {
  data: Data;
  userData: UserData;
  updateData?: Function;
  updateUserData?: Function;
}

export const initialData: DiamondPepeContextInterface = {
  data: {
    isDepositPeriod: false,
    isFarmingPeriod: false,
    maxLpDeposits: BigNumber.from('0'),
    mintPrice: BigNumber.from('0'),
    totalDeposits: BigNumber.from('0'),
  },
  userData: { deposits: BigNumber.from('0'), minted: false },
};
