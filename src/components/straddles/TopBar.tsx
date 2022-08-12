import { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

import Typography from 'components/UI/Typography';
import { AssetsContext } from 'contexts/Assets';

const TopBar = () => {
  const { tokenPrices } = useContext(AssetsContext);

  const ethPrice =
    tokenPrices.find((token) => token.name === 'ETH')?.price || 0;

  return (
    <Box>
      <Box className="flex">
        <Button size="small">
          <ArrowBackIosRoundedIcon className="text-gray-700" />
        </Button>
        <Box sx={{ p: 1 }} className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src="/images/tokens/eth.svg"
            alt={'eth icon'}
          />
          <img
            className="w-9 h-9 z-0"
            src="/images/tokens/usdc.svg"
            alt={'usdc icon'}
          />
        </Box>
        <Box className="ml-4">
          <Typography variant="h5">LONG STRADDLE</Typography>
          <Typography variant="h6" className="text-gray-500">
            ETH
          </Typography>
        </Box>
        <Typography variant="h4" className="text-wave-blue ml-4">
          ${ethPrice}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;
