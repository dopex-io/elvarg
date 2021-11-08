import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';

const Ssov = () => {
  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="SSOV" />
      <Box className="py-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-12">
          <Typography variant="h1" className="mb-1">
            Single Staking Option Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <Box className="flex space-x- space-x-24 justify-center">
          <SsovCard ssov="ssovDpx" />
          <SsovCard ssov="ssovRdpx" />
        </Box>
      </Box>
    </Box>
  );
};

export default Ssov;
