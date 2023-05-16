import Box from '@mui/material/Box';
import { NextSeo } from 'next-seo';

import BondsPage from 'components/bonds/Bonds';
import AppBar from 'components/common/AppBar';

const DpxBonds = () => {
  return (
    <Box className="bg-black min-h-screen m-auto p-3">
      <NextSeo
        title={`Dopex Bonds`}
        description="Commit stables to received DPX at a discount"
        canonical={`https://dopex.io/dpx-bonds`}
        openGraph={{
          url: `https://dopex.io/dpx-bonds`,
          title: `Dopex Bonds`,
          description: 'Commit stables to received DPX at a discount',
          images: [
            {
              url: `https://dopex.io/images/banners/bonds.png`,
              width: 800,
              height: 600,
              alt: 'Bonds',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="DPX Bonds" />
      <Box className="py-20 md:py-32 md:flex mx-auto lg:w-[980px]">
        <Box className="mx-auto">
          <BondsPage />
        </Box>
      </Box>
    </Box>
  );
};

export default DpxBonds;
