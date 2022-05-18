import { useContext } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Accordion from 'components/atlantics/Accordion';
import Description from 'components/atlantics/Description';
import Stats from 'components/atlantics/Stats';

import { AtlanticsContext, AtlanticsProvider } from 'contexts/Atlantics';

const Atlantics = () => {
  const { marketsData } = useContext(AtlanticsContext);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="mx-auto mb-8">
          <Box className="flex flex-col flex-wrap divide-y divide-umbra">
            <Box className="flex w-full justify-between">
              <Description />
              <Stats />
            </Box>
            <Box className="grid grid-cols-4 pt-6">
              <Box className="flex flex-col col-span-1 space-y-6">
                {marketsData?.map((market, index) => {
                  return (
                    <Accordion
                      className="bg-cod-gray shadow-none border border-umbra"
                      key={index}
                      header={market.tokenId}
                      stats={market.stats}
                      pools={market.pools}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const AtlanticsPage = () => {
  return (
    <AtlanticsProvider>
      <Atlantics />
    </AtlanticsProvider>
  );
};

export default AtlanticsPage;
