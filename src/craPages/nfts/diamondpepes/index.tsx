import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import styles from './styles.module.scss';

const DiamondPepesNfts = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <Box className={styles.backgroundOverlay}>
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24">
            <Typography
              variant="h1"
              className="mb-3 font-display text-wave-blue lg:text-[7rem] text-[4rem] hidden md:block"
            >
              <span className={styles.title}>DIAMOND PEPES</span>
            </Typography>
            <Typography
              variant={'h2'}
              className="text-white text-[1.6rem] block md:hidden z-50 relative"
            >
              Get Your Diamond Pepe
            </Typography>
          </Box>
          <Box className="mt-6 md:mt-4 max-w-4xl mx-auto">
            <Typography
              variant="h2"
              className="text-stieglitz text-center text-[1rem] leading-7 md:text-[1.6rem] md:leading-10 z-50 relative"
            >
              2,222 Unique Diamond Pepes up for grabs. Free mint passes by
              staking LP Tokens. Zap In with any asset.
            </Typography>
          </Box>
          <Box className="rounded-xl p-4 hidden md:flex border border-neutral-800 w-full mt-9">
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography variant={'h3'} className="text-white text-base">
                Genesis
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-5 md:pb-0"
              >
                Collection
              </Typography>
            </Box>
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography
                variant={'h3'}
                className="text-white text-base pt-5 md:pt-0"
              >
                2PM CET 2/22/2022
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-5 md:pb-0"
              >
                Start
              </Typography>
            </Box>
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography
                variant={'h3'}
                className="text-white text-base pt-5 md:pt-0"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-5 md:pb-0"
              >
                Time Remaining
              </Typography>
            </Box>
            <Box className={'md:w-1/4 w-6/12 border-neutral-800'}>
              <Typography
                variant={'h3'}
                className="text-white text-base pt-5 md:pt-0"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem]"
              >
                Deposits
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-t-xl p-0 flex md:hidden border border-neutral-800 w-full mt-9">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1rem] leading-5 z-50 relative"
              >
                Genesis
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-50 relative"
              >
                Collection
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1.0rem] leading-5 z-50 relative"
              >
                2PM CET 2/22/2022
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-50 relative"
              >
                Start
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-b-xl p-0 flex md:hidden border border-neutral-800 w-full mt-[-1.5px]">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1rem] leading-5 z-50 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-50 relative"
              >
                Time remaining
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1.0rem] leading-5 z-50 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-50 relative"
              >
                Deposits
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
