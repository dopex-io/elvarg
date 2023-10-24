import { useEffect } from 'react';
import Head from 'next/head';

import Box from '@mui/material/Box';

import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import PageLayout from 'components/common/PageLayout';
import RdpxV2Main from 'components/rdpx-v2';
import TitleBar from 'components/rdpx-v2/TitleBar';

import seo from 'constants/seo';

const Mint = () => {
  const {
    provider,
    setIsLoading,
    updateTreasuryContractState,
    updateTreasuryData,
    updateUserDscBondsData,
    updateAPPContractData,
  } = useBoundStore();

  useEffect(() => {
    setIsLoading(true);
    updateTreasuryContractState().then(() =>
      updateTreasuryData().then(() =>
        updateUserDscBondsData().then(() => {
          setIsLoading(false);
          updateAPPContractData();
        }),
      ),
    );
  }, [
    provider,
    updateTreasuryContractState,
    updateTreasuryData,
    updateUserDscBondsData,
    setIsLoading,
    updateAPPContractData,
  ]);

  return (
    <Box className="bg-contain min-h-screen">
      <Head>
        <title>Mint | Dopex</title>
      </Head>
      <NextSeo
        title={seo.rdpxV2.title}
        description={seo.rdpxV2.description}
        canonical={seo.rdpxV2.url}
        openGraph={{
          url: seo.rdpxV2.url,
          title: seo.rdpxV2.title,
          description: seo.rdpxV2.description,
          images: [
            {
              url: seo.rdpxV2.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.rdpxV2.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <div className="pt-1 lg:max-w-lg md:max-w-md sm:max-w-sm max-w-md mx-auto px-4 lg:px-0">
          <TitleBar />
        </div>
        <RdpxV2Main />
      </PageLayout>
    </Box>
  );
};

export default Mint;
