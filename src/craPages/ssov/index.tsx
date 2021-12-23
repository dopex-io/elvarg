import { useContext } from 'react';
import Head from 'next/head';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';

import { SsovContext } from 'contexts/Ssov';

const Ssov = () => {
  const {
    ssovPropertiesArray,
    ssovDataArray,
    userSsovDataArray,
    setSelectedSsov,
  } = useContext(SsovContext);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="text-center mx-auto max-w-xl mb-12 mt-32">
          <Typography variant="h1" className="mb-1">
            Single Staking Option Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
        </Box>
        <Box className="grid lg:grid-cols-3 grid-cols-1 place-items-center gap-y-10">
          {ssovPropertiesArray.length === 0 || ssovDataArray.length === 0
            ? [0, 1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rect"
                  width={350}
                  height={400}
                  animation="wave"
                  className="rounded-md bg-cod-gray"
                />
              ))
            : ssovPropertiesArray.map((ssovProperties, index) => (
                <SsovCard
                  key={index}
                  ssovProperties={ssovProperties}
                  ssovData={ssovDataArray[index]}
                  userSsovData={userSsovDataArray[index]}
                  setSelectedSsov={setSelectedSsov}
                  ssovIndex={ssovPropertiesArray.findIndex(
                    (item) => item.tokenName === ssovProperties.tokenName
                  )}
                />
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Ssov;
