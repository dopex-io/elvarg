import { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import VaultCard from 'components/olp/VaultCard';

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

const Olp = () => {
  const { provider } = useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);

  // const vaultsTvl: Dictionary<BigNumber> = OLPS_GROUPS.map((group) => {
  //   return {
  //     group: BigNumber.from('0')
  //   }
  // })

  const [vaults, setVaults] = useState<{
    [key: string]: {
      underlyingSymbol: string;
      symbol: string;
      version: string;
      chainId: number;
      duration: string;
      currentEpoch: number;
      totalVaultDeposits: string;
    }[];
  }>({});

  // TODO: useCallback returns void
  const getOlpCards = Object.keys(vaults).map((key) => {
    return (
      <VaultCard
        key={key}
        className={''}
        underlying={key}
        data={vaults[key]!}
      />
    );
  });

  useMemo(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`http://localhost:5001/api/v2/olp`)
        .then((payload) => payload.data);
      setVaults(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>OLP | Dopex</title>
      </Head>
      <AppBar active="OLPs" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="z-1 mb-4">
            OLP
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Numbers go up
          </Typography>
        </Box>
        <Box className="mb-12">
          <NetworkHeader chainId={42161} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getOlpCards}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Olp;
