import Head from 'next/head';

import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import axios from 'axios';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import Filter from 'components/common/Filter';
import RateVaultCard from 'components/ir/VaultCard';

import { CHAINS } from 'constants/chains';
import { DOPEX_API_BASE_URL } from 'constants/env';

const ssovStates: string[] = ['Active', 'Retired'];

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

const Vaults = () => {
  const { provider, tokenPrices } = useBoundStore();
  const [selectedStates, setselectedStates] = useState<string[] | string>([
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
      tvl: number;
      rate: number;
      currentEpoch: number;
      totalEpochDeposits: string;
      retired: boolean;
      duration: string;
      epochTimes: {
        startTime: string;
        expiry: string;
      };
    }[];
  }>({});

  const getRateVaultCards = useCallback(
    (key: number) => {
      const vaultsOfKey = vaults[key];
      if (vaultsOfKey)
        return vaultsOfKey.map((vault, index) =>
          (selectedStates.includes('Active') && !vault.retired) ||
          (selectedStates.includes('Retired') && vault.retired) ? (
            <RateVaultCard
              key={index}
              className={''}
              data={{
                currentEpoch: vault['currentEpoch'],
                totalEpochDeposits: vault['totalEpochDeposits'],
                rate: vault['rate'],
                tvl: vault['tvl'],
                underlyingSymbol: vault['underlyingSymbol'],
                retired: vault['retired'],
                symbol: vault['symbol'],
                version: vault['version'],
                duration: vault['duration'],
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
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/irVaults`)
        .then((payload) => payload.data);

      setVaults(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="min-h-screen">
      <Head>
        <title>Rate Vaults | Dopex</title>
      </Head>
      <AppBar active="Rate Vaults" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1 mb-4">
            Rate Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards simultaneously.
          </Typography>
        </Box>
        <Box className="mb-12">
          <Box className="flex mb-4">
            <Box className="ml-auto mr-auto">
              <Filter
                activeFilters={selectedStates}
                setActiveFilters={setselectedStates}
                text={'State'}
                options={ssovStates}
                multiple={true}
                showImages={false}
              />
            </Box>
          </Box>
          <NetworkHeader chainId={42161} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getRateVaultCards(42161)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Vaults;
