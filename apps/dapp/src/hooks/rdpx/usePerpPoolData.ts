import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';

import range from 'lodash/range';
// todo: replace readContracts with multicall on mainnet
import { /*multicall,*/ readContract, readContracts } from 'wagmi/actions';

// todo: prune redeemRequests after claim(); requires claim event
// import request from 'graphql-request';
// import queryClient from 'queryClient';
// import { getUserRedeemRequestsDocument } from 'graphql/rdpx-v2';
// import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from '../../../codegen';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import PerpVault from 'constants/rdpx/abis/PerpVault';
import PerpVaultLp from 'constants/rdpx/abis/PerpVaultLp';
import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

interface VaultState {
  currentEpoch: bigint;
  expiry: bigint;
  strike: bigint;
  fundingRate: bigint;
  activeCollateral: bigint;
  lastFundingUpdateTime: bigint;
  underlyingPrice: bigint;
  premiumPerOption: bigint;
  fundingDuration: bigint;
  totalLpShares: bigint;
  totalCollateral: bigint;
  totalFundingForCurrentEpoch: bigint;
  oneLpShare: readonly [bigint, bigint];
}

interface EpochData {
  epoch: bigint;
  expiry: bigint;
  totalFundingForEpoch: bigint;
  totalSharesLocked: bigint;
}

interface UserData {
  userSharesLocked: bigint;
  totalUserShares: bigint;
  shareComposition: [bigint, bigint];
  isClaimQueued: boolean;
  claimableTime: bigint;
  userShareOfFunding: bigint;
  userStakedLp: bigint;
  redeemRequests: {
    sender: string;
    amount: bigint;
    ethAmount: bigint;
    rdpxAmount: bigint;
    epoch: bigint;
  }[];
}

const perpPoolConfig = {
  abi: PerpVault,
  address: addresses.perpPool,
};

const perpLpConfig = {
  abi: PerpVaultLp,
  address: addresses.perpPoolLp,
};

interface Props {
  user: Address;
}

