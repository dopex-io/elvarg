import { useContext, useMemo } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Accordion from './components/Accordion';
import Description from './components/Description';

import { AtlanticsContext } from 'contexts/Atlantics';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { ATLANTIC_STATS_MAPPING } from 'constants/index';

const marketsData = [
  {
    tokenId: 'ETH',
    stats: {
      tvl: getContractReadableAmount(100023, 18),
      volume: getContractReadableAmount(5453, 18),
    },
    pools: [
      {
        poolType: 'PERPETUALS',
        isPut: true,
        tvl: getContractReadableAmount(100023, 18),
        epochLength: 'weekly' as const,
      },
    ],
  },
  {
    tokenId: 'DPX',
    stats: {
      tvl: getContractReadableAmount(324341, 18), // redundant, get total tvl from sum via pools
      volume: getContractReadableAmount(3, 18),
    },
    pools: [
      {
        poolType: 'PERPETUALS',
        isPut: true,
        tvl: getContractReadableAmount(123122, 18),
        epochLength: 'weekly' as const,
      },
      {
        poolType: 'INSURED STABLES',
        isPut: false,
        tvl: getContractReadableAmount(201219, 18),
        epochLength: 'monthly' as const,
      },
    ],
  },
  {
    tokenId: 'RDPX',
    stats: {
      tvl: getContractReadableAmount(52123, 18),
      volume: getContractReadableAmount(2132, 18),
    },
    pools: [
      {
        poolType: 'PERPETUALS',
        isPut: true,
        tvl: getContractReadableAmount(52123, 18),
        epochLength: 'weekly' as const,
      },
    ],
  },
];

const Atlantics = () => {
  const stats = useMemo(() => {
    const tvl = marketsData.reduce((acc: any, curr: any) => {
      return acc.add(curr.stats.tvl);
    }, BigNumber.from(0));

    const vol = marketsData.reduce((acc: any, curr: any) => {
      return acc.add(curr.stats.volume);
    }, BigNumber.from(0));

    const poolCount = marketsData.reduce((acc: any, curr: any) => {
      return acc + curr.pools.length;
    }, 0);

    return {
      TVL: getUserReadableAmount(tvl, 18),
      volume: getUserReadableAmount(vol, 18),
      pools: poolCount,
    };
  }, []);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="mx-auto mb-8">
          <Box className="flex flex-col flex-wrap divide-y divide-umbra">
            <Box className="flex w-full justify-between">
              <Description />
              <Box className="grid grid-cols-3 border border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
                {Object.keys(ATLANTIC_STATS_MAPPING).map((key, index) => {
                  return (
                    <Box key={index} className="p-4">
                      <Typography variant="h5">
                        {ATLANTIC_STATS_MAPPING[key]}
                      </Typography>
                      <Typography variant="h6" className="text-stieglitz">
                        {formatAmount(stats[key], 3, true, true)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box className="grid grid-cols-4 pt-6">
              <Box className="flex flex-col col-span-1 space-y-6">
                {marketsData?.map((market, index) => {
                  return (
                    <Accordion
                      className="bg-cod-gray shadow-none border border-umbra"
                      key={index}
                      header={market.tokenId}
                      stats={market.stats}
                      pools={market.pools}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Atlantics;
