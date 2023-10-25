import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { NextSeo } from 'next-seo';

import AppBar from 'components/common/AppBar';
import StraddleClosedBanner from 'components/common/Banners/StraddlesClosedBanner';
import VaultCard from 'components/straddles/VaultCard';

import { CHAINS } from 'constants/chains';
import { DOPEX_API_BASE_URL } from 'constants/env';
import seo from 'constants/seo';

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <div className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        src={CHAINS[chainId]?.icon}
        alt={CHAINS[chainId]?.name}
      />
      <div className="text-xl">{CHAINS[chainId]?.name}</div>
    </div>
  );
};

const Straddles = () => {
  const [selectedStates, setSelectedStates] = useState<string[] | string>([
    'Active',
  ]);

  const [vaults, setVaults] = useState<{
    [key: number]: {
      underlyingSymbol: string;
      symbol: string;
      version: string;
      chainId: number;
      collateralDecimals: number;
      address: string;
      tvl: string;
      utilization: string;
      currentEpoch: string;
      retired: boolean;
      duration: string;
      epochTimes: {
        startTime: string;
        expiry: string;
      };
    }[];
  }>({});

  const getStraddlesCards = useCallback(
    (key: number) => {
      const vaultsOfKey = vaults[key];
      if (vaultsOfKey)
        return vaultsOfKey.map((vault, index) =>
          (selectedStates.includes('Active') && !vault.retired) ||
          (selectedStates.includes('Retired') && vault.retired) ? (
            <VaultCard
              key={index}
              data={{
                currentEpoch: vault['currentEpoch'],
                tvl: vault['tvl'],
                utilization: vault['utilization'],
                underlyingSymbol: vault['underlyingSymbol'],
                retired: vault['retired'],
                symbol: vault['symbol'],
                epochTimes: vault['epochTimes'],
              }}
            />
          ) : null,
        );
      else return null;
    },
    [vaults, selectedStates],
  );

  useEffect(() => {
    async function getData() {
      let data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/straddles`)
        .then((payload) => payload.data);

      setVaults(data);
    }
    getData();
  }, []);

  return (
    <div className="min-h-screen">
      <NextSeo
        title={seo.straddles.title}
        description={seo.straddles.description}
        canonical={seo.straddles.url}
        openGraph={{
          url: seo.straddles.url,
          title: seo.straddles.title,
          description: seo.straddles.description,
          images: [
            {
              url: seo.straddles.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.straddles.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <div className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <div className="text-center mx-auto max-w-xl mb-8 mt-32">
          <StraddleClosedBanner />
          <div className="z-1 mb-4 text-3xl">Straddles</div>
        </div>
        <div className="mb-12">
          <NetworkHeader chainId={42161} />
          <div className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10 mb-10">
            {getStraddlesCards(42161)}
          </div>
          <NetworkHeader chainId={137} />
          <div className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getStraddlesCards(137)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Straddles;
