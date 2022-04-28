import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';

import Box from '@mui/material/Box';
import { WalletContext } from 'contexts/Wallet';
import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import LegacyEpochsDropDown from './components/LegacyEpochsDropDown/LegacyEpochsDropDown';
import SsovCard from './components/SsovCard';
import SsovFilter from './components/SsovFilter';

import formatAmount from '../../utils/general/formatAmount';

const sortOptions: string[] = ['TVL', 'APY'];

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

const Vaults = () => {
  const { chainId } = useContext(WalletContext);
  const [selectedSsovAssets, setSelectedSsovAssets] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('TVL');

  return (
    <Box className="bg-[url('/assets/vaultsbg.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Vaults | Dopex</title>
      </Head>
      <AppBar active="vaults" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h1" className="mb-7">
            Vaults
          </Typography>
          <Box
            className={
              'mb-6 mt-5 opacity-90 bg-white ml-auto mr-auto w-[5rem] rounded-md p-[0.3px]'
            }
          >
            <Typography variant="h6" className="text-umbra text-[0.7rem]">
              TVL ${formatAmount(0, 0)}
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />

        <Box className="mb-12">
          <NetworkHeader chainId={42161} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            <SsovCard
              data={{
                name: 'UST-3CRV',
                apy: 7,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Vaults;
