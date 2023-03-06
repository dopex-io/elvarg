import { BigNumber } from 'ethers';

import {
  ERC20__factory,
  StakingRewardsV3__factory,
  UniswapPair__factory,
} from '@dopex-io/sdk';
import axios from 'axios';
import BN from 'bignumber.js';
import { Farm, LpData, UserData } from 'types/farms';
import { StateCreator } from 'zustand';

import { AssetsSlice } from 'store/Assets';
import { WalletSlice } from 'store/Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

const initialLpData = {
  ethReserveOfDpxWethPool: 0,
  dpxReserveOfDpxWethPool: 0,
  ethReserveOfRdpxWethPool: 0,
  rdpxReserveOfRdpxWethPool: 0,
  dpxPrice: 0,
  rdpxPrice: 0,
  rdpxWethLpTokenRatios: { rdpx: 0, weth: 0, lpPrice: 0 },
  dpxWethLpTokenRatios: { dpx: 0, weth: 0, lpPrice: 0 },
};

export interface FarmingSlice {
  userData: UserData[];
  lpData: LpData;
  updateLpData: Function;
  getFarmData: Function;
  getUserData: Function;
}

export const createFarmingSlice: StateCreator<
  FarmingSlice & AssetsSlice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  FarmingSlice
> = (set, get) => ({
  userData: [],
  getUserData: async (farm: Farm) => {
    const { accountAddress, provider } = get();
    if (!accountAddress) return;
    const stakingTokenContract = ERC20__factory.connect(
      farm.stakingTokenAddress,
      provider
    );

    const stakingRewardsContract = StakingRewardsV3__factory.connect(
      farm.stakingRewardsAddress,
      provider
    );

    const [userStakingTokenBalance, userStakingRewardsBalance] =
      await Promise.all([
        stakingTokenContract.balanceOf(accountAddress),
        stakingRewardsContract.balanceOf(accountAddress),
      ]);

    let userRewardsEarned: BigNumber;

    try {
      userRewardsEarned = await stakingRewardsContract.earned(accountAddress);
    } catch {
      userRewardsEarned = BigNumber.from(0);
    }

    set((prevState: { userData: any }) => ({
      ...prevState,
      userData: {
        ...prevState.userData,
        userStakingTokenBalance,
        userStakingRewardsBalance,
        userRewardsEarned: [userRewardsEarned],
      },
    }));

    return {
      userStakingTokenBalance,
      userStakingRewardsBalance,
      userRewardsEarned: [userRewardsEarned],
    };
  },
  lpData: initialLpData,
  updateLpData: async () => {
    const { provider, chainId, contractAddresses } = get();

    if (!provider) return;
    if (chainId === 421613) return;

    const ethPriceFinal = (
      await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
    ).data.ethereum.usd;

    const dpxWethPair = UniswapPair__factory.connect(
      contractAddresses['DPX-WETH'],
      provider
    );

    const rdpxWethPair = UniswapPair__factory.connect(
      contractAddresses['RDPX-WETH'],
      provider
    );

    const [
      dpxWethReserve,
      rdpxWethReserve,
      dpxWethTotalSupply,
      rdpxWethTotalSupply,
    ] = await Promise.all([
      dpxWethPair.getReserves(),
      rdpxWethPair.getReserves(),
      dpxWethPair.totalSupply(),
      rdpxWethPair.totalSupply(),
    ]);

    let dpxPrice: number = new BN(dpxWethReserve[1].toString())
      .dividedBy(dpxWethReserve[0].toString())
      .toNumber();
    let rdpxPrice: number = new BN(rdpxWethReserve[1].toString())
      .dividedBy(rdpxWethReserve[0].toString())
      .toNumber();

    let ethReserveOfRdpxWethPool: number;
    let rdpxReserveOfRdpxWethPool: number;

    let ethReserveOfDpxWethPool: number;
    let dpxReserveOfDpxWethPool: number;

    // DPX and ETH from DPX-ETH pair
    ethReserveOfDpxWethPool = new BN(dpxWethReserve[1].toString())
      .dividedBy(1e18)
      .toNumber();
    dpxReserveOfDpxWethPool = new BN(dpxWethReserve[0].toString())
      .dividedBy(1e18)
      .toNumber();

    // RDPX and ETH from RDPX-ETH pair
    ethReserveOfRdpxWethPool = new BN(rdpxWethReserve[1].toString())
      .dividedBy(1e18)
      .toNumber();
    rdpxReserveOfRdpxWethPool = new BN(rdpxWethReserve[0].toString())
      .dividedBy(1e18)
      .toNumber();

    dpxPrice = Number(dpxPrice) * ethPriceFinal;
    rdpxPrice = Number(rdpxPrice) * ethPriceFinal;

    set((prevState: { lpData: any }) => ({
      ...prevState,
      lpData: {
        ...prevState.lpData,
        ethReserveOfDpxWethPool,
        dpxReserveOfDpxWethPool,
        ethReserveOfRdpxWethPool,
        rdpxReserveOfRdpxWethPool,
        dpxPrice,
        rdpxPrice,
        rdpxWethLpTokenRatios: {
          rdpx: new BN(rdpxReserveOfRdpxWethPool)
            .dividedBy(new BN(rdpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
          weth: new BN(ethReserveOfRdpxWethPool)
            .dividedBy(new BN(rdpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
          lpPrice:
            (rdpxPrice * Number(rdpxReserveOfRdpxWethPool) +
              ethPriceFinal * Number(ethReserveOfRdpxWethPool)) /
            Number(new BN(rdpxWethTotalSupply.toString()).dividedBy(1e18)),
        },
        dpxWethLpTokenRatios: {
          dpx: new BN(dpxReserveOfDpxWethPool)
            .dividedBy(new BN(dpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
          weth: new BN(ethReserveOfDpxWethPool)
            .dividedBy(new BN(dpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
          lpPrice:
            (dpxPrice * Number(dpxReserveOfDpxWethPool) +
              ethPriceFinal * Number(ethReserveOfDpxWethPool)) /
            Number(new BN(dpxWethTotalSupply.toString()).dividedBy(1e18)),
        },
      },
    }));
  },
  getFarmData: async (farm: Farm, lpData: LpData) => {
    const { provider } = get();
    if (!provider) {
      return;
    }
    if (farm.status !== 'ACTIVE') {
      return { APR: 0, TVL: 0 };
    }

    const ethPriceFinal = (
      await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
    ).data.ethereum.usd;

    const {
      ethReserveOfDpxWethPool,
      dpxReserveOfDpxWethPool,
      ethReserveOfRdpxWethPool,
      rdpxReserveOfRdpxWethPool,
      dpxPrice,
      rdpxPrice,
    } = lpData;

    const stakingTokenContract = ERC20__factory.connect(
      farm.stakingTokenAddress,
      provider
    );

    const stakingRewardsContract = StakingRewardsV3__factory.connect(
      farm.stakingRewardsAddress,
      provider
    );

    let [farmTotalSupply, tokenTotalSupply] = await Promise.all([
      stakingRewardsContract.totalSupply(),
      stakingTokenContract.totalSupply(),
    ]);

    let priceLP;

    if (farm.stakingTokenSymbol === 'DPX') {
      priceLP = dpxPrice;
    } else if (farm.stakingTokenSymbol === 'RDPX') {
      priceLP = rdpxPrice;
    } else if (farm.stakingTokenSymbol === 'DPX-WETH') {
      priceLP =
        (dpxPrice * Number(dpxReserveOfDpxWethPool) +
          ethPriceFinal * Number(ethReserveOfDpxWethPool)) /
        Number(new BN(tokenTotalSupply.toString()).dividedBy(1e18));
    } else {
      priceLP =
        (rdpxPrice * Number(rdpxReserveOfRdpxWethPool) +
          ethPriceFinal * Number(ethReserveOfRdpxWethPool)) /
        Number(new BN(tokenTotalSupply.toString()).dividedBy(1e18));
    }

    let [DPX] = await Promise.all([stakingRewardsContract.rewardRate()]);

    const TVL = farmTotalSupply
      .mul(Math.round(priceLP))
      .div(oneEBigNumber(18))
      .toNumber();

    let DPXemitted;

    const rewardsDuration = BigNumber.from(86400 * 365);

    DPXemitted = DPX.mul(rewardsDuration)
      .mul(Math.round(dpxPrice))
      .div(oneEBigNumber(18));

    const denominator = TVL + DPXemitted.toNumber();
    let APR: number | null = (denominator / TVL - 1) * 100;

    if (farmTotalSupply.eq(0)) {
      APR = null;
    }

    return { TVL, APR, farmTotalSupply };
  },
});
