import Head from 'next/head';

import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import ActiveDuel from 'components/nfts/duel/ActiveDuel';

import styles from 'components/nfts/duel/styles.module.scss';

const DuelPepes = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Duel Pepes | Dopex</title>
      </Head>

      {/* @ts-ignore TODO: FIX */}
      <Box className={styles['background']}>
        {/* @ts-ignore TODO: FIX */}
        <Box className={styles['backgroundOverlay']} />
        {/* @ts-ignore TODO: FIX */}
        <Box className={styles['mobileBackgroundOverlay']} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex">
            <img
              src={'/images/nfts/pepes/duel-pepe-logo.png'}
              className="ml-auto mr-auto z-1 relative md:w-[50rem] w-60"
              alt="Pepe"
            />
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h4"
              className="text-[#78859E] text-center md:leading-10 z-1 relative font-['Minecraft']"
            >
              Duel other Diamond Pepes in a commit-reveal based async game where
              any whitelisted NFT holder, starting with Gen 2 Diamond Pepes can
              create duels by submitting a token, wager amount and signature of
              their initial selected moves.
            </Typography>
          </Box>

          <Box className={'flex mt-6'}>
            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-auto mt-1'}
              alt={'Mint Gen2 Pepe'}
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 ml-4 mt-1"
            >
              <span className={styles['pepeLink']}>Mint Gen2 Pepe</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'How to play'}
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1"
            >
              <span className={styles['pepeLink']}>How to play</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'Pepe tweet'}
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-4 mt-1"
            >
              <span className={styles['pepeLink']}>CEO</span>
            </Typography>
          </Box>

          <Box className="flex mt-6">
            <Box className="ml-auto mb-5 mt-5 lg:w-[14rem]">
              <button className={styles['pepeButton']}>CREATE DUEL</button>
            </Box>
            <Box className="ml-6 mr-auto mb-5 mt-5 lg:w-[14rem]">
              <button className={styles['pepeButton']}>FIND DUEL</button>
            </Box>
          </Box>

          <img
            src={'/assets/pepe-line.png'}
            className="ml-auto mr-auto mt-8 mb-12"
            alt={''}
          />

          <Box className="flex mb-10">
            <Typography
              variant="h3"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 text-center"
            >
              <span className={styles['pepeLink']}>
                YOUR ACTIVE AND RECENT DUELS
              </span>
            </Typography>
          </Box>

          <ActiveDuel
            opponentAddress="0x9f96c987f70aa929118e6b333e36a06742785806"
            duelist={334}
            opponent={234}
            duelId={4}
            moves={['punch', 'kick', 'special', 'block']}
            wager={10500}
            timestamps={[]}
            challengeTimeLimit={1}
            isCreatorWinner={false}
            revealTimeLimit={1}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DuelPepes;
