import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  ERC20__factory,
  StakingRewardV3__factory,
  UniswapPair__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import BN from 'bignumber.js';
import axios from 'axios';

import { WalletContext } from './Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

import { FARMS } from 'constants/farms';

import { FarmData, UserData, LpData, Farm } from 'types/farms';

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

export const FarmingContext = createContext<{
  farmsData: FarmData[];
  userData: UserData[];
  farmsDataLoading: boolean;
  userDataLoading: boolean;
  lpData: LpData;
}>({
  farmsData: [],
  farmsDataLoading: false,
  userDataLoading: false,
  userData: [],
  lpData: initialLpData,
});

export const FarmingProvider = (props: { children: ReactNode }) => {
  const { provider, accountAddress, chainId, contractAddresses } =
    useContext(WalletContext);

  const [farmsData, setFarmsData] = useState<FarmData[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [lpData, setLpData] = useState<LpData>(initialLpData);
  const [farmsDataLoading, setFarmsDataLoading] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);

  useEffect(() => {
    async function updateLpData() {
      if (!provider) return;

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
        await dpxWethPair.getReserves(),
        await rdpxWethPair.getReserves(),
        await dpxWethPair.totalSupply(),
        await rdpxWethPair.totalSupply(),
      ]);

      let dpxPrice: BN | number = new BN(
        dpxWethReserve[1].toString()
      ).dividedBy(dpxWethReserve[0].toString());
      let rdpxPrice: BN | number = new BN(
        rdpxWethReserve[1].toString()
      ).dividedBy(rdpxWethReserve[0].toString());

      let ethReserveOfRdpxWethPool;
      let rdpxReserveOfRdpxWethPool;

      let ethReserveOfDpxWethPool;
      let dpxReserveOfDpxWethPool;

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

      setLpData({
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
      });
    }

    updateLpData();
  }, [contractAddresses, provider]);

  const getFarmData = useCallback(
    async (farm: Farm, lpData: any) => {
      if (!provider) {
        return;
      }
      if (farm.status === 'RETIRED') {
        return { APR: 0, TVL: 0 };
      }

      if (farm.version === 3) {
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

      const stakingRewardsContract = StakingRewardV3__factory.connect(
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
    [provider]
  );

  useEffect(() => {
    async function getAllFarmData() {
      setFarmsDataLoading(true);
      if (!lpData) return;
      const _farms = FARMS[chainId];
      if (_farms) {
        const p = await Promise.all(
          _farms.map((farm) => getFarmData(farm, lpData))
        );
        setFarmsDataLoading(false);
        setFarmsData(p as FarmData[]);
      }
    }

    getAllFarmData();
  }, [chainId, getFarmData, lpData]);

  const getUserData = useCallback(
    async (farm: Farm) => {
      if (!accountAddress) return;
      const stakingTokenContract = ERC20__factory.connect(
        farm.stakingTokenAddress,
        provider
      );

      const stakingRewardsContract = StakingRewardV3__factory.connect(
        farm.stakingRewardsAddress,
        provider
      );

      const [userStakingTokenBalance, userStakingRewardsBalance] =
        await Promise.all([
          stakingTokenContract.balanceOf(accountAddress),
          stakingRewardsContract.balanceOf(accountAddress),
        ]);

      let userRewardsEarned;

      try {
        userRewardsEarned = await stakingRewardsContract.earned(accountAddress);
      } catch {
        userRewardsEarned = BigNumber.from(0);
      }

      return {
        userStakingTokenBalance,
        userStakingRewardsBalance,
        userRewardsEarned: [userRewardsEarned],
      };
    },
    [accountAddress, provider]
  );

  useEffect(() => {
    async function getAllUserData() {
      setUserDataLoading(true);
      const p = await Promise.all(
        FARMS[chainId]?.map((farm) => getUserData(farm)) || []
      );

      setUserData(p as UserData[]);
      setUserDataLoading(false);
    }

    getAllUserData();
  }, [chainId, getUserData]);

  let contextValue = {
    lpData,
    farmsData,
    userData,
    farmsDataLoading,
    userDataLoading,
  };

  return (
    <FarmingContext.Provider value={contextValue}>
      {props.children}
    </FarmingContext.Provider>
  );
};
