import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import NftCard from './components/NftCard';

const Nfts = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="NFTs" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-12 mt-32">
          <Typography variant="h1" className="mb-1">
            Dopex NFT's
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Users that are eligible can mint the NFT's here
          </Typography>
        </Box>
        <Box className="flex flex-col lg:flex-row lg:space-x-16 justify-center items-center">
          <NftCard nft="DopexBridgoorNFT" />
          <NftCard nft="DopexHalloweenNFT" />
        </Box>
      </Box>
    </Box>
  );
};

export default Nfts;
