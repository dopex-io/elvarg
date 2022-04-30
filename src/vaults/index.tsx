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

import formatAmount from 'utils/general/formatAmount';

const ssovStrategies: string[] = ['CALL', 'PUT'];
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

const Ssov = () => {
  const [ssovs, setSsovs] = useState(null);
  const { chainId } = useContext(WalletContext);
  const [selectedSsovAssets, setSelectedSsovAssets] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('TVL');

  const tvl = useMemo(() => {
    let total = 0;
    for (let i in ssovs) {
      Object.keys(ssovs[i]).map((currency) => {
        const callTvl = parseFloat(ssovs[i][currency]?.call?.tvl);
        const putTvl = parseFloat(ssovs[i][currency]?.put?.tvl);
        if (!isNaN(callTvl)) total += callTvl;
        if (!isNaN(putTvl)) total += putTvl;
      });
    }
    return total;
  }, [ssovs]);

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else if (chainId === 56) return [56, 42161, 43114];
    else if (chainId === 43114) return [43114, 42161];
    else if (chainId === 1088) return [1088];
    else return [42161, 56, 43114, 1088];
  }, [ssovs, chainId]);

  const ssovsAssets = useMemo(() => {
    if (!ssovs) return [];
    const assets: string[] = [];
    Object.keys(ssovs).map((key) => {
      Object.keys(ssovs[key]).map((symbol) => {
        const ssov = ssovs[key][symbol];
        const asset = ssov.name;
        if (!assets.includes(asset)) assets.push(asset);
      });
    });
    return assets.sort((a, b) => (a > b ? 1 : -1));
  }, [ssovs]);

  useEffect(() => {
    async function getData() {
      const data = await axios
        .get('https://api.dopex.io/api/v1/ssov')
        .then((payload) => payload.data);

      const processedData = {};
      for (let ssovChainId in data) {
        processedData[ssovChainId] = {};
        data[ssovChainId].map((ssov) => {
          if (!processedData[ssovChainId][ssov['name']])
            processedData[ssovChainId][ssov['name']] = {
              name: ssov['name'],
              epochTimes: ssov['epochTimes'],
              chainId: ssov['chainId'],
              currentEpoch: ssov['currentEpoch'],
            };

          processedData[ssovChainId][ssov['name']][ssov['type']] = {
            apy: ssov['apy'],
            tvl: ssov['tvl'],
            currentEpoch: ssov['currentEpoch'],
            totalEpochDeposits: ssov['totalEpochDeposits'],
          };
        });
      }

      processedData[42161]['Curve LP'] = {
        name: 'Curve LP',
        epochTimes: 1,
        chainId: 42161,
        currentEpoch: 1,
        call: {
          apy: 2,
          tvl: 323232323,
          currentEpoch: 1,
          totalEpochDeposits: 2343243,
        },
        put: {
          apy: 2,
          tvl: 323232323,
          currentEpoch: 1,
          totalEpochDeposits: 2343243,
        },
      };
      setSsovs(processedData);
    }
    getData();
  }, []);

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
              TVL ${formatAmount(tvl, 0)}
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />
        <Box className="flex lg:mb-4 mb-10">
          <Box className="ml-auto mr-3">
            <SsovFilter
              activeFilters={selectedSsovAssets}
              setActiveFilters={setSelectedSsovAssets}
              text={'Asset'}
              options={ssovsAssets}
              multiple={true}
              showImages={true}
            />
          </Box>
          <Box className="mr-3">
            <SsovFilter
              activeFilters={selectedStrategies}
              setActiveFilters={setSelectedStrategies}
              text={'Strategy'}
              options={ssovStrategies}
              multiple={false}
              showImages={false}
            />
          </Box>
          <Box className="mr-auto">
            <SsovFilter
              activeFilters={sortBy}
              setActiveFilters={setSortBy}
              text={'Sort by'}
              options={sortOptions}
              multiple={false}
              showImages={false}
            />
          </Box>
        </Box>
        {ssovs
          ? keys.map((key) => {
              return (
                <Box key={key} className="mb-12">
                  <NetworkHeader chainId={Number(key)} />
                  <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
                    {ssovs
                      ? Object.keys(ssovs[key]).map((symbol, index) => {
                          const ssov = ssovs[key][symbol];
                          let visible: boolean = false;
                          if (
                            (selectedSsovAssets.length === 0 ||
                              selectedSsovAssets.includes(ssov.name)) &&
                            (selectedStrategies.length === 0 ||
                              selectedStrategies.includes(
                                ssov.type.toUpperCase()
                              ))
                          )
                            visible = true;
                          return visible ? (
                            <SsovCard key={index} data={{ ...ssov }} />
                          ) : null;
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
