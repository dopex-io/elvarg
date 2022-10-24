import { useState } from 'react';
import Head from 'next/head';

import Box from '@mui/material/Box';

import ActionsDialog from 'components/nfts/diamondpepes/ActionsDialog';
import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';

import styles from 'components/nfts/diamondpepes/styles.module.scss';

import { useBoundStore } from 'store';

const DiamondPepesNfts = () => {
  const { contractAddresses } = useBoundStore();

  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const boxes = [
    { title: '-', subTitle: 'PEPES REMAINING' },
    { title: '5:55PM 5/12/2022', subTitle: 'START' },
    { title: '-', subTitle: 'TIME REMAINING' },
    { title: '-', subTitle: 'DEPOSITS' },
  ];

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <ActionsDialog
        open={actionsDialogDisplayState.visible}
        tab={actionsDialogDisplayState.tab}
        handleClose={() => {
          setActionsDialogDisplayState({ visible: false, tab: 'mint' });
        }}
      />
      <Box className={styles['background']!}>
        <Box className={styles['backgroundOverlay']!} />
        <Box className={styles['mobileBackgroundOverlay']!} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex">
            <img
              src={'/assets/pepe-2-logo.png'}
              className="ml-auto mr-auto z-1 relative md:w-auto w-60"
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

          <Box className="p-2 mt-7 md:flex">
            {boxes.map((box, index) => (
              <Box key={index} className="md:w-1/4 p-4 text-center">
                <Typography
                  variant="h3"
                  className="text-white font-display font-['Minecraft'] relative z-1"
                >
                  <span className={styles['pepeText']!}>{box.title}</span>
                </Typography>
                <Typography
                  variant="h4"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
                >
                  {box.subTitle}
                </Typography>
              </Box>
            ))}
          </Box>
          <img
            src={'/assets/pepe-line.png'}
            className="ml-auto mr-auto mt-8 mb-8"
            alt={''}
          />
          <Box className="flex">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[7rem]">
              <button
                className={styles['pepeButton']!}
                onClick={() =>
                  setActionsDialogDisplayState({ visible: true, tab: 'mint' })
                }
              >
                MINT
              </button>
            </Box>
          </Box>
          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
                className="w-40 ml-auto mr-auto"
                alt={'Pepe'}
              />
              <img
                src={'/assets/pledge-pepe-button.png'}
                className="w-48 z-50 mt-12 ml-auto mr-auto cursor-pointr"
                alt={'Pepe Button'}
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                “A [redacted] always repays his debts.”
                <br />
                <br />
                Everyone who participated in the pledge event will be getting a
                free Gen 2 sent to their wallets.
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src={'/assets/export.svg'}
                  className={'w-5 ml-auto'}
                  alt={'Export'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles['pepeLink']!}>Pledge Event</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/hand-pepe.png'}
                className="w-32 ml-auto mr-auto"
                alt={'Pepe'}
              />
              <img
                src={'/assets/reveal-pepe-button.png'}
                className="w-60 z-50 mt-12 ml-auto mr-auto cursor-pointer"
                alt={'Reveal Pepe'}
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                Please stay tuned for a reveal announcement from esteemed CEO.{' '}
                <br />
                <br />
                Please follow his twitter or Dopex’s official Twitter account
                for more information.
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src={'/assets/export.svg'}
                  className={'w-4 ml-auto'}
                  alt={'Export'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles['pepeLink']!}>Tofunft</span>
                </Typography>

                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto'}
                  alt={'Pepe tweet'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles['pepeLink']!}>DOPEX</span>
                </Typography>

                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto'}
                  alt={'Pepe tweet'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles['pepeLink']!}>CEO</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/joypad-pepe.png'}
                className="w-36 ml-auto mr-auto mt-9 mb-14"
                alt={'Joypad'}
              />
              <img
                src={'/assets/duel-pepe-button.png'}
                className="w-56 z-50 mt-12 ml-auto mr-auto cursor-pointer"
                alt={'Duel Pepe'}
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                Get Early Access to Duel Pepes, a commit-reveal based async pvp
                game with duels and wagers where winner takes all.
                <br />
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src={'/assets/export.svg'}
                  className={'w-5 ml-auto'}
                  alt={'Export'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles['pepeLink']!}>How to play</span>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="flex text-center h-[10rem]">
            <Typography
              variant="h5"
              className={
                "mr-auto ml-auto mt-auto text-stieglitz font-['Minecraft'] font-[0.2rem] break-all"
              }
            >
              Mint contract
              <br />
              <a
                href={`https://arbiscan.io/address/${contractAddresses['DuelDiamondPepesNFTsMint']}`}
                rel="noopener noreferrer"
                target={'_blank'}
              >
                {contractAddresses['DuelDiamondPepesNFTsMint']}
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
