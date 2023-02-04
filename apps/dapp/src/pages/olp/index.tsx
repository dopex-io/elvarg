import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';

import { useBoundStore } from 'store';

import { DOPEX_API_BASE_URL } from 'constants/env';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { OlpHome } from '../../components/olp/OlpHome';

const OLP_INTRO: string =
  'https://blog.dopex.io/articles/product-launches-updates/Option-Liquidity-Pools-Walkthrough';

export interface IOlpApi {
  underlyingSymbol: string;
  symbol: string;
  duration: string;
  chainId: number;
  address: string;
  hasCall: boolean;
  hasPut: boolean;
  utilization: number;
  tvl: number;
  expiry: number;
}

const Olp = () => {
  const { provider, tokenPrices } = useBoundStore();

  const [vaults, setVaults] = useState<{
    [key: string]: IOlpApi[];
  }>({});

  useEffect(() => {
    if (tokenPrices.length < 0 || !provider) {
      return;
    }
    async function getData() {
      let data = await axios
        .get(`${DOPEX_API_BASE_URL}/v2/olp`)
        .then((payload) => payload.data);
      setVaults(data);
    }
    getData();
  }, [provider, tokenPrices]);

  return (
    <Box className="min-h-screen">
      <Head>
        <title>OLP | Dopex</title>
      </Head>
      <AppBar active="OLPs" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32 flex flex-col items-center">
          <Typography
            variant=""
            className="z-1 mb-4"
            sx={{
              letterSpacing: '0.5em',
              lineHeight: '24px',
              fontSize: '26px',
              fontWeight: '700',
              textTransform: 'uppercase',
            }}
          >
            Options LP
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Liquidity for buying or selling options mid-epoch for SSOVs
          </Typography>
          <Box className="flex flex-row w-48 justify-around">
            <a href={OLP_INTRO} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-row">
                <Typography variant="h6" color="wave-blue">
                  Intro to OLP
                </Typography>
                <ArrowForwardIcon
                  sx={{
                    fill: '#22E1FF',
                  }}
                />
              </div>
            </a>
          </Box>
        </Box>
        <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl p-5 mx-auto">
          <OlpHome olps={vaults!} />
        </Box>
      </Box>
    </Box>
  );
};

export default Olp;
