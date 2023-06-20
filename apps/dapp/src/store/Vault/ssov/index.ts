import { BigNumber, ethers } from 'ethers';

import {
  ERC20__factory,
  SSOVOptionPricing,
  SSOVOptionPricing__factory,
  SsovV3,
  SsovV3__factory,
  SsovV3Router,
  SsovV3Router__factory,
  SsovV3StakingRewards,
  SsovV3StakingRewards__factory,
  SsovV3Viewer__factory,
} from '@dopex-io/sdk';
import axios from 'axios';
import graphSdk from 'graphql/graphSdk';
import { getVolume } from 'pages/ssov';
import queryClient from 'queryClient';
import { TokenData } from 'types';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DOPEX_API_BASE_URL } from 'constants/env';
import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  SSOV_SUPPORTS_STAKING_REWARDS,
} from 'constants/index';
import { TOKEN_ADDRESS_TO_DATA } from 'constants/tokens';

export interface SsovV3Signer {
  ssovContractWithSigner?: SsovV3;
  ssovRouterWithSigner?: SsovV3Router | undefined;
  ssovStakingRewardsWithSigner?: SsovV3StakingRewards;
}

export interface SsovV3Data {
  collateralSymbol?: string;
  underlyingSymbol?: string;
  collateralAddress?: string;
  ssovContract?: SsovV3;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  underlyingPrice?: BigNumber;
  collateralPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  isCurrentEpochExpired?: boolean;
  isPut?: boolean;
}

export interface Reward {
  rewardToken: string;
  amount: any;
}

export interface SsovV3EpochData {
  epochTimes: BigNumber[];
  isEpochExpired: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  availableCollateralForStrikes: BigNumber[];
  rewardTokens: TokenData[];
  settlementPrice: BigNumber;
  epochStrikeTokens: string[];
  APY: string;
  TVL: number;
  rewards: Reward[];
  collateralExchangeRate: BigNumber;
  strikeToIdx: Map<string, number>;
  volumeInUSD: number;
  totalEpochPurchasesInUSD: BigNumber;
  stakingRewards: StakingRewards[][];
}

export interface StakingRewards {
  reward: TokenData;
  amount: BigNumber;
}
export interface WritePositionInterface {
  collateralAmount: BigNumber;
  strike: BigNumber;
  accruedRewards: BigNumber[];
  accruedPremiums: BigNumber;
  stakeRewardTokens: TokenData[];
  stakeRewardAmounts: BigNumber[];
  utilization: BigNumber;
  epoch: number;
  tokenId: BigNumber;
}
export interface SsovV3UserData {
  writePositions: WritePositionInterface[];
}

export interface SsovV3Slice {
  ssovData?: SsovV3Data;
  ssovEpochData?: SsovV3EpochData;
  ssovV3UserData?: SsovV3UserData;
  ssovSigner: SsovV3Signer;
  updateSsovV3EpochData: Function;
  updateSsovV3UserData: Function;
  updateSsovV3Signer: Function;
  totalEpochStrikeDepositsPending?: BigNumber[];
  totalEpochStrikeDepositsUsable?: BigNumber[];
  updateSsovV3: Function;
  getSsovViewerAddress: Function;
}

export const createSsovV3Slice: StateCreator<
  WalletSlice & CommonSlice & SsovV3Slice,
  [['zustand/devtools', never]],
  [],
  SsovV3Slice
