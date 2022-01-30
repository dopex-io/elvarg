import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';

const PreviousUpdatesDialog = ({ data, open, handleClose }) => {
  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-3">
        Previous Updates
      </Typography>
      <Box className="h-96">
        {data.map((item) => {
          return (
            <Box key={item.timestamp} className="mb-4">
              <Typography variant="h5">
                <span className="text-stieglitz">Price: </span> ${' '}
                {ethers.utils.formatUnits(item.price, 8)}
              </Typography>
              <Typography variant="h5">
                <span className="text-stieglitz">Updated At: </span>
                {new Date(item.timestamp * 1000).toUTCString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Dialog>
  );
};

const PriceCard = ({
  type,
  data,
}: {
  type: 'dopex' | 'chainlink' | 'uniswapV3';
  data: any;
}) => {
  const [dialogState, setDialogState] = useState({ open: false, data: [] });

  return (
    <Box className="border border-umbra rounded p-4 flex flex-col space-y-2">
      <PreviousUpdatesDialog
        data={dialogState.data}
        open={dialogState.open}
        handleClose={() => setDialogState({ data: [], open: false })}
      />
      <Typography variant="h3">{data.tokenSymbol}</Typography>
      <Typography variant="h5">
        <span className="text-stieglitz">Current Price: </span>$
        {ethers.utils.formatUnits(data.currentPrice, 8)}
      </Typography>
      <Typography variant="h5">
        <span className="text-stieglitz">Last Updated At: </span>
        {new Date(data.lastUpdated * 1000).toUTCString()}
      </Typography>
      {type === 'dopex' ? (
        <Typography
          variant="h5"
          className="text-wave-blue"
          role="button"
          onClick={() => {
            setDialogState({ open: true, data: data.allData });
          }}
        >
          Previous Updates
        </Typography>
      ) : null}
      <Typography variant="h5" className="text-stieglitz">
        Powered by <span className="capitalize">{type}</span>
      </Typography>
    </Box>
  );
};

const Oracles = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    async function getData() {
      const payload = await Promise.all([
        axios.get(
          'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=DPX'
        ),
        axios.get(
          'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=rDPX'
        ),
      ]);

      setState(
        payload.map((item) => {
          return item.data.data;
        })
      );
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
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h1" className="mb-1">
            Oracles
          </Typography>
        </Box>
        <Box className="grid grid-cols-2 gap-20">
          {state.length ? (
            <>
              <PriceCard
                type="dopex"
                data={{
                  tokenSymbol: 'DPX',
                  currentPrice: state[0][state[0].length - 1].twap,
                  lastUpdated: state[0][state[0].length - 1].timestamp,
                  allData: state[0]
                    .map((item) => ({
                      price: item.twap,
                      timestamp: item.timestamp,
                    }))
                    .reverse(),
                }}
              />
              <PriceCard
                type="dopex"
                data={{
                  tokenSymbol: 'rDPX',
                  currentPrice: state[1][state[1].length - 1].twap,
                  lastUpdated: state[1][state[1].length - 1].timestamp,
                  allData: state[1]
                    .map((item) => ({
                      price: item.twap,
                      timestamp: item.timestamp,
                    }))
                    .reverse(),
                }}
              />
            </>
          ) : null}
          {/* <PriceCard /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Oracles;
