import { rdpxV2ContractKeys } from 'constants/rdpx/addresses';

const initialContractStates: {
  [key in (typeof rdpxV2ContractKeys)[number]]?: any;
} = {
  v2core: {
    bondMaturity: 0n,
    bondDiscountFactor: 0n,
    dpxethPriceInEth: 0n,
    rdpxPriceInEth: 0n,
    ethPrice: 0n,
    maxMintableBonds: 0n,
    bondComposition: [0n, 0n] as readonly [bigint, bigint],
    discount: 0n,
    receiptTokenSupply: 0n,
    receiptTokenMaxSupply: 0n,
    receiptTokenBacking: [0n, 0n] as readonly [bigint, bigint],
    rdpxSupply: 0n,
  },
  perpPool: {
    state: {
      currentEpoch: 0n,
      expiry: 0n,
      strike: 0n,
      fundingRate: 0n,
      activeCollateral: 0n,
      lastFundingUpdateTime: 0n,
      underlyingPrice: 0n,
      premiumPerOption: 0n,
      fundingDuration: 0n,
      totalLpShares: 0n,
      totalCollateral: 0n,
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
      userStakedLp: 0n,
      redeemRequests: [],
    },
  },
  communalFarm: {
    userData: {
      lockedStakes: [],
      totalLocked: 0n,
      combinedWeight: 0n,
      unlockable: 0n,
      earnedTokens: [],
    },
    state: {
      stakingToken: '0x',
      totalLocked: 0n,
      rewardsData: [],
      periodFinish: 0n,
      lastUpdateTime: 0n,
      minLockTime: 0n,
      maxLockTime: 0n,
      multiplierRate: 0n,
    },
  },
};

export default initialContractStates;
