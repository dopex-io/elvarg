import { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';

import PoolCard from 'components/pools/PoolCard';
import Filter from 'components/pools/Filter';

const strategies: string[] = ['LONG STRADDLES'];

const Pools = () => {
  const { provider } = useContext(WalletContext);
  const { tokenPrices } = useContext(AssetsContext);
  const [selectedStrategies, setSelectedStrategies] = useState<
    string[] | string
  >([strategies[0]!]);

  const [pools, setPools] = useState<{
    [key: number]: {
      underlyingSymbol: string;
      totalDeposits: string;
      symbol: string;
      chainId: number;
      address: string;
      tvl: number;
      currentEpoch: number;
    }[];
  }>({});

  const getPoolsCards = useCallback(
    (key: number) => {
      const poolsOfKey = pools[key];
      if (poolsOfKey)
        return poolsOfKey.map((pool, index) => (
          <PoolCard
            key={index}
            className={''}
            data={{
              currentEpoch: pool['currentEpoch'],
              totalDeposits: pool['totalDeposits'],
              tvl: pool['tvl'],
              underlyingSymbol: pool['underlyingSymbol'],
              symbol: pool['symbol'],
            }}
          />
        ));
      else return null;
    },
    [pools]
  );

  useEffect(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`https://dopex-8ry5tccbo-dopex-io.vercel.app/api/v2/straddles`)
        .then((payload) => payload.data);

      setPools(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="bg-[url('/assets/pools-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Pools | Dopex</title>
      </Head>
      <AppBar active="Pools" />
      <Box className="pt-1 pb-32 md:max-w-screen-2xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="flex">
          <Box className="text-left mb-8 mt-32">
            <Typography
              variant="h3"
              className="z-1 mb-1 text-white font-semi-bold"
            >
              Pools
            </Typography>
            <Typography variant="h4" className="!text-stieglitz">
              Deposit and earn
            </Typography>
          </Box>
        </Box>

        <Box className="mt-16">
          <Box className="flex mb-8">
            <Box className="ml-0 mr-auto">
              <Filter
                activeFilters={selectedStrategies}
                setActiveFilters={setSelectedStrategies}
                text={'Strategy'}
                options={strategies}
                multiple={true}
                showImages={false}
              />
            </Box>
          </Box>
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-left gap-y-3">
            {getPoolsCards(42161)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Pools;
