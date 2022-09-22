import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import { AssetsContext } from 'contexts/Assets';
import { OlpContext } from 'contexts/Olp';

const TopBar = () => {
  const { tokenPrices } = useContext(AssetsContext);

  const { selectedPoolName } = useContext(OlpContext);

  const tokenPrice =
    tokenPrices.find((token) => token.name === selectedPoolName)?.price || 0;

  return (
    <Box>
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
          ${tokenPrice}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;
