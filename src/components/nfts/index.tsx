import { useContext } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import NftCard from './components/NftCard';

import { NftsContext } from 'contexts/Nfts';

const Nfts = () => {
  const { nftsData } = useContext(NftsContext);
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>NFTs | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-12 mt-32">
          <Typography variant="h1" className="mb-1">
            Dopex NFTs
          </Typography>
          <Typography variant="h5" className="text-stieglitz mb-2">
            Users that are eligible can mint the NFTs here
          </Typography>
        </Box>
        <Box className="flex flex-col lg:flex-row lg:space-x-16 justify-center items-center">
          {nftsData.map((nftData, index) => (
            <NftCard key={index} nftData={nftData} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Nfts;
