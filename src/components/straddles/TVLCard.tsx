import React from 'react';
import Box from '@mui/material/Box';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import Typography from 'components/UI/Typography';
import TVLChart from './TVLChart';

const TVLCard = () => {
  return (
    <Box className="text-gray-400 w-full">
      <Box className="border rounded-t-xl border-cod-gray py-2 bg-cod-gray">
        <Box className="flex">
          <SignalCellularAltRoundedIcon className="mx-2" />
          <Typography variant="h6" className="text-gray-400">
            TVL vs Queued Withdrawals
          </Typography>
        </Box>
      </Box>
      <Box className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-cod-gray">
        <Box className="px-2 py-2 h-36 m-2">
          <TVLChart />
        </Box>
      </Box>
    </Box>
  );
};

export default TVLCard;
