import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import { CHAIN_ID_TO_NETWORK_DATA, DOPEX_API_BASE_URL } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import LegacyEpochsDropDown from 'components/ssov/LegacyEpochsDropDown/LegacyEpochsDropDown';
import SsovCard from 'components/ssov/SsovCard';
import SsovFilter from 'components/ssov/SsovFilter';

import formatAmount from 'utils/general/formatAmount';

const ssovStates: string[] = ['Active', 'Retired'];
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
  const { chainId, provider } = useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);

  const [ssovs, setSsovs] = useState(null);
  const [selectedSsovStates, setSelectedSsovStates] = useState<string[]>([
    'Active',
  ]);
  const [selectedSsovAssets, setSelectedSsovAssets] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('TVL');

  const tvl = useMemo(() => {
    let total = 0;
    for (let i in ssovs)
      ssovs[i].map((ssov) => (total += parseFloat(ssov.tvl)));
    return total;
  }, [ssovs]);

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else if (chainId === 56) return [56, 42161, 43114];
    else if (chainId === 43114) return [43114, 42161, 56];
    else return [42161, 56, 43114];
  }, [ssovs, chainId]);

  const ssovsAssets = useMemo(() => {
    if (!ssovs) return [];
    const assets: string[] = [];
    Object.keys(ssovs).map((key) => {
      ssovs[key].map((ssov) => {
        const asset = ssov.underlyingSymbol;
        if (!assets.includes(asset)) assets.push(asset);
      });
    });
    return assets.sort((a, b) => (a > b ? 1 : -1));
  }, [ssovs]);

  useEffect(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/ssov`)
        .then((payload) => payload.data);

      setSsovs(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1">
            Single Staking Option Vaults
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
            option purchases and earn rewards simultaneously.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />
        <Box className="flex mb-4">
          <Box className="ml-auto mr-3">
            <SsovFilter
              activeFilters={selectedSsovStates}
              setActiveFilters={setSelectedSsovStates}
              text={'State'}
              options={ssovStates}
              multiple={true}
              showImages={false}
            />
          </Box>
          <Box className="mr-3">
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
              activeFilters={selectedTypes}
              setActiveFilters={setSelectedTypes}
              text={'Type'}
              options={ssovStrategies}
              multiple={true}
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
                      ? ssovs[key]
                          .sort((a, b) =>
                            parseFloat(a[sortBy.toLowerCase()]) <
                            parseFloat(b[sortBy.toLowerCase()])
                              ? 1
                              : -1
                          )
                          .map((ssov, index) => {
                            let visible: boolean = false;
                            if (
                              (selectedSsovAssets.length === 0 ||
                                selectedSsovAssets.includes(
                                  ssov.underlyingSymbol
                                )) &&
                              (selectedTypes.length === 0 ||
                                selectedTypes.includes(
                                  ssov.type.toUpperCase()
                                )) &&
                              ((selectedSsovStates.includes('Active') &&
                                !ssov.retired) ||
                                (selectedSsovStates.includes('Retired') &&
                                  ssov.retired))
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
