import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { useBoundStore } from 'store';

const TopBar = () => {
  const { optionPerpData, selectedPoolName } = useBoundStore();

  return (
    <Box className="flex justify-between">
      <Box className="flex items-center">
        <Typography
          variant="h5"
          className="bg-primary rounded-lg p-2 font-bold h-[fit-content]"
        >
          BETA
        </Typography>
        <Box sx={{ p: 1 }} className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPoolName.toLowerCase()}.svg`}
            alt={selectedPoolName}
          />
          <img
            className="w-9 h-9 z-0"
            src="/images/tokens/usdc.svg"
            alt="USDC"
          />
        </Box>
        <Box className="ml-4">
          <Typography variant="h5">Option Perpetual</Typography>
          <Typography variant="h6" className="text-gray-500">
            {selectedPoolName}
          </Typography>
        </Box>
        <Typography variant="h4" className="ml-4 self-start">
          ${formatAmount(getUserReadableAmount(optionPerpData?.markPrice!, 8), 2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;
