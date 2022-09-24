import Box from '@mui/material/Box';
import formatAmount from 'utils/general/formatAmount';
import { Typography } from 'components/UI';

import { useBoundStore } from 'store';

const TopBar = () => {
  const { tokenPrices, selectedPoolName, olpEpochData } = useBoundStore();

  const tokenPrice =
    tokenPrices.find((token) => token.name === selectedPoolName)?.price || 0;

  return (
    <Box>
      <Box className="flex justify-between">
        <Box className="flex items-center">
          <Typography
            variant="h5"
            className="ml-4 bg-primary rounded-lg p-2 font-bold h-[fit-content]"
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
            <Typography variant="h5">OPTIONS LP</Typography>
            <Typography variant="h6" className="text-gray-500">
              {selectedPoolName}
            </Typography>
          </Box>
          <Typography variant="h4" className="ml-4 self-start">
            ${formatAmount(tokenPrice, 2)}
          </Typography>
        </Box>
        {olpEpochData?.isEpochExpired ? (
          <Box className="p-2 my-2 rounded-lg border border-down-bad border-opacity-30 bg-down-bad bg-opacity-10">
            <Typography variant="h6" color="down-bad">
              Expired
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default TopBar;
