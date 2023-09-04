import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';

import { useBoundStore } from 'store';
import { ClammPair } from 'store/Vault/clamm';

import AsidePanel from 'components/clamm/AsidePanel';
import InfoBox from 'components/clamm/InfoBox';
import Positions from 'components/clamm/Tables/Positions';
import StrikesChain from 'components/clamm/Tables/StrikesChain';
import { TitleBar } from 'components/clamm/TitleBar';
import AppBar from 'components/common/AppBar';
import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';

import getMarketInformation from 'utils/clamm/getMarketInformation';
import getPoolSlot0 from 'utils/clamm/getPoolSlot0';
import getPoolTickSpacing from 'utils/clamm/getPoolTickSpacing';
import getPoolTokens from 'utils/clamm/getPoolTokens';
import splitMarketPair from 'utils/clamm/splitMarketPair';

import seo from 'constants/seo';

const ClammPage = () => {
  const router = useRouter();

  const {
    provider,
    updateClammData,
    updateUserAddress,
    updateSelectedPair,
    selectedPair,
    updateSelectedUniswapPool,
  } = useBoundStore();
  const { address: userAddress } = useAccount();

  const updateAll = useCallback(async () => {
    if (!provider) return;
    updateClammData();
  }, [provider, updateClammData]);

  useEffect(() => {
    updateAll();
    updateUserAddress(userAddress);
  }, [updateAll, updateUserAddress, userAddress]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateAll();
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [updateAll]);
  const DEFAULT_PAIR = 'ARB-USDC';

  useEffect(() => {
    let pair = router.query?.clamm;

    if (!pair) {
      router.replace(router.asPath, `/clamm/${DEFAULT_PAIR}`);
      pair = DEFAULT_PAIR;
    } else {
      pair = pair[0] as ClammPair;
    }

    // updateSelectedPair(pair);
  }, [router, updateSelectedPair]);

  useEffect(() => {
    (async () => {
      const {
        collateralTokenAddress,
        underlyingTokenAddress,
        uniswapPoolAddress,
        optionPool,
        underlyingTokenSymbol,
        collateralTokenSymbol,
      } = getMarketInformation(selectedPair);

      const calls = [getPoolSlot0(uniswapPoolAddress)];

      const [slot0, tickSpacing, [token0, token1]] = await Promise.all([
        getPoolSlot0(uniswapPoolAddress),
        getPoolTickSpacing(uniswapPoolAddress),
        getPoolTokens(uniswapPoolAddress),
      ]);

      updateSelectedUniswapPool({
        address: uniswapPoolAddress,
        collateralToken: collateralTokenAddress,
        underlyingToken: underlyingTokenAddress,
        // @ts-ignore
        currentTick: slot0[1],
        // @ts-ignore
        sqrtX96: slot0[0],
        strikes: [],
        tickSpacing: tickSpacing,
        // @ts-ignore
        token0: token0,
        // @ts-ignore
        token1: token1,
        optionPool: optionPool,
        underlyingTokenSymbol: underlyingTokenSymbol,
        collateralTokenSymbol: collateralTokenSymbol,
      });
    })();
  }, [selectedPair, updateSelectedUniswapPool]);

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
        <TitleBar />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            {/* <PriceChartRangeSelectorWrapper /> */}
            <PriceChart
              market={splitMarketPair(selectedPair).underlyingTokenSymbol}
            />
            <div className="space-y-4">
              <StrikesChain />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/3 h-full space-y-4 sticky top-20">
            <AsidePanel />
            <InfoBox />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default ClammPage;
