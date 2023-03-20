import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

const TopBar = () => {
  const { optionScalpData, selectedPoolName } = useBoundStore();

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
            src={`/images/tokens/${optionScalpData?.baseSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.baseSymbol!}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/${optionScalpData?.quoteSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.quoteSymbol!}
          />
        </Box>
        <Box className="ml-4">
          <Typography variant="h5">Option Scalps</Typography>
          <Typography variant="h6">
            <span className="text-stieglitz">
              {selectedPoolName === 'ETH' ? 'ETH/USDC' : 'BTC/ETH'}
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;
