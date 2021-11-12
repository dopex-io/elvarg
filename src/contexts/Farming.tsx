import { createContext, useState, useContext, useCallback } from 'react';
import {
  ERC20__factory,
  StakingRewards__factory,
  UniswapPair__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import BN from 'bignumber.js';

import useEthPrice from 'hooks/useEthPrice';

import { WalletContext } from './Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

export const FarmingContext = createContext<any>({});

const poolTemplateObj = {
  selectedBaseAsset: null,
  selectedBaseAssetContract: null,
  selectedBaseAssetDecimals: null,
  userAssetBalance: null,
  stakingRewardsContractAddress: null,
  userStakedBalance: BigNumber.from(0),
  rewards: null,
  total: null,
  loading: true,
};

export const FarmingProvider = (props) => {
  const { provider, accountAddress, contractAddresses, chainId } =
    useContext(WalletContext);

  const [data, setData] = useState({
    token: null,
    isStake: null,
  });

  const ethPriceFinal = useEthPrice();

  const [pools, setPools] = useState({
    DPX: poolTemplateObj,
    DPX_WETH: poolTemplateObj,
    rDPX_WETH: poolTemplateObj,
    RDPX: poolTemplateObj,
  });

  const [poolsInfo, setPoolsInfo] = useState({
    DPXPool: { APR: null, TVL: null, stakingAsset: 'DPX', tokenPrice: null },
    DPX_WETHPool: {
      APR: null,
      TVL: null,
      stakingAsset: 'DPX-WETH',
      tokenPrice: null,
    },
    rDPX_WETHPool: {
      APR: null,
      TVL: null,
      stakingAsset: 'rDPX-WETH',
      tokenPrice: null,
    },
    RDPXPool: { APR: null, TVL: null, stakingAsset: 'RDPX', tokenPrice: null },
  });

  const [tokensInfo, setTokensInfo] = useState({
    DPX_WETHToken: { DpxPerLp: null, EthPerLp: null, DPXPrice: null },
    rDPX_WETHToken: { rDpxPerLp: null, EthPerLp: null, rDPXPrice: null },
  });

  const setPool = useCallback(
    async (token) => {
      if (chainId === 1) return;
      if (!contractAddresses || !ethPriceFinal || !provider) return;

      const tokenAddress = contractAddresses[token.toUpperCase()];

      const selectedBaseAssetContract = ERC20__factory.connect(
        tokenAddress,
        provider
      );

      const totalTokens = await selectedBaseAssetContract.totalSupply();

      const stakingAsset = token.toUpperCase() + 'StakingRewards';

      if (!contractAddresses[stakingAsset]) return;

      const stakingRewardsContract = StakingRewards__factory.connect(
        contractAddresses[stakingAsset],
        provider
      );

      const totalSupply = await stakingRewardsContract.totalSupply();
      let total = totalSupply;

      let priceLP = 100;
      let priceDPX = 50;
      let priceRDPX = 10;

      let ethReserveOfRdpxWethPool;
      let rdpxReserveOfRdpxWethPool;

      let ethReserveOfDpxWethPool;
      let dpxReserveOfDpxWethPool;

      if (chainId !== 1337) {
        const dpxWethPair = UniswapPair__factory.connect(
          contractAddresses['DPX-WETH'],
          provider
        );

        const rdpxWethPair = UniswapPair__factory.connect(
          contractAddresses['RDPX-WETH'],
          provider
        );

        const [dpxWethReserve, rdpxWethReserve] = await Promise.all([
          await dpxWethPair.getReserves(),
          await rdpxWethPair.getReserves(),
        ]);

        let dpxPrice = new BN(dpxWethReserve[1].toString()).dividedBy(
          dpxWethReserve[0].toString()
        );
        let rdpxPrice = new BN(rdpxWethReserve[1].toString()).dividedBy(
          rdpxWethReserve[0].toString()
        );

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

        priceDPX = Number(dpxPrice) * ethPriceFinal;
        priceRDPX = Number(rdpxPrice) * ethPriceFinal;

        if (token === 'DPX') {
          priceLP = priceDPX;
        } else if (token === 'RDPX') {
          priceLP = priceRDPX;
        } else if (token === 'DPX-WETH') {
          priceLP =
            (priceDPX * Number(dpxReserveOfDpxWethPool) +
              ethPriceFinal * Number(ethReserveOfDpxWethPool)) /
            Number(new BN(totalTokens.toString()).dividedBy(1e18));
        } else {
          priceLP =
            (priceRDPX * Number(rdpxReserveOfRdpxWethPool) +
              ethPriceFinal * Number(ethReserveOfRdpxWethPool)) /
            Number(new BN(totalTokens.toString()).dividedBy(1e18));
        }
      }

      let [DPX, RDPX] = await Promise.all([
        stakingRewardsContract.rewardRateDPX(),
        stakingRewardsContract.rewardRateRDPX(),
      ]);

      const TVL = total.mul(Math.round(priceLP)).div(oneEBigNumber(18));

      let DPXemitted;
      let RDPXemitted;

      const rewardsDuration = BigNumber.from(86400 * 365);
      const boost = token === 'RDPX' ? 2 : 1;

      DPXemitted = DPX.mul(rewardsDuration)
        .mul(Math.round(priceDPX))
        .mul(boost)
        .div(oneEBigNumber(18));
      RDPXemitted = RDPX.mul(rewardsDuration)
        .mul(Math.round(priceRDPX))
        .mul(boost)
        .div(oneEBigNumber(18));

      const denominator =
        TVL.toNumber() + DPXemitted.toNumber() + RDPXemitted.toNumber();
      let APR = (denominator / TVL.toNumber() - 1) * 100;

      if (totalSupply.eq(0)) {
        APR = null;
      }

      if (token === 'DPX') {
        setPoolsInfo((poolsInfo) => ({
          DPXPool: {
            ...poolsInfo.DPXPool,
            APR: APR,
            TVL: TVL,
            tokenPrice: priceLP,
          },
          DPX_WETHPool: {
            ...poolsInfo.DPX_WETHPool,
          },
          rDPX_WETHPool: {
            ...poolsInfo.rDPX_WETHPool,
          },
          RDPXPool: {
            ...poolsInfo.RDPXPool,
          },
        }));
      } else if (token === 'DPX-WETH') {
        setPoolsInfo((poolsInfo) => ({
          DPXPool: {
            ...poolsInfo.DPXPool,
          },
          DPX_WETHPool: {
            ...poolsInfo.DPX_WETHPool,
            APR: APR,
            TVL: TVL,
            tokenPrice: priceLP,
          },
          rDPX_WETHPool: {
            ...poolsInfo.rDPX_WETHPool,
          },
          RDPXPool: {
            ...poolsInfo.RDPXPool,
          },
        }));

        setTokensInfo((tokensInfo) => ({
          DPX_WETHToken: {
            ...tokensInfo.DPX_WETHToken,
            DpxPerLp: new BN(dpxReserveOfDpxWethPool)
              .multipliedBy(10 ** 6)
              .dividedBy(new BN(totalTokens.toString()).dividedBy(1e18))
              .toString(),
            EthPerLp: new BN(ethReserveOfDpxWethPool)
              .multipliedBy(10 ** 6)
              .dividedBy(new BN(totalTokens.toString()).dividedBy(1e18))
              .toString(),
            DPXPrice: priceDPX,
          },
          rDPX_WETHToken: {
            ...tokensInfo.rDPX_WETHToken,
          },
        }));
      } else if (token === 'rDPX-WETH') {
        setPoolsInfo((poolsInfo) => ({
          DPXPool: {
            ...poolsInfo.DPXPool,
          },
          DPX_WETHPool: {
            ...poolsInfo.DPX_WETHPool,
          },
          rDPX_WETHPool: {
            ...poolsInfo.rDPX_WETHPool,
            APR: APR,
            TVL: TVL,
            tokenPrice: priceLP,
          },
          RDPXPool: {
            ...poolsInfo.RDPXPool,
          },
        }));

        setTokensInfo((tokensInfo) => ({
          DPX_WETHToken: {
            ...tokensInfo.DPX_WETHToken,
          },
          rDPX_WETHToken: {
            ...tokensInfo.rDPX_WETHToken,
            rDpxPerLp: new BN(rdpxReserveOfRdpxWethPool)
              .multipliedBy(10 ** 6)
              .dividedBy(new BN(totalTokens.toString()).dividedBy(1e18))
              .toString(),
            EthPerLp: new BN(ethReserveOfRdpxWethPool)
              .multipliedBy(10 ** 6)
              .dividedBy(new BN(totalTokens.toString()).dividedBy(1e18))
              .toString(),
            rDPXPrice: priceRDPX,
          },
        }));
      } else if (token === 'RDPX') {
        setPoolsInfo((poolsInfo) => ({
          DPXPool: {
            ...poolsInfo.DPXPool,
          },
          DPX_WETHPool: {
            ...poolsInfo.DPX_WETHPool,
          },
          rDPX_WETHPool: {
            ...poolsInfo.rDPX_WETHPool,
          },
          RDPXPool: {
            ...poolsInfo.RDPXPool,
            APR: APR,
            TVL: TVL,
            tokenPrice: priceLP,
          },
        }));
      }
    },
    [ethPriceFinal, chainId, contractAddresses, provider]
  );

  const setStakingAsset = useCallback(
    async (token) => {
      if (!accountAddress || !contractAddresses || !provider) return;

      const tokenAddress = contractAddresses[token.toUpperCase()];

      const selectedBaseAssetContract = ERC20__factory.connect(
        tokenAddress,
        provider
      );

      const [selectedBaseAssetDecimals, balance] = await Promise.all([
        selectedBaseAssetContract.decimals(),
        selectedBaseAssetContract.balanceOf(accountAddress),
      ]);

      const stakingAsset = token.toUpperCase() + 'StakingRewards';

      if (!contractAddresses[stakingAsset]) return;

      const stakingRewardsContract = StakingRewards__factory.connect(
        contractAddresses[stakingAsset],
        provider
      );

      const [totalSupply, userStakedBalance, rewards] = await Promise.all([
        stakingRewardsContract.totalSupply(),
        stakingRewardsContract.balanceOf(accountAddress),
        stakingRewardsContract.earned(accountAddress),
      ]);

      if (token === 'DPX') {
        setPools((pools) => ({
          DPX: {
            ...pools.DPX,
            selectedBaseAsset: token,
            selectedBaseAssetContract,
            selectedBaseAssetDecimals,
            userAssetBalance: balance,
            userStakedBalance,
            rewards,
            totalSupply,
            stakingRewardsContractAddress: contractAddresses[stakingAsset],
            loading: false,
          },
          DPX_WETH: {
            ...pools.DPX_WETH,
          },
          rDPX_WETH: {
            ...pools.rDPX_WETH,
          },
          RDPX: {
            ...pools.RDPX,
          },
        }));
      } else if (token === 'DPX-WETH') {
        setPools((pools) => ({
          DPX: {
            ...pools.DPX,
          },
          DPX_WETH: {
            ...pools.DPX_WETH,
            selectedBaseAsset: token,
            selectedBaseAssetContract,
            selectedBaseAssetDecimals,
            userAssetBalance: balance,
            userStakedBalance,
            rewards,
            totalSupply,
            stakingRewardsContractAddress: contractAddresses[stakingAsset],
            loading: false,
          },
          rDPX_WETH: {
            ...pools.rDPX_WETH,
          },
          RDPX: {
            ...pools.RDPX,
          },
        }));
      } else if (token === 'rDPX-WETH') {
        setPools((pools) => ({
          DPX: {
            ...pools.DPX,
          },
          DPX_WETH: {
            ...pools.DPX_WETH,
          },
          rDPX_WETH: {
            ...pools.rDPX_WETH,
            selectedBaseAsset: token,
            selectedBaseAssetContract,
            selectedBaseAssetDecimals,
            userAssetBalance: balance,
            userStakedBalance,
            rewards,
            totalSupply,
            stakingRewardsContractAddress: contractAddresses[stakingAsset],
            loading: false,
          },
          RDPX: {
            ...pools.RDPX,
          },
        }));
      } else if (token === 'RDPX') {
        setPools((pools) => ({
          DPX: {
            ...pools.DPX,
          },
          DPX_WETH: {
            ...pools.DPX_WETH,
          },
          rDPX_WETH: {
            ...pools.rDPX_WETH,
          },
          RDPX: {
            ...pools.RDPX,
            selectedBaseAsset: token,
            selectedBaseAssetContract,
            selectedBaseAssetDecimals,
            userAssetBalance: balance,
            userStakedBalance,
            rewards,
            totalSupply,
            stakingRewardsContractAddress: contractAddresses[stakingAsset],
            loading: false,
          },
        }));
      }
    },
    [accountAddress, contractAddresses, provider]
  );

  let contextValue = {
    ...data,
    ...pools,
    ...poolsInfo,
    ...tokensInfo,
    setData,
    setStakingAsset,
    setPool,
  };

  return (
    <FarmingContext.Provider value={contextValue}>
      {props.children}
    </FarmingContext.Provider>
  );
};
