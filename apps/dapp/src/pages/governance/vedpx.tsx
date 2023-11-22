import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import Overview from 'components/vedpx/Overview';
import UserVeDPX from 'components/vedpx/UserVeDPX';
import VeDPXYield from 'components/vedpx/VeDPXYield';

import seo from 'constants/seo';

const VeDPX = () => {
  const { signer, provider, updateVedpxData, updateUserVedpxData } =
    useBoundStore();

  useEffect(() => {
    updateVedpxData();
  }, [updateVedpxData]);

  useEffect(() => {
    updateUserVedpxData();
  }, [updateUserVedpxData, , signer, provider]);

  return (
    <Box className="bg-black min-h-screen">
      <NextSeo
        title={seo.vedpx.title}
        description={seo.vedpx.description}
        canonical={seo.vedpx.url}
        openGraph={{
          url: seo.vedpx.url,
          title: seo.vedpx.title,
          description: seo.vedpx.description,
          images: [
            {
              url: seo.vedpx.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.vedpx.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <Box className="py-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Overview />
        <Box className="flex flex-col space-x-0 lg:space-x-4 lg:flex-row">
          <UserVeDPX />
          <VeDPXYield />
        </Box>
      </Box>
    </Box>
  );
};

export default VeDPX;
