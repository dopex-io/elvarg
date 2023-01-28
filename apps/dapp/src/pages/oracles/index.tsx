import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';
import PageLoader from 'components/common/PageLoader';
import OracleCard from 'components/oracles/OracleCard';

const TOKENS = [
  {
    tokenSymbol: 'rDPX',
    contractUrl:
      'https://arbiscan.io/address/0xC0cdD1176aA1624b89B7476142b41C04414afaa0',
    imgSrc: '/images/tokens/rdpx.svg',
    imgAlt: 'rDPX',
  },
];

const Oracles = () => {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    async function getData() {
      const payload = await axios.get(
        'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=rDPX'
      );

      const _dopexOraclesData = payload.data.data;

      const formattedData = _dopexOraclesData.map(
        (item: { twap: ethers.BigNumberish; timestamp: any }) => ({
          price: Number(ethers.utils.formatUnits(item.twap, 8)),
          timestamp: item.timestamp,
        })
      );

      const _state = {
        rDPX: {
          currentPrice: formattedData[0].price,
          lastUpdated: formattedData[0].timestamp,
          allData: formattedData,
        },
      };

      setState(_state);
    }
    getData();
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Oracles | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        {state ? (
          <>
            <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
              <Typography variant="h1" className="mb-1">
                Oracles
              </Typography>
              <Typography variant="h5" className="mb-1" color="stieglitz">
                Powered by Dopex
              </Typography>
            </Box>
            <Box className="w-1/2 mx-auto">
              {TOKENS.map((token) => {
                return (
                  <OracleCard
                    key={token.tokenSymbol}
                    data={{ ...token, ...state[token.tokenSymbol] }}
                  />
                );
              })}
            </Box>
          </>
        ) : (
          <PageLoader />
        )}
      </Box>
    </Box>
  );
};

export default Oracles;
