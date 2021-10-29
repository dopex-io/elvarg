import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import VaultCard from './components/VaultCard';

import { SsovProvider } from 'contexts/Ssov';

const Ssov = () => {
  return (
    <SsovProvider>
      <Box className="bg-black min-h-screen">
        <AppBar active="SSOV" />
        <Box className="pb-32 pt-20 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Alert severity="warning" className="mb-12">
            Deposits for the first epoch (1st November to 26th November) open on
            29th October 8:00 AM UTC till 1st November 8:00 AM UTC
          </Alert>
          <Box className="text-center mx-auto max-w-xl mb-12">
            <Typography variant="h1" className="mb-1">
              Single Staking Option Vaults
            </Typography>
            <Typography variant="h5" className="text-stieglitz">
              Supply liquidity to Dopex pools. Collect premiums and earn DPX &
              rDPX as a liquidity provider.
            </Typography>
          </Box>
          <Box>
            <VaultCard />
          </Box>
        </Box>
      </Box>
    </SsovProvider>
  );
};

export default Ssov;
