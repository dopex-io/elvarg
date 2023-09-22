import { useCallback, useEffect, useState } from 'react';

import { UniswapV3Pool__factory } from '@dopex-io/sdk';
import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import { useBoundStore } from 'store';

import AsidePanel from 'components/clamm/AsidePanel';
import DisclaimerDialog from 'components/clamm/DisclaimerDialog';
import Positions from 'components/clamm/Tables/Positions';
import StrikesChain from 'components/clamm/Tables/StrikesChain';
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
import parseWritePosition, {
  WritePosition,
} from 'utils/clamm/parseWritePosition';
import getUserOptionsExercises from 'utils/clamm/subgraph/getUserOptionsExercises';
import getUserOptionsPositions from 'utils/clamm/subgraph/getUserOptionsPositions';
import getUserOptionsPurchases from 'utils/clamm/subgraph/getUserOptionsPurchases';
import getUserWritePositions from 'utils/clamm/subgraph/getUserWritePositions';

import { CLAMM_PAIRS_TO_ADDRESSES } from 'constants/clamm';
import seo from 'constants/seo';

import { PairSelector } from '../../components/clamm/TitleBar/PairSelector';

const ClammPage = () => {
  const {
    selectedOptionsPoolPair,
    setLoading,
    setOptionsPool,
    setMarkPrice,
    setKeys,
    setPositionManagerAddress,
    updateUserAddress,
    ticksData,
    optionsPool,
    setUserClammPositions,
  } = useBoundStore();

  const { address: userAddress } = useAccount();

  // const userAddress = '0x5f774bfca7aacab1d30401d0675c5d03e0601944';
  const [isAgree, setIsAgree] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => setIsOpen(false);

  // const updateOptionsPoolTick = useCallback(async () => {
  //   const { collateralTokenAddress, optionsPoolAddress, uniswapV3PoolAddress } =
  //     CLAMM_PAIRS_TO_ADDRESSES[selectedOptionsPoolPair.joined];

  //   const data = await readContract({
  //     address: uniswapV3PoolAddress,
  //     abi: UniswapV3Pool__factory.abi,
  //     functionName: 'slot0',
  //   });

  //   const sqrtX96Price = data[0];
  //   const tick = data[1];

  //   updateOptionsPoolTickAndSqrtX96Price(tick, sqrtX96Price);
  // }, [selectedOptionsPoolPair.joined, updateOptionsPoolTickAndSqrtX96Price]);

  const handleAgree = useCallback(async () => {
    if (!userAddress) return;
    localStorage.setItem(userAddress + '-clamm', 'true');
    setIsAgree(true);
  }, [userAddress]);

  const userAgreementCheck = useCallback(async () => {
    if (!userAddress) return;
    let data = localStorage.getItem(userAddress + '-clamm') as any;
    if (data as boolean) {
      setIsAgree(true);
    } else {
      setIsAgree(false);
    }
  }, [userAddress, setIsAgree]);

  useEffect(() => {
    userAgreementCheck();
  }, [userAgreementCheck]);

  const loadOptionsPool = useCallback(async () => {
    setLoading('optionsPool', true);
    const { collateralTokenAddress, optionsPoolAddress, uniswapV3PoolAddress } =
      CLAMM_PAIRS_TO_ADDRESSES[selectedOptionsPoolPair.joined];

    // @TODO: load from sdk
    const positionManagerAddress = '0x16594f1C98dC142aBccfA3D07FB0d8A6aa0992A0';

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
  ]);

  const updateUserWritePositions = useCallback(async () => {
    if (!optionsPool) return;
    if (!userAddress) return;
    if (ticksData.length === 0) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
      sqrtX96Price,
    } = optionsPool;

    setLoading('writePositions', true);
    const positions = await getUserWritePositions(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedPositions = positions
      .map((position) => {
        const tickData = ticksData.find((data) => {
          return (
            position.tickLower === data.tickLower &&
            position.tickUpper === data.tickUpper
          );
        });

        if (!tickData) return;
        return parseWritePosition(
          sqrtX96Price,
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          tickData,
          position,
        );
      })
      .filter((position): position is WritePosition => position !== undefined);

    setUserClammPositions('writePositions', parsedPositions);
    setLoading('writePositions', false);
  }, [optionsPool, ticksData, setUserClammPositions, setLoading, userAddress]);

  const updateUserOptionsPositions = useCallback(async () => {
    if (!optionsPool) return;
    if (!userAddress) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
    } = optionsPool;

    setLoading('optionsPositions', true);
    const positions = await getUserOptionsPositions(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedPositions = positions
      .map((position) => {
        return parseOptionsPosition(
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          position,
        );
      })
      .filter(
        (position) =>
          position.expiry > BigInt((new Date().getTime() / 1000).toFixed(0)),
      );

    setUserClammPositions('optionsPositions', parsedPositions);
    setLoading('optionsPositions', false);
  }, [optionsPool, setUserClammPositions, setLoading, userAddress]);

  const updateUserPositionsHistory = useCallback(async () => {
    if (!optionsPool) return;
    if (!userAddress) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
    } = optionsPool;

    setLoading('positionsHistory', true);

    const optionsPurchased = await getUserOptionsPurchases(
      uniswapV3PoolAddress,
      userAddress,
    );

    const optionsExercised = await getUserOptionsExercises(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedOptionsPurchased = optionsPurchased.map((position) => {
      const parsed = parseOptionsPosition(
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
        position,
      );

      return {
        ...parsed,
        timestamp: position.timestamp,
      };
    });

    const parsedOptionsExercised = optionsExercised.map((position) => {
      const parsed = parseOptionsPosition(
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
        position,
      );

      return {
        ...parsed,
        timestamp: position.timestamp,
      };
    });

    setUserClammPositions('optionsExercises', parsedOptionsExercised);
    setUserClammPositions('optionsPurchases', parsedOptionsPurchased);
    setLoading('positionsHistory', false);
  }, [optionsPool, setUserClammPositions, setLoading, userAddress]);

  useEffect(() => {
    loadOptionsPool();
  }, [loadOptionsPool]);

  useEffect(() => {
    updateUserWritePositions();
  }, [updateUserWritePositions]);

  useEffect(() => {
    updateUserOptionsPositions();
  }, [updateUserOptionsPositions]);

  useEffect(() => {
    updateUserPositionsHistory();
  }, [updateUserPositionsHistory]);

  useEffect(() => {
    updateUserAddress(userAddress);
  }, [updateUserAddress, userAddress]);

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
      <PageLayout>
        <DisclaimerDialog
          isOpen={isOpen}
          handleClose={handleClose}
          isAgree={isAgree}
          handleAgree={handleAgree}
        />
        <div className="flex space-x-0 lg:space-x-8 flex-col sm:flex-col md:flex-col lg:flex-row space-y-4 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full h-full max-w-[1920px] flex-1">
            <PairSelector />
            <PriceChart
              market={selectedOptionsPoolPair.underlyingTokenSymbol}
            />
            <div className="space-y-4">
              <StrikesChain />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col h-full space-y-4 sticky top-20 min-w-[366px] max-w-[366px]">
            <AsidePanel />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default ClammPage;
