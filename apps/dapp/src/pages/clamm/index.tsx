import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { UniswapV3Pool__factory } from '@dopex-io/sdk';
import { NextSeo } from 'next-seo';
import { Address, useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import { useBoundStore } from 'store';

import AsidePanel from 'components/clamm/AsidePanel';
import Positions from 'components/clamm/Tables/Positions';
import StrikesChain from 'components/clamm/Tables/StrikesChain';
import AppBar from 'components/common/AppBar';
import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';

import getTokensData from 'utils/clamm/getTokensData';
import getUniswapPoolData from 'utils/clamm/getUniswapPoolData';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import parseOptionsPosition from 'utils/clamm/parseOptionsPosition';
import parsePriceFromTick from 'utils/clamm/parsePriceFromTick';
import parseTickData from 'utils/clamm/parseTickData';
import parseWritePosition, {
  WritePosition,
} from 'utils/clamm/parseWritePosition';

import { CLAMM_PAIRS_TO_ADDRESSES } from 'constants/clamm';
import seo from 'constants/seo';

import { PairSelector } from '../../components/clamm/TitleBar/PairSelector';
import fetchTicksdata from '../../utils/clamm/subgraph/fetchTicksData';
import getUserPositions from '../../utils/clamm/subgraph/getUserPositions';

const ClammPage = () => {
  const {
    updateUserAddress,
    selectedOptionsPoolPair,
    setLoading,
    loading,
    setOptionsPool,
    setTicksData,
    setMarkPrice,
    setKeys,
    setUserClammPositions,
    updateOptionsPoolTickAndSqrtX96Price,
    optionsPool,
    ticksData,
    setPositionManagerAddress,
  } = useBoundStore();
  const { address: userAddress } = useAccount();

  useEffect(() => {
    updateUserAddress(userAddress);
  }, [updateUserAddress, userAddress]);

  const updateOptionsPoolTick = useCallback(async () => {
    const { collateralTokenAddress, optionsPoolAddress, uniswapV3PoolAddress } =
      CLAMM_PAIRS_TO_ADDRESSES[selectedOptionsPoolPair.joined];

    const data = await readContract({
      address: uniswapV3PoolAddress,
      abi: UniswapV3Pool__factory.abi,
      functionName: 'slot0',
    });

    const sqrtX96Price = data[0];
    const tick = data[1];

    updateOptionsPoolTickAndSqrtX96Price(tick, sqrtX96Price);
  }, [selectedOptionsPoolPair.joined, updateOptionsPoolTickAndSqrtX96Price]);

  const loadOptionsPool = useCallback(async () => {
    setLoading('optionsPool', true);
    const { collateralTokenAddress, optionsPoolAddress, uniswapV3PoolAddress } =
      CLAMM_PAIRS_TO_ADDRESSES[selectedOptionsPoolPair.joined];

    // @TODO: load from sdk
    const positionManagerAddress = '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F';

    setPositionManagerAddress(positionManagerAddress);

    const { sqrtX96Price, tick, tickSpacing, token0, token1 } =
      await getUniswapPoolData(uniswapV3PoolAddress);
    const { token0Decimals, token0Symbol, token1Decimals, token1Symbol } =
      await getTokensData(token0, token1);

    const inversePrice = collateralTokenAddress === token0;
    if (inversePrice) {
      setKeys({
        putAssetAmountKey: 'token0Amount',
        putAssetSymbolKey: 'token0Symbol',
        putAssetDecimalsKey: 'token0Decimals',
        putAssetAddressKey: 'token0Address',
        putAssetGetLiquidity: 'getLiquidityForAmounts0',
        callAssetAmountKey: 'token1Amount',
        callAssetSymbolKey: 'token1Symbol',
        callAssetDecimalsKey: 'token1Decimals',
        callAssetAddressKey: 'token1Address',
        callAssetGetLiquidity: 'getLiquidityForAmounts1',
      });
    }

    setMarkPrice(
      parsePriceFromTick(
        tick,
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
      ),
    );

    const rawTickData = await fetchTicksdata();
    if (rawTickData) {
      const parsedTicksData = rawTickData.map((data) =>
        parseTickData(
          sqrtX96Price,
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          data,
        ),
      );
      setTicksData(parsedTicksData);
    }
    setOptionsPool({
      address: optionsPoolAddress,
      uniswapV3PoolAddress,
      sqrtX96Price,
      tick,
      tickSpacing,
      token0Decimals,
      token0Symbol,
      token0Address: token0,
      token1Decimals,
      token1Symbol,
      token1Address: token1,
      inversePrice: inversePrice,
      getLiquidityForAmounts0: getLiquidityForAmount0,
      getLiquidityForAmounts1: getLiquidityForAmount1,
    });
    setLoading('optionsPool', false);
  }, [
    setPositionManagerAddress,
    setKeys,
    setMarkPrice,
    setLoading,
    selectedOptionsPoolPair.joined,
    setOptionsPool,
    setTicksData,
  ]);

  const loadPositions = useCallback(async () => {
    if (loading.optionsPool) return;
    if (!optionsPool) return;
    if (!userAddress) return;

    setLoading('positions', true);
    const userPositions = await getUserPositions(
      userAddress,
      optionsPool.uniswapV3PoolAddress,
    );

    const { optionsPositions, writePositions } = userPositions;
    const { inversePrice, token0Decimals, token1Decimals, sqrtX96Price } =
      optionsPool;

    const parsedWritePositions = writePositions
      .map((writePosition) => {
        const tickData = ticksData.find((data) => {
          return (
            writePosition.tickLower === data.tickLower &&
            writePosition.tickUpper === data.tickUpper
          );
        });

        if (!tickData) return;

        return parseWritePosition(
          sqrtX96Price,
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          tickData,
          writePosition,
        );
      })
      .filter((position): position is WritePosition => position !== undefined);

    const parsedOptionsPositions = optionsPositions.map((position) => {
      return parseOptionsPosition(
        sqrtX96Price,
        optionsPool.tick,
        optionsPool.tickSpacing,
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
        position,
      );
    }, []);

    setUserClammPositions(parsedWritePositions, parsedOptionsPositions);
    setLoading('positions', false);
  }, [
    loading.optionsPool,
    optionsPool,
    userAddress,
    ticksData,
    setUserClammPositions,
    setLoading,
  ]);

  useEffect(() => {
    loadOptionsPool();
  }, [loadOptionsPool]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  return (
    <div className="overflow-x-hidden bg-black h-screen">
      <NextSeo
        title={`${seo.clamm.title}`}
        description={seo.clamm.description}
        canonical={seo.clamm.url}
        openGraph={{
          url: seo.clamm.url,
          title: seo.clamm.title,
          description: seo.clamm.description,
          images: [
            {
              url: seo.clamm.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.clamm.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <PageLayout>
        {/* <TitleBar /> */}
        <PairSelector />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          {/* <PriceChartRangeSelectorWrapper /> */}
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <PriceChart
              market={selectedOptionsPoolPair.underlyingTokenSymbol}
            />

            <div className="space-y-4">
              <StrikesChain />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/3 h-full space-y-4 sticky top-20">
            <AsidePanel
              loadOptionsPool={loadOptionsPool}
              loadPositions={loadPositions}
            />
            {/* <InfoBox /> */}
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default ClammPage;
