import { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import Filter from 'components/common/Filter';
import VaultCard from 'components/straddles/VaultCard';

const states: string[] = ['Active', 'Retired'];

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        src={CHAIN_ID_TO_NETWORK_DATA[chainId]?.icon}
        alt={CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
      />
      <Typography variant="h4">
        {CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
      </Typography>
    </Box>
  );
};

const Straddles = () => {
  const { provider } = useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);
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
      tvl: number;
      rate: number;
      currentEpoch: number;
      totalDeposits: string;
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
                totalDeposits: vault['totalDeposits'],
                tvl: vault['tvl'],
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
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`https:/api.dopex.io/api/v2/straddles`)
        .then((payload) => payload.data);

      setVaults(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Straddles | Dopex</title>
      </Head>
      <AppBar active="Straddles" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1 mb-4">
            Straddles
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
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getStraddlesCards(42161)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Straddles;
