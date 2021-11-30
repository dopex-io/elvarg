import { useContext } from 'react';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import cx from 'classnames';
import Skeleton from '@material-ui/lab/Skeleton';
import Countdown from 'react-countdown';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import SsovCard from './components/SsovCard';
import AutoExerciseBanner from 'components/Banners/AutoExerciseBanner';
import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import styles from './components/SsovCard/styles.module.scss';

const Ssov = () => {
  const { ssovArray, ssovDataArray, userSsovDataArray } =
    useContext(SsovContext);

  const { chainId } = useContext(WalletContext);

  if (ssovArray.length === 0 || ssovDataArray.length === 0)
    return (
      <Box className="bg-black min-h-screen">
        <Head>
          <title>SSOV | Dopex</title>
        </Head>
        <AppBar active="SSOV" />
        <Box className="pt-1 pb-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <AutoExerciseBanner />
          <Box className="text-center mx-auto max-w-xl mb-12 mt-8">
            <Typography variant="h1" className="mb-1">
              Single Staking Option Vaults
            </Typography>
            <Typography variant="h5" className="text-stieglitz">
              Supply option liquidity to an Option Vault. Collect premiums from
              option purchases and earn rewards from farms simultaneously.
            </Typography>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:space-x-24 space-y-12 lg:space-y-0 justify-center items-center">
            {chainId == 1 ? (
              <Box
                className={cx('p-0.5 rounded-xl', styles['WETH'], styles.Box)}
              >
                <Box className="flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto">
                  <Skeleton
                    variant="rect"
                    width={330}
                    height={560}
                    animation="wave"
                    className="lg:mr-3 mb-3 bg-cod-gray"
                  />
                </Box>
              </Box>
            ) : (
              <Box className="flex flex-row">
                <Box
                  className={cx(
                    'p-0.5 rounded-xl mr-24',
                    styles['WETH'],
                    styles.Box
                  )}
                >
                  <Box className="flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto">
                    <Skeleton
                      variant="rect"
                      width={330}
                      height={560}
                      animation="wave"
                      className="lg:mr-3 mb-3 bg-cod-gray"
                    />
                  </Box>
                </Box>{' '}
                <Box
                  className={cx('p-0.5 rounded-xl', styles['WETH'], styles.Box)}
                >
                  <Box className="flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto">
                    <Skeleton
                      variant="rect"
                      width={330}
                      height={560}
                      animation="wave"
                      className="lg:mr-3 mb-3 bg-cod-gray"
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );

  const { epochTimes } = ssovDataArray[0];

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Box className="pt-1 pb-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <AutoExerciseBanner />
        <Box className="text-center mx-auto max-w-xl mb-12 mt-8">
          <Typography variant="h1" className="mb-1">
            Single Staking Option Vaults
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Supply option liquidity to an Option Vault. Collect premiums from
            option purchases and earn rewards from farms simultaneously.
          </Typography>
          <Countdown
            date={new Date((epochTimes[1] - 3600) * 1000)}
            renderer={({ days, hours, minutes, seconds }) => {
              return (
                <span className="text-wave-blue">
                  Time left to exercise: {days}d {hours}h {minutes}m {seconds}s
                </span>
              );
            }}
          />
        </Box>
        <Box className="flex flex-col lg:flex-row lg:space-x-24 space-y-12 lg:space-y-0 justify-center items-center">
          {ssovArray.map((ssov, index) => (
            <SsovCard
              key={index}
              ssov={ssov}
              ssovData={ssovDataArray[index]}
              userSsovData={userSsovDataArray[index]}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Ssov;