> = (set, get) => ({
  ssovData: {},
  ssovV3UserData: {
    writePositions: [],
  },
  ssovSigner: {},
  updateSsovV3Signer: async () => {
    const { contractAddresses, signer, selectedPoolName, chainId } = get();

    if (!contractAddresses || !signer || !selectedPoolName) return;

    let _ssovSigner: SsovV3Signer;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    if (!ssovAddress) return;

    const ssovRouterAddress = contractAddresses['SSOV-V3']['ROUTER'];

    let ssovRouterWithSigner;

    if (chainId !== 137)
      ssovRouterWithSigner = SsovV3Router__factory.connect(
        ssovRouterAddress,
        signer
      );

    const _ssovContractWithSigner = SsovV3__factory.connect(
      ssovAddress,
      signer
    );

    const ssovStakingRewardsWithSigner = SsovV3StakingRewards__factory.connect(
      contractAddresses['SSOV-V3']['STAKING-REWARDS'],
      signer
    );

    _ssovSigner = {
      ssovContractWithSigner: _ssovContractWithSigner,
      ssovRouterWithSigner,
      ssovStakingRewardsWithSigner,
    };

    set((prevState) => ({
      ...prevState,
      ssovSigner: _ssovSigner,
    }));
  },
  updateSsovV3EpochData: async () => {
    const {
      contractAddresses,
      selectedEpoch,
      selectedPoolName,
      provider,
      getSsovViewerAddress,
    } = get();
    const ssovViewerAddress = getSsovViewerAddress();

    if (
      !contractAddresses ||
      !selectedEpoch ||
      !selectedPoolName ||
      !provider ||
      !ssovViewerAddress
    )
      return;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    if (!ssovAddress) return;

    const ssovContract = SsovV3__factory.connect(ssovAddress, provider);
    const stakingRewardsContract = SsovV3StakingRewards__factory.connect(
      contractAddresses['SSOV-V3']['STAKING-REWARDS'],
      provider
    );

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      ssovViewerAddress,
      provider
    );

    const [
      epochTimes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      epochData,
      epochStrikeTokens,
      apyPayload,
      rewardsPayLoad,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovViewerContract.getTotalEpochStrikeDeposits(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochOptionsPurchased(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochPremium(
        selectedEpoch,
        ssovContract.address
      ),
      ssovContract.getEpochData(selectedEpoch),
      ssovViewerContract.getEpochStrikeTokens(
        selectedEpoch,
        ssovContract.address
      ),
      axios.get(`${DOPEX_API_BASE_URL}/v2/ssov/apy?symbol=${selectedPoolName}`),
      axios.get(
        `${DOPEX_API_BASE_URL}/v2/ssov/rewards?symbol=${selectedPoolName}`
      ),
    ]);

    const epochStrikes = epochData.strikes;
    const strikeToIdx = new Map<string, number>();

    const epochStrikeDataArray = await Promise.all(
      epochStrikes.map(async (strike, idx) => {
        strikeToIdx.set(strike.toString(), idx);
        return ssovContract.getEpochStrikeData(selectedEpoch, strike);
      })
    );

    const availableCollateralForStrikes = epochStrikeDataArray.map((item) => {
      return item?.totalCollateral.sub(item?.activeCollateral);
    });

    const totalEpochDeposits = totalEpochStrikeDeposits.reduce(
      (acc, deposit) => {
        return acc.add(deposit);
      },
      BigNumber.from(0)
    );

    const underlyingPrice = await ssovContract.getUnderlyingPrice();
    const totalEpochDepositsInUSD = !(await ssovContract.isPut())
      ? getUserReadableAmount(totalEpochDeposits, 18) *
        getUserReadableAmount(underlyingPrice, 8)
      : getUserReadableAmount(totalEpochDeposits, 18);

    const totalEpochPurchases = totalEpochOptionsPurchased.reduce(
      (accumulator, val) => {
        return accumulator.add(val);
      },
      BigNumber.from(0)
    );
    const totalEpochPurchasesInUSD = totalEpochPurchases.mul(underlyingPrice);

    const tradesData = await queryClient.fetchQuery({
      queryKey: ['getSsovPurchasesFromTimestamp'],
      queryFn: () =>
        graphSdk.getSsovPurchasesFromTimestamp({
          fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
        }),
    });

    const volume = await getVolume(tradesData, ssovAddress);
    const volumeInUSD =
      getUserReadableAmount(volume, DECIMALS_TOKEN) *
      getUserReadableAmount(underlyingPrice, DECIMALS_STRIKE);

    let _apy = apyPayload.data.apy;
    let _stakingRewards: StakingRewards[][] = [];
    // @TODO remove check when all ssovs support staking rewards
    if (SSOV_SUPPORTS_STAKING_REWARDS.includes(ssovAddress)) {
      const epochStrikeStakingRewardsCalls = epochStrikes.map((strike) => {
        return stakingRewardsContract[
          'getSsovEpochStrikeRewardsInfo(address,uint256,uint256)'
        ](ssovAddress, strike, selectedEpoch);
      });

      const epochStrikeStakingRewardsResult = await Promise.all(
        epochStrikeStakingRewardsCalls
      );

      for (const strikeRewardInfo of epochStrikeStakingRewardsResult) {
        let stakingRewards: StakingRewards[] = [];
        for (const rewardInfo of strikeRewardInfo) {
          const rewardTokenAddress = rewardInfo.rewardToken;
          const symbol = await ERC20__factory.connect(
            rewardTokenAddress,
            provider
          ).symbol();

          let tokenData = {
            symbol: symbol,
            imgSrc: '',
          };

          stakingRewards.push({
            reward: tokenData,
            amount: rewardInfo.rewardAmount,
          });
        }
        _stakingRewards.push(stakingRewards);
      }

      if (_apy !== '0' && _apy && _apy.length > 0) {
        console.log(_apy);
        _apy = Math.max(..._apy.map((apy: string) => Number(apy)));
      }
    }

    const _ssovEpochData = {
      isEpochExpired: epochData.expired,
      settlementPrice: epochData.settlementPrice,
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      availableCollateralForStrikes,
      rewardTokens: epochData.rewardTokensToDistribute.map((token) => {
        return (
          TOKEN_ADDRESS_TO_DATA[token.toLowerCase()] || {
            symbol: 'UNKNOWN',
            imgSrc: '',
          }
        );
      }),
      APY: _apy,
      epochStrikeTokens,
      TVL: totalEpochDepositsInUSD,
      rewards: rewardsPayLoad.data.rewards,
      collateralExchangeRate: epochData.collateralExchangeRate,
      strikeToIdx: strikeToIdx,
      volumeInUSD: volumeInUSD,
      totalEpochPurchasesInUSD: totalEpochPurchasesInUSD,
      stakingRewards: _stakingRewards,
    };

    set((prevState) => ({ ...prevState, ssovEpochData: _ssovEpochData }));
  },
  updateSsovV3UserData: async () => {
    const {
      contractAddresses,
      accountAddress,
      provider,
      selectedEpoch,
      selectedPoolName,
      getSsovViewerAddress,
      ssovSigner: { ssovStakingRewardsWithSigner },
    } = get();

    const ssovViewerAddress = getSsovViewerAddress();

    if (
      !contractAddresses ||
      !accountAddress ||
      !selectedEpoch ||
      !selectedPoolName ||
      !ssovViewerAddress
    )
      return;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    if (!ssovAddress) return;

    const ssov = SsovV3__factory.connect(ssovAddress, provider);

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      ssovViewerAddress,
      provider
    );

    const writePositions = await ssovViewerContract.walletOfOwner(
      accountAddress,
      ssovAddress
    );

    const data = await Promise.all(
      writePositions.map((i) => {
        return ssov.writePosition(i);
      })
    );

    const checkpointData = await Promise.all(
      data.map((pos) => {
        return ssov.checkpoints(pos.epoch, pos.strike, pos.checkpointIndex);
      })
    );

    const moreData = await Promise.all(
      writePositions.map((i) => {
        return ssovViewerContract.getWritePositionValue(i, ssovAddress);
      })
    );

    // Staking rewards
    const earnedCalls = writePositions.map((writePositionId) => {
      if (ssovStakingRewardsWithSigner) {
        return ssovStakingRewardsWithSigner['earned(address,uint256)'](
          ssov.address,
          writePositionId
        );
      }
    });

    let earnings = await Promise.all(earnedCalls);

    let _rewardTokens: TokenData[][] = [];
    let _rewardAmounts: BigNumber[][] = [];

    if (SSOV_SUPPORTS_STAKING_REWARDS.includes(ssov.address)) {
      for (const earning of earnings) {
        _rewardAmounts.push(earning?.rewardAmounts!);
        let _rewardsTokenData = [];

        for (const rewardToken of earning?.rewardTokens!) {
          const symbol = await ERC20__factory.connect(
            rewardToken,
            provider
          ).symbol();

          let tokenData = {
            symbol: symbol,
            imgSrc: '',
          };

          _rewardsTokenData.push(tokenData);
        }

        _rewardTokens.push(_rewardsTokenData);
      }
    }

    const _writePositions = data.map((o, i) => {
      const utilization = checkpointData[i]?.activeCollateral.isZero()
        ? BigNumber.from(0)
        : checkpointData[i]?.activeCollateral
            .mul(1e2)
            .div(checkpointData[i]?.totalCollateral!);

      return {
        tokenId: writePositions[i] as BigNumber,
        collateralAmount: o.collateralAmount,
        epoch: o.epoch.toNumber(),
        strike: o.strike,
        accruedRewards: moreData[i]?.rewardTokenWithdrawAmounts || [],
        accruedPremiums: moreData[i]?.accruedPremium || BigNumber.from(0),
        utilization: utilization!,
        stakeRewardAmounts: _rewardAmounts[i] ? _rewardAmounts[i] : [],
        stakeRewardTokens: _rewardTokens[i] ? _rewardTokens[i] : [],
      };
    });

    set((prevState) => ({
      ...prevState,
      ssovV3UserData: {
        ...prevState.ssovV3UserData,
        writePositions: _writePositions,
      },
    }));
  },
  updateSsovV3: async () => {
    const {
      chainId,
      contractAddresses,
      selectedPoolName = '',
      provider,
      setSelectedEpoch,
    } = get();
    let _ssovData: SsovV3Data;

    const ssovAddress =
      contractAddresses['SSOV-V3']?.['VAULTS'][selectedPoolName];

    if (!ssovAddress) return;

    const _ssovContract = SsovV3__factory.connect(ssovAddress, provider);

    try {
      const [
        currentEpoch,
        tokenPrice,
        collateralPrice,
        underlyingSymbol,
        collateralToken,
        isPut,
      ] = await Promise.all([
        _ssovContract.currentEpoch(),
        _ssovContract.getUnderlyingPrice(),
        _ssovContract.getCollateralPrice(),
        _ssovContract.underlyingSymbol(),
        _ssovContract.collateralToken(),
        _ssovContract.isPut(),
      ]);

      let _currentEpoch = Number(currentEpoch) === 0 ? 1 : Number(currentEpoch);

      const params = window.location.search.split('?epoch=');

      if (params.length === 2) _currentEpoch = Number(params[1]!);

      const [epochData, collateralSymbol] = await Promise.all([
        _ssovContract.getEpochData(_currentEpoch),
        ERC20__factory.connect(collateralToken, provider).symbol(),
      ]);

      setSelectedEpoch(_currentEpoch);

      _ssovData = {
        underlyingSymbol,
        collateralSymbol,
        collateralAddress: collateralToken,
        isPut,
        ssovContract: _ssovContract,
        currentEpoch: Number(currentEpoch),
        isCurrentEpochExpired: epochData.expired,
        tokenPrice,
        underlyingPrice: tokenPrice,
        collateralPrice,
        lpPrice: ethers.utils.parseEther('1'),
        ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
          chainId === 1088
            ? '0xeec2be5c91ae7f8a338e1e5f3b5de49d07afdc81'
            : '0x2b99e3d67dad973c1b9747da742b7e26c8bdd67b',
          provider
        ),
      };

      set((prevState) => ({ ...prevState, ssovData: _ssovData }));
    } catch (err) {}
  },
  selectedEpoch: 1,
  getSsovViewerAddress: () => {
    const { selectedPoolName, contractAddresses } = get();
    if (!selectedPoolName || !contractAddresses['SSOV-V3']?.['VIEWER']) return;

    return selectedPoolName === 'ETH-CALLS-SSOV-V3'
      ? '0x9F948e9A79186f076EA19f5DDCCDF30eDc6DbaA2'
      : contractAddresses['SSOV-V3']['VIEWER'];
  },
});
