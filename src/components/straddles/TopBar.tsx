import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Typography from 'components/UI/Typography';

const TopBar = () => {
  return (
    <Box>
      <Box className="flex">
        <Button size="small" className="-m-4">
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
            ETH-USDC-PUTS-3D
          </Typography>
        </Box>
        <Box className="mx-4 mt-1">
          <Button
            size="medium"
            color="secondary"
            className="mx-2 text-white text-md h-8 p-3 hover:text-gray-200 hover:bg-mineshaft bg-neutral-800"
          >
            Weekly
          </Button>
          <Button
            size="medium"
            color="secondary"
            className="mx-2 text-white text-md h-8 p-3 hover:text-gray-200 hover:bg-mineshaft bg-neutral-800"
          >
            Puts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;
