import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';

import request from 'graphql-request';
// todo: replace readContracts with multicall on mainnet
import { multicall, readContract, readContracts } from 'wagmi/actions';

import queryClient from 'queryClient';

import { getUserRedeemRequestsDocument } from 'graphql/rdpx-v2';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVault from 'constants/rdpx/abis/PerpVault';
import PerpVaultLp from 'constants/rdpx/abis/PerpVaultLp';
import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from '../../../codegen';

interface VaultState {
  currentEpoch: bigint;
  expiry: bigint;
  fundingRate: bigint;
  totalActiveOptions: bigint;
  lastFundingUpdateTime: bigint;
  underlyingPrice: bigint;
  premiumPerOption: bigint;
  fundingDuration: bigint;
  totalLpShares: bigint;
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
  redeemRequests: {
    sender: string;
    amount: bigint;
    ethAmount: bigint;
    rdpxAmount: bigint;
    epoch: bigint;
  }[];
}

const config = {
  abi: PerpVault,
  address: addresses.perpPool,
};

const lpConfig = {
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
      { result: totalActiveOptions = 0n },
      { result: lastFundingUpdateTime = 0n },
      { result: rdpxPriceInEth = 0n },
      { result: totalLpShares = 0n },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...config,
          functionName: 'currentEpoch',
        },
        {
          ...config,
          functionName: 'fundingDuration',
        },
        {
          ...config,
          functionName: 'totalActiveOptions',
        },
        {
          ...config,
          functionName: 'lastUpdateTime',
        },
        {
          ...config,
          functionName: 'getUnderlyingPrice',
        },
        {
          ...lpConfig,
          functionName: 'totalSupply',
        },
      ],
    });

    const [
      { result: fundingRate = 0n },
      { result: epochExpiry = 0n },
      { result: totalFundingForCurrentEpoch = 0n },
      { result: oneLpShare = [0n, 0n] as readonly [bigint, bigint] },
    ] = await readContracts({
      // multicall
      contracts: [
        {
          ...config,
          functionName: 'fundingRates',
          args: [currentEpoch],
        },
        {
          ...config,
          functionName: 'getEpochExpiry',
          args: [currentEpoch],
        },
        {
          ...config,
          functionName: 'totalFundingForEpoch',
          args: [currentEpoch],
        },
        {
          ...lpConfig,
          functionName: 'redeemPreview',
          args: [parseUnits('1', DECIMALS_TOKEN)],
        },
      ],
    });

    const strike = rdpxPriceInEth - rdpxPriceInEth / 4n;
    let ttl = epochExpiry - BigInt(Math.ceil(new Date().getTime() / 1000));
    if (ttl < 0n) {
      ttl = 0n;
    }
    const premium = await readContract({
      ...config,
      functionName: 'calculatePremium',
      args: [strike, parseUnits('10', DECIMALS_TOKEN), ttl, rdpxPriceInEth],
    });

    setVaultState((prev) => ({
      ...prev,
      currentEpoch,
      fundingDuration,
      fundingRate,
      lastFundingUpdateTime,
      premiumPerOption: premium,
      underlyingPrice: rdpxPriceInEth,
      expiry: epochExpiry,
      totalActiveOptions,
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
            ...config,
            functionName: 'epochExpiries',
            args: [epoch],
          },
          {
            ...config,
            functionName: 'totalFundingForEpoch',
            args: [epoch],
          },
          {
            ...config,
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
    if (user === '0x') return;

    let targetEpoch = vaultState.currentEpoch;
    if (targetEpoch === 0n) {
      targetEpoch = 1n;
    }

    const [{ result: userSharesLocked = 0n }, { result: userLpShares = 0n }] =
      await readContracts({
        // multicall
        contracts: [
          {
            ...config,
            functionName: 'userSharesLocked',
            args: [user, vaultState.currentEpoch],
          },
          {
            ...lpConfig,
            functionName: 'balanceOf',
            args: [user],
          },
        ],
      });
    const nonZeroDenominator = vaultState.totalLpShares || 1n;
    const userShareOfFunding =
      (parseUnits(
        vaultState.totalFundingForCurrentEpoch.toString(),
        DECIMALS_TOKEN,
      ) *
        parseUnits(userLpShares.toString(), DECIMALS_TOKEN)) /
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
        (tokenShare * userLpShares) / parseUnits('1', DECIMALS_TOKEN),
    ) as [bigint, bigint];

    const data = await queryClient
      .fetchQuery({
        queryKey: ['getRedeemRequests'],
        queryFn: () =>
          request(
            DOPEX_RDPX_V2_SUBGRAPH_API_URL,
            getUserRedeemRequestsDocument,
            {
              sender: user,
            },
          ),
      })
      .then((res) => res.redeemRequests)
      .catch(() => []);

    const redeemRequestsFormatted = data.map((rr) => ({
      sender: rr.sender,
      amount: BigInt(rr.amount),
      ethAmount: BigInt(rr.ethAmount),
      rdpxAmount: BigInt(rr.rdpxAmount),
      epoch: BigInt(rr.epoch),
    }));

    setUserData((prev) => ({
      ...prev,
      userSharesLocked,
      totalUserShares: userLpShares,
      isClaimQueued,
      shareComposition,
      claimableTime,
      userShareOfFunding,
      redeemRequests: redeemRequestsFormatted,
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
