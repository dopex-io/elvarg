import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';
import changeOrAddNetworkToMetaMask from 'utils/general/changeOrAddNetworkToMetaMask';
import LegacyEpochsDropDown from './components/LegacyEpochsDropDown/LegacyEpochsDropDown';
import { WalletContext } from 'contexts/Wallet';
import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

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

  const keys = useMemo(() => {
    if (!ssovs) return [];
    else if (chainId === 56) return [56, 42161, 43114];
    else if (chainId === 43114) return [43114, 42161, 43114];
    else return [42161, 56, 43114];
  }, [ssovs, chainId]);

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
    <Box className="bg-[url('/assets/vaultsbg.jpg')] min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="mb-7">
            Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Yield done easily plus automated option selling strategies. <br />
            Available on Arbitrum, Avalanche and BSC.
          </Typography>
        </Box>
        <LegacyEpochsDropDown />
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
