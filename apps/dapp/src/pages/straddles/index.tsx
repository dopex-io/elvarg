import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import axios from 'axios';
import { NextSeo } from 'next-seo';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import Filter from 'components/common/Filter';
import VaultCard from 'components/straddles/VaultCard';

import { CHAINS } from 'constants/chains';
import { DOPEX_API_BASE_URL } from 'constants/env';
import seo from 'constants/seo';

const states: string[] = ['Active', 'Retired'];

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        src={CHAINS[chainId]?.icon}
        alt={CHAINS[chainId]?.name}
      />
      <Typography variant="h4">{CHAINS[chainId]?.name}</Typography>
    </Box>
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
          ) : null
        );
      else return null;
    },
    [vaults, selectedStates]
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
    <Box className="min-h-screen">
      <NextSeo
        title={`Dopex Atlantic Straddles`}
        description="Buy/Write straddles on crypto assets"
        canonical={`https://dopex.io/straddles`}
        openGraph={{
          url: `https://dopex.io/straddles`,
          title: `Dopex Atlantic Straddles`,
          description: 'Buy/Write straddles on crypto assets',
          images: [
            {
              url: seo.straddles,
              width: 800,
              height: 500,
              alt: 'Straddles',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="Straddles" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1 mb-4">
            Straddles
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply Option liquidity for our Atlantic Straddle Vaults. Collect
            premiums as well as compounding funding fees that rollover
            automatically for easier liquidity management
          </Typography>
        </Box>
        <Box className="mb-12">
          <Box className="flex mb-4">
            <Box className="ml-auto mr-auto">
              <Filter
                activeFilters={selectedStates}
                setActiveFilters={setSelectedStates}
                text="State"
                options={states}
                multiple={true}
                showImages={false}
              />
            </Box>
          </Box>
          <NetworkHeader chainId={42161} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10 mb-10">
            {getStraddlesCards(42161)}
          </Box>
          <NetworkHeader chainId={137} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getStraddlesCards(137)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Straddles;
