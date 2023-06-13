import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import { Button } from '@dopex-io/ui';
import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';

import DexScreenerChart from 'components/common/DexScreenerChart';
import PageLayout from 'components/common/PageLayout';
import QuickLink from 'components/common/QuickLink';
import Manage from 'components/scalps/Manage';
import Positions from 'components/scalps/Positions';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';

import { CHAINS } from 'constants/chains';
import seo from 'constants/seo';

const ManageComponent = () => {
  const [manageSection, setManageSection] = useState<string>('Trade');

  return (
    <div className="w-full !mt-4 h-fit-content">
      <div className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg mb-2">
        {['LP', 'Trade'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
              manageSection === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            color="carbon"
            size="small"
            onClick={() => setManageSection(label)}
          >
            <span className="text-white text-xs pb-1">{label}</span>
          </Button>
        ))}
      </div>
      <div className="bg-cod-gray rounded-b-xl min-w-[23rem]">
        {manageSection === 'Trade' ? <TradeCard /> : <Manage />}
      </div>
    </div>
  );
};

const OptionScalps = ({ poolName }: { poolName: string }) => {
  const {
    chainId,
    setSelectedPoolName,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
    selectedPoolName,
    setUniWethPrice,
    setUniArbPrice,
  } = useBoundStore();

  const Chart = useMemo(() => {
    return (
      <DexScreenerChart
        poolAddress={
          selectedPoolName === 'ETH'
            ? '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'
            : '0xcDa53B1F66614552F834cEeF361A8D12a0B8DaD8'
        }
      />
    );
  }, [selectedPoolName]);

  const updateAll = useCallback(() => {
    updateOptionScalp().then(() => updateOptionScalpUserData());
  }, [updateOptionScalp, updateOptionScalpUserData]);

  useEffect(() => {
    if (poolName && setSelectedPoolName)
      setSelectedPoolName(poolName.toUpperCase());
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAll();
    }, 3000);

    return () => clearInterval(interval);
  }, [updateAll]);

  useEffect(() => {
    const wethWs = new WebSocket(
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'
    );

    wethWs.onmessage = function (event) {
      const data = JSON.parse(event.data);
      try {
        if (data.pair) {
          setUniWethPrice(ethers.utils.parseUnits(String(data.pair.price), 6));
        }
      } catch (err) {
        console.log(err);
      }
    };

    const arbWs = new WebSocket(
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xa8328bf492ba1b77ad6381b3f7567d942b000baf'
    );

    arbWs.onmessage = function (event) {
      const data = JSON.parse(event.data);
      try {
        if (data.pair) {
          setUniArbPrice(ethers.utils.parseUnits(String(data.pair.price), 6));
        }
      } catch (err) {
        console.log(err);
      }
    };
  }, [setUniWethPrice, setUniArbPrice]);

  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <PageLayout>
        <div className="mt-8 sm:mt-14 md:mt-20 lg:mr-full">
          <TopBar />
        </div>
        <div className="w-full h-full flex flex-col space-y-2 xl:flex-row xl:space-x-5">
          <div className="flex flex-col w-full space-y-4 h-full">
            <div className="flex-1 mt-4">{Chart}</div>
            <Positions />
          </div>
          <div>
            <ManageComponent />
            <div className="mt-6 w-auto">
              <div className="flex flex-col space-y-2">
                <QuickLink
                  text="Option Scalps Guide"
                  href="https://blog.dopex.io/articles/product-launches-updates/introducing-option-scalps"
                />
                <QuickLink
                  text="Trading Competition Explainer"
                  href="https://blog.dopex.io/articles/marketing-campaigns/option-scalps-trading-competition"
                />
                <QuickLink
                  text="Leaderboard"
                  href="https://app.dopex.io/scalps/leaderboard"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-10">
          <div className="text-silver">Contract Address:</div>
          <p className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text">
            <a
              href={`${CHAINS[chainId]?.explorer}/address/${
                optionScalpData?.optionScalpContract?.address ?? ''
              }`}
              rel="noopener noreferrer"
              target={'_blank'}
            >
              {optionScalpData?.optionScalpContract?.address}
            </a>
          </p>
        </div>
      </PageLayout>
    </div>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const poolName = router.query['poolName'] as string;
  return (
    <>
      <NextSeo
        title={seo.scalps.title}
        description={seo.scalps.description}
        canonical={seo.scalps.url}
        openGraph={{
          url: seo.scalps.url,
          title: seo.scalps.title,
          description: seo.scalps.description,
          images: [
            {
              url: seo.scalps.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.scalps.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <OptionScalps poolName={poolName} />
    </>
  );
};

export default ManagePage;
