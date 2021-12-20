import { useContext } from 'react';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import bridgoor from 'assets/nft/bridgoor.gif';
import dopexGames from 'assets/nft/dopex-halloween-games.gif';
import NftCard from './components/NftCard';

const Ssov = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="NFT" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-12 mt-32">
          <Typography variant="h1" className="mb-1">
            Dopex NFT
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Users that are eligible can mint the NFT's here
          </Typography>
        </Box>
        <Box className="flex flex-row lg:flex-row lg:space-x-16 space-y-12 lg:space-y-0 justify-center items-center">
          <Box>
            <NftCard gif={bridgoor} nft={'DopexBridgoor'}></NftCard>
          </Box>
          <Box>
            <NftCard gif={dopexGames} nft={'DopexHalloween'}></NftCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Ssov;