const usePerpPoolData = ({ user = '0x' }: Props) => {
  const [vaultState, setVaultState] = useState<VaultState>(
    initialContractStates.perpPool.state,
  );
  const [userData, setUserData] = useState<UserData>(
    initialContractStates.perpPool.userData,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const updateVaultState = useCallback(async () => {
    setLoading(true);
    const [
      { result: currentEpoch = 0n },
      { result: fundingDuration = 0n },
      { result: activeCollateral = 0n },
      { result: lastFundingUpdateTime = 0n },
      { result: rdpxPriceInEth = 0n },
      { result: totalLpShares = 0n },
      { result: totalCollateral = 0n },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...perpPoolConfig,
          functionName: 'currentEpoch',
        },
        {
          ...perpPoolConfig,
          functionName: 'fundingDuration',
        },
        {
          ...perpLpConfig,
          functionName: 'activeCollateral',
        },
        {
          ...perpPoolConfig,
          functionName: 'lastUpdateTime',
        },
        {
          ...perpPoolConfig,
          functionName: 'getUnderlyingPrice',
        },
        {
          ...perpLpConfig,
          functionName: 'totalSupply',
        },
        {
          ...perpLpConfig,
          functionName: 'totalCollateral',
        },
      ],
    });

    const [
      { result: fundingRate = 0n },
      { result: expiry = 0n },
      { result: totalFundingForCurrentEpoch = 0n },
      { result: oneLpShare = [0n, 0n] as readonly [bigint, bigint] },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...perpPoolConfig,
          functionName: 'fundingRates',
          args: [currentEpoch],
        },
        {
          ...perpPoolConfig,
          functionName: 'getEpochExpiry',
          args: [currentEpoch],
        },
        {
          ...perpPoolConfig,
          functionName: 'totalFundingForEpoch',
          args: [currentEpoch],
        },
        {
          ...perpLpConfig,
          functionName: 'redeemPreview',
          args: [parseUnits('1', DECIMALS_TOKEN)],
        },
      ],
    });

    const strike = rdpxPriceInEth - rdpxPriceInEth / 4n;
    let ttl = expiry - BigInt(Math.ceil(new Date().getTime() / 1000));
    if (ttl < 0n) {
      ttl = 0n;
    }
    const premium = await readContract({
      ...perpPoolConfig,
      functionName: 'calculatePremium',
      args: [strike, parseUnits('1', DECIMALS_TOKEN), ttl, rdpxPriceInEth],
    });

    setVaultState((prev) => ({
      ...prev,
      currentEpoch,
      fundingDuration,
      fundingRate,
      lastFundingUpdateTime,
      premiumPerOption: premium,
      underlyingPrice: rdpxPriceInEth,
      expiry,
      strike,
      activeCollateral,
      totalCollateral,
      totalLpShares,
      totalFundingForCurrentEpoch,
      oneLpShare,
    }));
  }, []);

  const fetchEpochData = useCallback(
    async (epoch: bigint): Promise<EpochData> => {
      if (vaultState.expiry === 0n)
        return new Promise((resolve, _) => ({
          resolve: resolve({
            epoch: 0n,
            expiry: 0n,
            totalFundingForEpoch: 0n,
            totalSharesLocked: 0n,
          }),
          // reject: reject('Could not fetch epoch data'),
        }));

      const [
        { result: expiry = 0n },
        { result: totalFundingForEpoch = 0n },
        { result: totalSharesLocked = 0n },
      ] = await readContracts({
        contracts: [
          {
            ...perpPoolConfig,
            functionName: 'epochExpiries',
            args: [epoch],
          },
          {
            ...perpPoolConfig,
            functionName: 'totalFundingForEpoch',
            args: [epoch],
          },
          {
            ...perpPoolConfig,
            functionName: 'totalSharesLocked',
            args: [epoch],
          },
        ],
      });

      return {
        epoch,
        expiry,
        totalFundingForEpoch,
        totalSharesLocked,
      };
    },
    [vaultState.expiry],
  );

  const updateUserData = useCallback(async () => {
    if (user === '0x' || vaultState.expiry === 0n) return;

    const [
      { result: userSharesLocked = 0n },
      { result: userLpShares = 0n },
      { result: userStakedLp = 0n },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...perpPoolConfig,
          functionName: 'userSharesLocked',
          args: [user, vaultState.currentEpoch],
        },
        {
          ...perpLpConfig,
          functionName: 'balanceOf',
          args: [user],
        },
        {
          abi: CurveMultiRewards,
          address: addresses.perpVaultStaking,
          functionName: 'balanceOf',
          args: [user],
        },
      ],
    });
    const nonZeroDenominator = vaultState.totalLpShares + userStakedLp || 1n;
    const userShareOfFunding =
      (parseUnits(
        vaultState.totalFundingForCurrentEpoch.toString(),
        DECIMALS_TOKEN,
      ) *
        parseUnits((userLpShares + userStakedLp).toString(), DECIMALS_TOKEN)) /
      parseUnits(
        nonZeroDenominator.toString(),
        nonZeroDenominator === 1n ? 1 : DECIMALS_TOKEN * 2,
      );
    const isClaimQueued = userSharesLocked > 0n;

    let claimableTime = 0n;
    if (isClaimQueued) {
      claimableTime =
        vaultState.expiry - BigInt(Math.ceil(new Date().getTime() / 1000));
      // this assumes bootstrap is called at the moment of expiry
    }

    const shareComposition = vaultState.oneLpShare.map(
      (tokenShare) =>
        (tokenShare * (userLpShares + userStakedLp)) /
        parseUnits('1', DECIMALS_TOKEN),
    ) as [bigint, bigint];

    // todo: prune redeemRequests after claim(); requires claim event
    // const data = await queryClient
    //   .fetchQuery({
    //     queryKey: ['getRedeemRequests'],
    //     queryFn: () =>
    //       request(
    //         DOPEX_RDPX_V2_SUBGRAPH_API_URL,
    //         getUserRedeemRequestsDocument,
    //         {
    //           sender: user,
    //         },
    //       ),
    //   })
    //   .then((res) => res.redeemRequests.sort((a, b) => a.epoch - b.epoch))
    //   .catch(() => []);

    const _userSharesPromises = [];
    const allEpochs = range(Number(vaultState.currentEpoch + 1n));
    for (const i of allEpochs) {
      const userSharesForEpoch = readContract({
        ...perpPoolConfig,
        functionName: 'userSharesLocked',
        args: [user, BigInt(i)],
      });
      _userSharesPromises.push(userSharesForEpoch);
    }
    const redeemRequests = (await Promise.all(_userSharesPromises)).map(
      (amount, i) => ({ amount, epoch: BigInt(allEpochs[i]) }),
    );
    const previewRedeemPromises = [];
    for (let i = 0; i < redeemRequests.length; i++) {
      previewRedeemPromises.push(
        readContract({
          ...perpLpConfig,
          functionName: 'redeemPreview',
          args: [redeemRequests[i].amount],
        }),
      );
    }

    const resolved = (await Promise.all(previewRedeemPromises))
      .map((preview, i) => ({
        ethAmount: preview[0],
        rdpxAmount: preview[1],
        amount: redeemRequests[i].amount, // shares
        epoch: redeemRequests[i].epoch,
        sender: user,
      }))
      .filter((rr) => rr.amount > 0n);

    setUserData((prev) => ({
      ...prev,
      userSharesLocked,
      totalUserShares: userLpShares + userStakedLp,
      isClaimQueued,
      shareComposition,
      claimableTime,
      userShareOfFunding,
      redeemRequests: resolved,
      userStakedLp,
    }));
    setLoading(false);
  }, [user, vaultState]);

  return {
    perpetualVaultState: vaultState,
    userPerpetualVaultData: userData,
    fetchPerpetualVaultEpochData: fetchEpochData,
    updatePerpetualVaultState: updateVaultState,
    updateUserPerpetualVaultData: updateUserData,
    loading,
  };
};

export default usePerpPoolData;
