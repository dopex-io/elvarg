import Box from '@mui/material/Box';

import { NextSeo } from 'next-seo';

import BondsPage from 'components/bonds/Bonds';
import AppBar from 'components/common/AppBar';

import seo from 'constants/seo';

const DpxBonds = () => {
  return (
    <Box className="bg-black min-h-screen m-auto p-3">
      <NextSeo
        title={seo.bonds.title}
        description={seo.bonds.description}
        canonical={seo.bonds.url}
        openGraph={{
          url: seo.bonds.url,
          title: seo.bonds.title,
          description: seo.bonds.description,
          images: [
            {
              url: seo.bonds.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.bonds.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <Box className="py-20 md:py-32 md:flex mx-auto lg:w-[980px]">
        <Box className="mx-auto">
          <BondsPage />
        </Box>
      </Box>
    </Box>
  );
};

export default DpxBonds;
