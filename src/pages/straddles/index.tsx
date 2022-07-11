import Head from 'next/head';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TopBar from 'components/straddles/TopBar';
import StatsTab from 'components/straddles/StatsTab';
import PoolCard from 'components/straddles/PoolCard';
import TVLCard from 'components/straddles/TVLCard';
import DepositsCard from 'components/straddles/DepositsCard';

const Straddles = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Straddles | Dopex</title>
      </Head>
      <AppBar />
      <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
        <TopBar />
      </Box>
      <Box>
        <Box className="pt-10 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
          <StatsTab />
        </Box>
        <Box className="pt-10 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
          <Typography variant="h6" className="-ml-1">
            Liquidity
          </Typography>
        </Box>
        <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 lg:flex md:flex">
          <PoolCard />
          <Box className="mx-2"></Box>
          <TVLCard />
        </Box>
        <Box className="pt-10 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
          <Typography variant="h6" className="-ml-1">
            Deposits
          </Typography>
        </Box>
        <Box className="h-80 py-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 flex-auto">
          <DepositsCard />
        </Box>
      </Box>
    </Box>
  );
};

export default Straddles;
