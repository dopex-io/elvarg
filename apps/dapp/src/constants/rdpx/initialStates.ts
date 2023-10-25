import { rdpxV2ContractKeys } from './addresses';

const initialContractStates: {
  [key in (typeof rdpxV2ContractKeys)[number]]?: any;
} = {
  v2core: {
    bondMaturity: 0n,
    bondingRatio: [0n, 0n] as [bigint, bigint],
    feePercentage: 0n,
    isRelpActive: false,
    relpFactor: 0n,
    dscPrice: 0n,
    rdpxPriceInEth: 0n,
    bondDiscountFactor: 0n,
    totalWethDelegated: 0n,
    secondLowerPeg: 0n,
    firstLowerPeg: 0n,
    upperPeg: 0n,
  },
  perpPool: {
    state: {
      currentEpoch: 0n,
      expiry: 0n,
      fundingRate: 0n,
      totalActiveOptions: 0n,
      lastFundingUpdateTime: 0n,
      fundingDuration: 0n,
    },
    epochData: {
      epoch: 0n,
      expiry: 0n,
      totalFundingForEpoch: 0n,
      fundingAccountedFor: 0n,
    },
    userData: {
      depositEpoch: 0n,
      totalDeposit: 0n,
      withdrawable: 0n,
      fundingAccrued: 0n,
    },
  },
};

export default initialContractStates;
