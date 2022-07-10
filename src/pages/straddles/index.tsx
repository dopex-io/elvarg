import Head from 'next/head';
import Box from '@mui/material/Box';
import AppBar from 'components/common/AppBar';
import TopBar from 'components/straddles/TopBar';
import MiddleTop from 'components/straddles/MiddleTop';

const Straddles = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Straddles | Dopex</title>
      </Head>
      <AppBar />
      <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <TopBar />
      </Box>
      <Box>
        <Box className="pt-10 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
          <MiddleTop />
        </Box>
      </Box>
    </Box>
  );
};

export default Straddles;
