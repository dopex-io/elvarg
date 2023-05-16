import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { NextSeo } from 'next-seo';

import Accordion from 'components/atlantics/Accordion';
import Description from 'components/atlantics/Description';
import Filter from 'components/atlantics/Filter';
import Stats from 'components/atlantics/Stats';
import AppBar from 'components/common/AppBar';

import { DOPEX_API_BASE_URL } from 'constants/env';

export const ATLANTIC_POOLS: string[] | string = ['WETH'];

export interface Pool {
  strategy: string;
  base: string;
  underlying: string;
  symbol: string;
  chainId: number;
  vaultAddress: string;
  duration: string;
  currentEpoch: string | number;
  strikes: string[];
  epochData: Record<symbol, string>;
  tvl: string;
  unlocked: string;
  apy: string;
  retired: boolean;
  version: string | number;
}

export interface Pools {
  [key: string | symbol]: Pool[];
}

const Atlantics = () => {
  const [pools, setPools] = useState<Pools | undefined>();
  const [selectedAtlanticsAssets, setSelectedAtlanticsAssets] = useState<
    string | string[]
  >(ATLANTIC_POOLS);

  const filteredData = useMemo(() => {
    if (!pools) return {};
    const filteredKeys = Object.keys(pools).filter((poolName) =>
      selectedAtlanticsAssets.includes(poolName)
    );

    return filteredKeys.reduce((_pools: Pools, key) => {
      if (!pools[key] || !pools) return {};
      _pools[key] = pools[key]!;
      return _pools;
    }, {});
  }, [pools, selectedAtlanticsAssets]);

  useEffect(() => {
    (async () => {
      const data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/atlantics`)
        .then((res) => res.data)
        .catch(() => null);
      setPools(data);
    })();
  }, [setPools]);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <NextSeo
        title={`Dopex Atlantic Insured Perps`}
        description="Open liquidation-free longs"
        canonical={`https://dopex.io/atlantics`}
        openGraph={{
          url: `https://dopex.io/atlantics`,
          title: `Dopex Atlantic Insured Perps`,
          description: 'Open liquidation-free longs',
          images: [
            {
              url: `https://dopex.io/images/banners/insuredperp.png`,
              width: 800,
              height: 600,
              alt: 'Insured Perp',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="Atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="mx-auto mb-8">
          <Box className="flex flex-col divide-umbra md:divide-y divide-y-0">
            <Box className="flex flex-col sm:flex-col md:flex-row w-full justify-between">
              <Description />
              <Stats pools={pools} token={'WETH'} />
            </Box>
            {pools && (
              <Box className="flex w-full justify-between">
                <Filter
                  activeFilters={selectedAtlanticsAssets}
                  setActiveFilters={setSelectedAtlanticsAssets}
                  text={'Filter by Asset'}
                  multiple={true}
                  options={pools}
                />
              </Box>
            )}
          </Box>
          {filteredData && Object.keys(filteredData).length !== 0 ? (
            [selectedAtlanticsAssets]
              .flat()
              .map((asset: string, index: number) => {
                return (
                  <Box
                    key={index}
                    className="sm:flex sm:flex-col lg:grid lg:grid-cols-4 pt-6"
                  >
                    <Box className="flex flex-col col-span-1 space-y-4 ">
                      <Accordion
                        className="bg-cod-gray shadow-none"
                        header={asset ?? ''}
                        putPools={filteredData[asset]}
                      />
                    </Box>
                  </Box>
                );
              })
          ) : (
            <Box className="flex justify-center items-center h-screen">
              <CircularProgress
                className="mb-[30rem]"
                size="40px"
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const AtlanticsPage = () => {
  return <Atlantics />;
};

export default AtlanticsPage;
