import React from 'react';

import Box from '@mui/material/Box';

import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';

import Typography from 'components/UI/Typography';

import PoolChart from './PoolChart';

const PoolCard = () => {
  return (
    <Box className="text-gray-400 w-full mb-2 opacity-30">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <Box className="flex">
          <SignalCellularAltRoundedIcon className="mx-2" />
          <Typography variant="h6" className="text-gray-400">
            Pool Volume
          </Typography>
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <Box className="m-2 flex">
          <Box className="ml-2">
            <Typography variant="h6" className="pt-1 pb-4 text-gray-400">
              $1213.13
            </Typography>
            <Typography variant="h6" className="py-4 text-gray-400">
              $1213.13
            </Typography>
            <Typography variant="h6" className="pb-1 pt-4 text-gray-400">
              $1213.13
            </Typography>
          </Box>
          <Box className="w-full px-2 py-1 h-36">
            <PoolChart />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PoolCard;
