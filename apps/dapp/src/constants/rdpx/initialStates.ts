import { rdpxV2ContractKeys } from './addresses';

const initialContractStates: {
  [key in (typeof rdpxV2ContractKeys)[number]]?: any;
} = {
  v2core: {
    // bondMaturity: 0n,
    // bondingRatio: [0n, 0n] as [bigint, bigint],
    // feePercentage: 0n,
    // isRelpActive: false,
    // relpFactor: 0n,
    // dscPrice: 0n,
    // rdpxPriceInEth: 0n,
    // bondDiscountFactor: 0n,
    // totalWethDelegated: 0n,
    // secondLowerPeg: 0n,
    // firstLowerPeg: 0n,
    // upperPeg: 0n,
    // relpFactor,
    bondMaturity: 0n,
    bondDiscountFactor: 0n,
    dpxethPriceInEth: 0n,
    rdpxPriceInEth: 0n,
    ethPrice: 0n,
    maxMintableBonds: 0n,
    bondComposition: [0n, 0n] as readonly [bigint, bigint],
    discount: 0n,
  },
  perpPool: {
    state: {
      currentEpoch: 0n,
      expiry: 0n,
      fundingRate: 0n,
      totalActiveOptions: 0n,
      lastFundingUpdateTime: 0n,
      underlyingPrice: 0n,
      premiumPerOption: 0n,
      fundingDuration: 0n,
      totalLpShares: 0n,
      totalFundingForCurrentEpoch: 0n,
      oneLpShare: [0n, 0n] as const,
    },
    epochData: {
      epoch: 0n,
      expiry: 0n,
      totalFundingForEpoch: 0n,
      totalSharesLocked: 0n,
    },
    userData: {
      userSharesLocked: 0n,
      totalUserShares: 0n,
      isClaimQueued: false,
      claimableTime: 0n,
      userShareOfFunding: 0n,
      shareComposition: [0n, 0n] as const,
    },
  },
};

export default initialContractStates;
