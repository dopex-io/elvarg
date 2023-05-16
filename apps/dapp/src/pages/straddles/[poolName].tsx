import { useEffect } from 'react';

import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import PoolCard from 'components/straddles/Charts/PoolCard';
import TVLCard from 'components/straddles/Charts/TVLCard';
import Deposits from 'components/straddles/Deposits';
import Manage from 'components/straddles/Manage';
import Positions from 'components/straddles/Positions';
import Stats from 'components/straddles/Stats';
import TopBar from 'components/straddles/TopBar';

const SHOWCHARTS = false;

const Straddles = ({ poolName }: { poolName: string }) => {
  const {
    setSelectedPoolName,
    updateStraddles,
    updateStraddlesUserData,
    updateStraddlesEpochData,
    setIsLoading,
    chainId,
  } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName) {
      setSelectedPoolName(poolName);
      setIsLoading(true);
      updateStraddles().then(() =>
        updateStraddlesEpochData().then(() => {
          updateStraddlesUserData().then(() => {
            setIsLoading(false);
          });
        })
      );
    }
  }, [
    chainId,
    setIsLoading,
    updateStraddles,
    updateStraddlesEpochData,
    updateStraddlesUserData,
    poolName,
    setSelectedPoolName,
  ]);

  return (
    <Box className="bg-black min-h-screen">
      <NextSeo
        title={`${poolName} Dopex Atlantic Straddles`}
        description="Buy/Write straddles on crypto assets"
        canonical={`https://dopex.io/straddles/${poolName}`}
        openGraph={{
          url: `https://dopex.io/straddles/${poolName}`,
          title: `Dopex Atlantic Straddles`,
          description: 'Buy/Write straddles on crypto assets',
          images: [
            {
              url: `https://dopex.io/images/banners/straddles.png`,
              width: 800,
              height: 600,
              alt: 'Straddles',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="Straddles" />
      <Box className="md:flex pt-5">
        <Box className="ml-auto lg:w-[45%]">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBar />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Stats />
          </Box>
          {SHOWCHARTS ? (
            <Box>
              <Box className="pt-8 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0">
                <Typography variant="h6" className="-ml-1">
                  Liquidity
                </Typography>
              </Box>
              <Box className="pt-4 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 relative md:flex">
                <Typography
                  variant="h4"
                  className="md:left-[40%] left-[25%] top-[40%] absolute"
                >
                  <span className="text-white">Not available yet</span>
                </Typography>
                <Box className="md:w-1/2 w-full md:pr-2">
                  <PoolCard />
                </Box>
                <Box className="md:w-1/2 w-full md:pl-2">
                  <TVLCard />
                </Box>
              </Box>
            </Box>
          ) : null}

          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              Deposits
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <Deposits />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0">
            <Typography variant="h6" className="-ml-1">
              Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <Positions />
            {chainId === 137 ? (
              <img
                className="mt-10"
                src="/images/misc/powered-by-polygon.svg"
                alt="Powered by Polygon"
              />
            ) : null}
          </Box>
        </Box>
        <Box className="lg:pt-32 sm:pt-20 lg:mr-auto md:mx-0 mx-4 mb-8 px-2 lg:px-0 lg:ml-32">
          <Manage />
        </Box>
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const poolName = router.query['poolName'] as string;

  return <Straddles poolName={poolName} />;
};

export default ManagePage;
