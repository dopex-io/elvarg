import { useEffect, useState } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import { OlpHome } from 'components/olp/OlpHome';

import { DOPEX_API_BASE_URL } from 'constants/env';
import seo from 'constants/seo';

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
      <NextSeo
        title={seo.olp.title}
        description={seo.olp.description}
        canonical={seo.olp.url}
        openGraph={{
          url: seo.olp.url,
          title: seo.olp.title,
          description: seo.olp.description,
          images: [
            {
              url: seo.olp,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.olp.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="OLPs" />
      <Box className="pt-1 pb-32 lg:max-w-6xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32 flex flex-col items-center">
          <span className="z-1 mb-4 uppercase font-bold text-3xl tracking-[.5em]">
            Options LP
          </span>
          <Typography variant="h5" className="text-stieglitz">
            Liquidity for buying or selling options mid-epoch for SSOVs
          </Typography>
          <Box className="flex w-48 justify-around">
            <a href={OLP_INTRO} target="_blank" rel="noopener noreferrer">
              <div className="flex">
                <Typography variant="h6" color="wave-blue">
                  Intro to OLP
                </Typography>
                <ArrowForwardIcon className="fill-current text-wave-blue" />
              </div>
            </a>
          </Box>
        </Box>
        <Box className="p-10 mx-auto">
          <OlpHome olps={vaults!} />
        </Box>
      </Box>
    </Box>
  );
};

export default Olp;
