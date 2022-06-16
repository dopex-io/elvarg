import { useContext } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Accordion from 'components/atlantics/Accordion';
import Description from 'components/atlantics/Description';
import Stats from 'components/atlantics/Stats';
// import StrategyFilter from 'components/atlantics/StrategyFilter';

import { AtlanticsContext, AtlanticsProvider } from 'contexts/Atlantics';
import { CircularProgress } from '@mui/material';

const Atlantics = () => {
  const { pools } = useContext(AtlanticsContext);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="mx-auto mb-8">
          <Box className="flex flex-col divide-umbra md:divide-y divide-y-0">
            <Box className="flex flex-col sm:flex-col md:flex-row w-full justify-between">
              <Description />
              <Stats />
            </Box>
            <Box className="flex w-full justify-between">
              {/* <StrategyFilter /> */}
              <Box></Box>
            </Box>
          </Box>
          {pools && pools.length !== 0 ? (
            pools.map((pool, index) => {
              return (
                <Box
                  key={index}
                  className="sm:flex sm:flex-col lg:grid lg:grid-cols-4 pt-6"
                >
                  <Box className="flex flex-col col-span-1 space-y-4 ">
                    <Accordion
                      className="bg-cod-gray shadow-none"
                      header={pool.asset}
                      putPools={pool.put}
                      callPools={pool.call}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box className="flex justify-center items-center h-screen">
              <CircularProgress
                className="mb-[30rem]"
                size="40px"
                color="primary"
              />
            </Box>
          )}
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
