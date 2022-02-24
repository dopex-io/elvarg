import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';

import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { WalletContext } from 'contexts/Wallet';
import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';
import changeOrAddNetworkToMetaMask from 'utils/general/changeOrAddNetworkToMetaMask';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';
import LegacyEpochsDropDown from './components/LegacyEpochsDropDown/LegacyEpochsDropDown';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const CHAIN_NAME_TO_PREFERENCES = {
  BSC: {
    extendedName: 'BINANCE',
    bg: 'bg-umbra',
    bgActive: 'bg-[#706031]',
  },
  Avalanche: {
    extendedName: 'AVALANCHE',
    bg: 'bg-umbra',
    bgActive: 'bg-[#602222]',
  },
  Arbitrum: {
    extendedName: 'ARBITRUM',
    bg: 'bg-umbra',
    bgActive: 'bg-[#2D364D]',
  },
};

const Ssov = () => {
  const [ssovs, setSsovs] = useState(null);
  const { supportedChainIds, chainId } = useContext(WalletContext);
  const showNetworkButtons: boolean = false;
  const [selectedSsovAssets, setSelectedSsovAssets] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('TVL');

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else if (chainId === 56) return [56, 42161, 43114];
    else if (chainId === 43114) return [43114, 42161, 43114];
    else return [42161, 56, 43114];
  }, [ssovs, chainId]);

  const ssovStrategies: string[] = ['CALL', 'PUT'];
  const sortOptions: string[] = ['TVL', 'APY'];

  const ssovsAssets = useMemo(() => {
    if (!ssovs) return [];
    const assets: string[] = [];
    Object.keys(ssovs).map((key) => {
      ssovs[key].map((ssov) => {
        const asset = ssov.name;
        if (!assets.includes(asset)) assets.push(asset);
      });
    });
    return assets.sort((a, b) => (a > b ? 1 : -1));
  }, [ssovs]);

  const handleSelectAsset = useCallback(
    (event: React.ChangeEvent<{ value: string[] }>) => {
      setSelectedSsovAssets(event.target.value);
    },
    []
  );

  const handleSelectStrategy = useCallback(
    (event: React.ChangeEvent<{ value: string[] }>) => {
      setSelectedStrategies(event.target.value);
    },
    []
  );

  const handleSelectSortBy = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      setSortBy(event.target.value);
    },
    []
  );

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
    <Box className="bg-[url('/assets/vaultsbg.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="mb-7">
            Single Staking Option Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <Box className="flex">
          <Select
            value={selectedSsovAssets}
            className="bg-mineshaft rounded-md pr-2 pl-4 text-white h-8 ml-auto mr-3"
            displayEmpty
            multiple
            onChange={handleSelectAsset}
            disableUnderline
            renderValue={() => {
              return (
                <Typography
                  variant="h6"
                  className="text-white text-center w-full relative"
                >
                  Asset
                </Typography>
              );
            }}
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-2 p-0.5 text-white',
              select: 'overflow-hidden',
            }}
            label="asset"
          >
            {ssovsAssets.map((asset) => (
              <MenuItem key={asset} value={asset} className="pb-2 pt-2">
                <Checkbox
                  className={
                    selectedSsovAssets.includes(asset)
                      ? 'p-0 text-white'
                      : 'p-0 text-white border'
                  }
                  checked={selectedSsovAssets.includes(asset)}
                />
                <Box className={'flex'}>
                  <img
                    src={'/assets/' + asset.toLowerCase() + '.svg'}
                    className="w-6 ml-3 mt-[0.4px]"
                  />
                  <Typography
                    variant="h5"
                    className="text-white text-left w-full relative ml-2"
                  >
                    {asset}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedStrategies}
            className="bg-mineshaft rounded-md pr-2 pl-4 text-white h-8 mr-3"
            displayEmpty
            multiple
            onChange={handleSelectStrategy}
            disableUnderline
            renderValue={() => {
              return (
                <Typography
                  variant="h6"
                  className="text-white text-center w-full relative"
                >
                  Strategy
                </Typography>
              );
            }}
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-2 p-0.5 text-white',
              select: 'overflow-hidden',
            }}
            label="strategy"
          >
            {ssovStrategies.map((strategy) => (
              <MenuItem key={strategy} value={strategy} className="pb-2 pt-2">
                <Checkbox
                  className={
                    selectedStrategies.includes(strategy)
                      ? 'p-0 text-white'
                      : 'p-0 text-white border'
                  }
                  checked={selectedStrategies.includes(strategy)}
                />
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  {strategy}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <Select
            value={sortBy}
            className="bg-mineshaft rounded-md pr-2 pl-4 text-white h-8 mr-auto"
            displayEmpty
            onChange={handleSelectSortBy}
            disableUnderline
            renderValue={() => {
              return (
                <Typography
                  variant="h6"
                  className="text-white text-center w-full relative"
                >
                  Sort by
                </Typography>
              );
            }}
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-2 p-0.5 text-white',
              select: 'overflow-hidden',
            }}
            label="strategy"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option} value={option} className="pb-2 pt-2">
                <Checkbox
                  className={
                    sortBy === option
                      ? 'p-0 text-white'
                      : 'p-0 text-white border'
                  }
                  checked={sortBy === option}
                />
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  {option}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
        {showNetworkButtons ? (
          <Box className="flex ml-9 mb-10">
            {supportedChainIds?.map((supportedChainId) => {
              const data = CHAIN_ID_TO_NETWORK_DATA[supportedChainId];
              return (
                <Box
                  className={`flex space-x-3 rounded-md p-3 pr-5 items-center hover:opacity-90 mr-3 
                ${
                  CHAIN_ID_TO_NETWORK_DATA[chainId].name === data.name
                    ? CHAIN_NAME_TO_PREFERENCES[data.name]['bgActive']
                    : CHAIN_NAME_TO_PREFERENCES[data.name]['bg']
                }`}
                  onClick={() => {
                    changeOrAddNetworkToMetaMask(supportedChainId);
                  }}
                  role="button"
                >
                  <Box>
                    <img
                      src={data.icon}
                      alt={data.name}
                      width="20"
                      height="22"
                    />
                  </Box>
                  <Typography variant="h5" className="text-white font-mono">
                    {CHAIN_NAME_TO_PREFERENCES[data.name]['extendedName']}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box className="mb-10" />
        )}

        {ssovs
          ? keys.map((key) => {
              return (
                <Box key={key} className="mb-12">
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

        <LegacyEpochsDropDown />
      </Box>
    </Box>
  );
};

export default Ssov;
