import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import ShowcaseCard from '../components/ShowcaseCard';

import { SHOWCASE_NFTS } from 'constants/index';

const Showcase = () => {
  return (
    <>
      <Box className="bg-black min-h-screen">
        <AppBar active="NFTs" />
        <Box className="pt-32 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Box className="grid grid-cols-3 space-x-8 justify-center items-center">
            {SHOWCASE_NFTS.map((object, index) => (
              <ShowcaseCard nft={object.nft} key={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Showcase;
