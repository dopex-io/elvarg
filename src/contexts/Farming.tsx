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
  StakingRewards__factory,
  UniswapPair__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import BN from 'bignumber.js';
import axios from 'axios';

import { WalletContext } from './Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

export const FarmingContext = createContext<{
  farmsData: { TVL: number; APR: number }[];
  userData: {
    userStakingTokenBalance: BigNumber;
    userStakingRewardsBalance: BigNumber;
    userRewardsEarned: BigNumber[];
  }[];
  farmsDataLoading: boolean;
  userDataLoading: boolean;
  lpData: any;
}>({
  farmsData: [],
  farmsDataLoading: false,
  userDataLoading: false,
  userData: [],
  lpData: {},
});

interface LpData {
  ethReserveOfDpxWethPool: number;
  dpxReserveOfDpxWethPool: number;
  ethReserveOfRdpxWethPool: number;
  rdpxReserveOfRdpxWethPool: number;
  dpxPrice: number;
  rdpxPrice: number;
  rdpxWethLpTokenRatios: { rdpx: number; weth: number };
  dpxWethLpTokenRatios: { dpx: number; weth: number };
}

export type Farm = {
  stakingToken: string;
  stakingTokenAddress: string;
  stakingRewardsAddress: string;
  rewardTokens: any;
  status: 'ACTIVE' | 'RETIRED';
  type: 'SINGLE' | 'LP';
};

const REWARD_TOKENS = [
  {
    symbol: 'DPX',
    address: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
  },
  {
    symbol: 'RDPX',
    address: '0x32eb7902d4134bf98a28b963d26de779af92a212',
  },
];

export const FARMS: { [key: number]: Farm[] } = {
  42161: [
    {
      stakingToken: 'DPX',
      stakingTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
      stakingRewardsAddress: '0xc6D714170fE766691670f12c2b45C1f34405AAb6',
      rewardTokens: REWARD_TOKENS,
      status: 'ACTIVE',
      type: 'SINGLE',
    },
    {
      stakingToken: 'DPX-WETH',
      stakingTokenAddress: '0x0C1Cf6883efA1B496B01f654E247B9b419873054',
      stakingRewardsAddress: '0x96B0d9c85415C69F4b2FAC6ee9e9CE37717335B4',
      rewardTokens: REWARD_TOKENS,
      status: 'ACTIVE',
      type: 'LP',
    },
    {
      stakingToken: 'RDPX-WETH',
      stakingTokenAddress: '0x7418F5A2621E13c05d1EFBd71ec922070794b90a',
      stakingRewardsAddress: '0x03ac1Aa1ff470cf376e6b7cD3A3389Ad6D922A74',
      rewardTokens: REWARD_TOKENS,
      status: 'ACTIVE',
      type: 'LP',
    },
    {
      stakingToken: 'RDPX',
      stakingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
      stakingRewardsAddress: '0x8d481245801907b45823Fb032E6848d0D3c29AE5',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'SINGLE',
    },
    {
      stakingToken: 'RDPX',
      stakingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
      stakingRewardsAddress: '0x125Cc7CCE81A809c825C945E5aA874E60ccCB6Bb',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'SINGLE',
    },
  ],
  1: [
    {
      stakingToken: 'DPX-WETH',
      stakingTokenAddress: '0xf64af01a14c31164ff7381cf966df6f2b4cb349f',
      stakingRewardsAddress: '0x2a52330be21d311a7a3f40dacbfee8978541b74a',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'LP',
    },
    {
      stakingToken: 'RDPX-WETH',
      stakingTokenAddress: '0x0bf46ba06dc1d33c3bd80ff42497ebff13a88900',
      stakingRewardsAddress: '0x175029c85b14c326c83c9f83d4a21ca339f44cb5',
      rewardTokens: REWARD_TOKENS,
      status: 'RETIRED',
      type: 'LP',
    },
  ],
};

export const FarmingProvider = (props: { children: ReactNode }) => {
  const { provider, accountAddress, chainId, contractAddresses } =
    useContext(WalletContext);

  const [farmsData, setFarmsData] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);
  const [lpData, setLpData] = useState<LpData | null>(null);
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
        },
        dpxWethLpTokenRatios: {
          dpx: new BN(dpxReserveOfDpxWethPool)
            .dividedBy(new BN(dpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
          weth: new BN(ethReserveOfDpxWethPool)
            .dividedBy(new BN(dpxWethTotalSupply.toString()).dividedBy(1e18))
            .toNumber(),
        },
      });
    }

    updateLpData();
  }, [contractAddresses, provider]);

  const getFarmData = useCallback(
    async (farm: Farm, lpData: any) => {
      if (farm.status === 'RETIRED') {
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

      const stakingRewardsContract = StakingRewards__factory.connect(
        farm.stakingRewardsAddress,
        provider
      );

      let [farmTotalSupply, tokenTotalSupply] = await Promise.all([
        stakingRewardsContract.totalSupply(),
        stakingTokenContract.totalSupply(),
      ]);

      let priceLP;

      if (farm.stakingToken === 'DPX') {
        priceLP = dpxPrice;
      } else if (farm.stakingToken === 'RDPX') {
        priceLP = rdpxPrice;
      } else if (farm.stakingToken === 'DPX-WETH') {
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

      let [DPX, RDPX] = await Promise.all([
        stakingRewardsContract.rewardRateDPX(),
        stakingRewardsContract.rewardRateRDPX(),
      ]);

      const TVL = farmTotalSupply
        .mul(Math.round(priceLP))
        .div(oneEBigNumber(18))
        .toNumber();

      let DPXemitted;
      let RDPXemitted;

      const rewardsDuration = BigNumber.from(86400 * 365);

      DPXemitted = DPX.mul(rewardsDuration)
        .mul(Math.round(dpxPrice))
        .div(oneEBigNumber(18));
      RDPXemitted = RDPX.mul(rewardsDuration)
        .mul(Math.round(rdpxPrice))
        .div(oneEBigNumber(18));

      const denominator = TVL + DPXemitted.toNumber() + RDPXemitted.toNumber();
      let APR: number | null = (denominator / TVL - 1) * 100;

      if (farmTotalSupply.eq(0)) {
        APR = null;
      }

      return { TVL, APR };
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
        setFarmsData(p);
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

      const stakingRewardsContract = StakingRewards__factory.connect(
        farm.stakingRewardsAddress,
        provider
      );

      const [
        userStakingTokenBalance,
        userStakingRewardsBalance,
        userRewardsEarned,
      ] = await Promise.all([
        stakingTokenContract.balanceOf(accountAddress),
        stakingRewardsContract.balanceOf(accountAddress),
        stakingRewardsContract.earned(accountAddress),
      ]);

      return {
        userStakingTokenBalance,
        userStakingRewardsBalance,
        userRewardsEarned,
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

      setUserData(p);
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
