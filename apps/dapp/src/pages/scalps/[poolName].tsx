import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';
import QuickLink from 'components/common/QuickLink';
import Manage from 'components/scalps/Manage';
import MigrationStepper from 'components/scalps/MigrationStepper';
import Orders from 'components/scalps/Orders';
import Positions from 'components/scalps/Positions';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';

import { CHAINS } from 'constants/chains';
import seo from 'constants/seo';

const ManageComponent = () => {
  const [manageSection, setManageSection] = useState<string>('Trade');

  return (
    <div className="flex flex-col w-full lg:w-1/4 bg-black space-y-4 h-fit">
      <div className="p-2 rounded-md bg-cod-gray space-y-2 h-fit">
        <ButtonGroup className="flex justify-between border bg-cod-gray border-umbra rounded-top-lg">
          {['LP', 'Trade'].map((label, index) => (
            <Button
              key={index}
              className={`border-0 hover:border-0 w-1/2 p-1 m-1 transition ease-in-out duration-200 ${
                manageSection === label
                  ? 'text-white bg-carbon hover:bg-carbon'
                  : 'text-stieglitz bg-transparent hover:bg-transparent'
              } hover:text-white`}
              disableRipple
              onClick={() => setManageSection(label)}
            >
              <h6 className="text-xs pb-1">{label}</h6>
            </Button>
          ))}
        </ButtonGroup>
        {manageSection === 'Trade' ? <TradeCard /> : <Manage />}
      </div>
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
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xc31e54c7a869b9fcbecc14363cf510d1c41fa443',
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
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xa8328bf492ba1b77ad6381b3f7567d942b000baf',
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
    <PageLayout>
      <TopBar />
      <div className="flex flex-col space-y-2 lg:flex-row xl:space-x-4 justify-center h-full">
        <div className="flex flex-col w-full lg:w-3/4 space-y-4 h-full">
          <PriceChart market={selectedPoolName} />
          <Orders />
          <Positions />
        </div>
        {selectedPoolName === 'ETH' ? (
          <>
            <MigrationStepper
              deprecatedAddress={{
                asset: 'ETH',
                address: '0x49f517Cfed2679Fb8B31Df102150b81b25Ee552b',
              }}
              isQuote={false}
            />
            <MigrationStepper
              deprecatedAddress={{
                asset: 'USDC',
                address: '0x49f517Cfed2679Fb8B31Df102150b81b25Ee552b',
              }}
              isQuote={true}
            />
          </>
        ) : (
          <>
            <MigrationStepper
              deprecatedAddress={{
                asset: 'ARB',
                address: '0xdaf4ffb05bfcb2c328c19135e3e74e1182c88283',
              }}
              isQuote={false}
            />
            <MigrationStepper
              deprecatedAddress={{
                asset: 'USDC',
                address: '0xdaf4ffb05bfcb2c328c19135e3e74e1182c88283',
              }}
              isQuote={true}
            />
          </>
        )}
        <ManageComponent />
      </div>
      <div className="flex justify-center mt-8">
        <h5 className="text-silver">Contract Address:</h5>
        <p className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text ml-1">
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
