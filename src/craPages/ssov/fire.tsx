import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';
import LegacyEpochsDropDown from './components/LegacyEpochsDropDown/LegacyEpochsDropDown';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

const NetworkHeader = ({ chainId }: { chainId: number }) => {
  return (
    <Box className="flex space-x-4 mb-8">
      <img
        className="w-8 h-8"
        src={CHAIN_ID_TO_NETWORK_DATA[chainId].icon}
        alt={CHAIN_ID_TO_NETWORK_DATA[chainId].name}
      />
      <Typography variant="h4">
        {CHAIN_ID_TO_NETWORK_DATA[chainId].name}
      </Typography>
    </Box>
  );
};

const Ssov = () => {
  const [ssovs, setSsovs] = useState(null);

  useEffect(() => {
    async function getData() {
      const data = await axios
        .get('https://api.dopex.io/api/v1/ssov')
        .then((payload) => payload.data);

      setSsovs(data);
    }
    getData();
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h1" className="mb-1">
            Single Staking Option Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />
        {ssovs
          ? Object.keys(ssovs)
              .sort((a, b) => (a > b ? 1 : -1))
              .map((key) => {
                return (
                  <Box key={key} className="mb-12">
                    <NetworkHeader chainId={Number(key)} />
                    <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
                      {ssovs
                        ? ssovs[key].map((ssov, index) => {
                            return <SsovCard key={index} data={{ ...ssov }} />;
                          })
                        : null}
                    </Box>
                  </Box>
                );
              })
          : null}
      </Box>
    </Box>
  );
};

export default Ssov;
