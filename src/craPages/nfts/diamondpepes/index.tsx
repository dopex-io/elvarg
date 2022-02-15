import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import styles from './styles.module.scss';
import CustomButton from '../../../components/UI/CustomButton';
import { Tooltip } from '@material-ui/core';

const DiamondPepesNfts = () => {
  const boxes = [
    { title: 'Genesis', subTitle: 'Collection' },
    { title: '2PM 2/2/22', subTitle: 'Start CET' },
    { title: '-', subTitle: 'Time remaining' },
    { title: '-', subTitle: 'Deposits' },
    { title: '-', subTitle: 'Your deposits' },
  ];

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <Box>
        <Box className={styles.backgroundOverlay} />
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex ">
            <img
              src={'/assets/diamondpepes.svg'}
              className="ml-auto mr-auto z-50 relative"
            />
            <Typography
              variant={'h2'}
              className="text-white text-[1.6rem] block md:hidden z-40 relative"
            >
              Get Your Diamond Pepe
            </Typography>
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h3"
              className="text-[#78859E] text-center leading-7 md:leading-10 z-40 relative font-['Minecraft']"
            >
              2,222 Unique Diamond Pepes up for grabs. Free mint passes by
              staking LP Tokens. Zap In with any asset.
            </Typography>
          </Box>
          <Box className="pl-4 pr-4 hidden md:flex border border-[#232935] w-full mt-9 bg-[#181C24] z-50 relative">
            {boxes.map((box, i) => (
              <Box
                className={
                  i === boxes.length - 1
                    ? 'md:w-1/5 w-6/12 border-b md:border-b-0 border-neutral-800'
                    : 'md:w-1/5 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
                }
              >
                <Typography
                  variant={'h3'}
                  className="text-white text-base pt-4 pb-1 font-['Minecraft']"
                >
                  {box['title']}
                </Typography>
                <Typography
                  variant={'h4'}
                  className="text-[#78859E] pb-3 font-['Minecraft']"
                >
                  {box['subTitle']}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="rounded-t-xl p-0 flex md:hidden border border-neutral-800 w-full mt-9">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h5'}
                className="text-white text-[1rem] leading-5 z-40 relative"
              >
                Genesis
              </Typography>
              <Typography
                variant={'h5'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Collection
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h5'}
                className="text-white text-[1.0rem] leading-5 z-40 relative"
              >
                2PM CET 2/22/2022
              </Typography>
              <Typography
                variant={'h5'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Start
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-b-xl p-0 flex md:hidden border border-neutral-800 w-full mt-[-1.5px]">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h5'}
                className="text-white text-[1rem] leading-5 z-40 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h5'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Time remaining
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h5'}
                className="text-white text-[1.0rem] leading-5 z-40 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h5'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Deposits
              </Typography>
            </Box>
          </Box>

          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-50"
              >
                <span className={styles.pepeText}>Deposit LP Tokens</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-4"
              >
                This mint experience only requires you to stake LP tokens to get
                your Diamond Pepe(s).
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-5"
              >
                Please note that you'll need to deposit 1.5 LP tokens minimum
                per pepe for a guaranteed mint.
                <br />
                <br />
              </Typography>

              <Box className="ml-3 mt-10">
                <Tooltip title={'Not open yet'}>
                  <button className={styles.pepeButton}>Deposit</button>
                </Tooltip>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-50"
              >
                <span className={styles.pepeText}>Wait for mint</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-4"
              >
                You can mint your NFT when the deposit period ends. This is set
                for two days from opening pool.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-5"
              >
                You can check the reveal of these NFTs on mint day on
                tofunft.com. <br />
                <br />
                Good luck kid.
              </Typography>

              <Box className="ml-5 mt-10">
                <Tooltip title={'Not open yet'}>
                  <button className={styles.pepeButton} disabled>
                    2/4/2022
                  </button>
                </Tooltip>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-50"
              >
                <span className={styles.pepeText}> Withdraw Later</span>
              </Typography>

              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-4"
              >
                Your stake is locked for 14 days. Once unlocked you can withdraw
                all funds anytime.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-50 mt-5"
              >
                Excess deposits that doesn't end up with additional pepes will
                also return its share of the farming reward upon withdrawing.
              </Typography>

              <Box className="ml-3 mt-10">
                <Tooltip title={'Not open yet'}>
                  <button className={styles.pepeButton} disabled>
                    3/3/2022
                  </button>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
