import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import PriceChart from './PriceChart';
import Typography from 'components/UI/Typography';

import Etherscan from 'svgs/icons/Etherscan';

const MAX_PRICE_ACHIEVED = 134.65;

const InfoSection = () => {
  const [dpxPrice, setDpxPrice] = useState(0);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=dopex&vs_currencies=usd'
      )
      .then((payload) => {
        setDpxPrice(payload.data.dopex.usd);
      });
  }, []);

  return (
    <Box className="lg:w-7/12 flex flex-col lg:mr-6">
      <Typography variant="h1" className="mb-5">
        DPX Token Sale
      </Typography>
      <Typography variant="h5" className="mb-5 text-stieglitz">
        The sale has concluded with{' '}
        <span className="text-wave-blue">4808 ETH</span> raised during the
        duration of the sale. If you {`haven't`} claimed your share, do so from
        the panel on the right. Farming is ongoing and can be accessed{' '}
        <Link href="/farms" passHref>
          <Box className="text-wave-blue" role="button">
            here.
          </Box>
        </Link>
      </Typography>
      <Box className="flex lg:flex-row flex-col mb-14 lg:mb-10">
        <Button
          startIcon={<ShowChartIcon />}
          variant="outlined"
          className="h-10 p-1 bg-umbra lg:mr-6 text-white px-3 hover:bg-cod-gray mb-2"
          href="https://docs.dopex.io/tokenomics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tokenomics
        </Button>
        <Button
          startIcon={<Etherscan />}
          variant="outlined"
          className="h-10 p-1 bg-umbra lg:mr-6 text-white px-4 hover:bg-cod-gray mb-2"
          href="https://etherscan.io/address/0x468aC403f2C0aE0C65dB7dc22eD3440aC6ab0c39"
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherscan
        </Button>
      </Box>
      <Box className="bg-cod-gray rounded-2xl lg:h-96 flex flex-col p-4 mb-12 lg:mb-0">
        <Typography variant="h3" className="text-center w-full">
          Sale Progress and Metrics
        </Typography>
        <Box className="h-48 w-full mb-8">
          <PriceChart maxPrice={MAX_PRICE_ACHIEVED} />
        </Box>
        <Box className="flex lg:flex-row flex-col border-umbra rounded-xl border py-2 px-4 lg:space-x-10">
          <Box className="flex lg:flex-col flex-row items-center lg:items-start mb-2 lg:mb-0">
            <Typography variant="h4" className="mr-4 lg:mr-0">
              {MAX_PRICE_ACHIEVED} $
            </Typography>
            <Typography variant="h6">Final Sale Price</Typography>
          </Box>
          <Box className="flex lg:flex-col flex-row items-center lg:items-start mb-2 lg:mb-0">
            <Typography variant="h4" className="mr-4 lg:mr-0">
              0.064 ETH
            </Typography>
            <Typography variant="h6">Final ETH Price</Typography>
          </Box>
          <Box className="flex lg:flex-col flex-row items-center lg:items-start mb-2 lg:mb-0">
            <Typography variant="h4" className="mr-4 lg:mr-0">
              {dpxPrice} $
            </Typography>
            <Typography variant="h6">Current Price</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoSection;
