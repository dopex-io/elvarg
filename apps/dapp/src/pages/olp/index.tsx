import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import NumberDisplay from 'components/UI/NumberDisplay';
import {
  StyleCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';

import VaultCard from 'components/olp/VaultCard';

import { useBoundStore } from 'store';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';
import { DOPEX_API_BASE_URL } from 'constants/env';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AssetTable } from './AssetTable';

const OLP_INTRO: string =
  'https://blog.dopex.io/articles/product-launches-updates/Option-Liquidity-Pools-Walkthrough';

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
  const { provider, tokenPrices, chainId } = useBoundStore();

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

          {/* <TableRow>
            <StyleLeftCell align="left">
              <Typography variant="caption" color="white">
                <Box className="bg-umbra w-14 p-2 rounded-md flex justify-around">
                  123{' '}
                </Box>
              </Typography>
            </StyleLeftCell>
            <StyleCell align="center">
              <Typography variant="caption" color="white">
                123{' '}
              </Typography>
            </StyleCell>
            <StyleRightCell align="right">
              <Typography variant="caption" color="white">
                123{' '}
              </Typography>
            </StyleRightCell>
          </TableRow> */}
        </Box>

        <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl p-5 mx-auto">
          <AssetTable olps={vaults!} />
        </Box>

        {/* <Box className="mb-12">
          <NetworkHeader chainId={chainId} />
          <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
            {getOlpCards(chainId)}
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Olp;
