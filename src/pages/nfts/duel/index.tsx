import Head from 'next/head';
import { useCallback, useContext, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DuelContext } from 'contexts/Duel';
import { DuelProvider } from 'contexts/Duel';
import { WalletContext } from 'contexts/Wallet';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import ActiveDuel from 'components/nfts/duel/ActiveDuel';
import Duels from 'components/nfts/duel/Duels';
import CreateDuel from 'components/nfts/duel/Dialogs/CreateDuel';
import FindDuel from 'components/nfts/duel/Dialogs/FindDuel';

import styles from 'components/nfts/duel/styles.module.scss';
import { AssetsContext } from '../../../contexts/Assets';

const DuelPepes = () => {
  const { isLoading, activeDuels, updateDuels, duelContract } =
    useContext(DuelContext);
  const { signer } = useContext(WalletContext);
  {
    /* const [activeFilter, setActiveFilter] = useState<string>('open'); */
  }
  const { updateAssetBalances } = useContext(AssetsContext);
  const [isCreateDuelDialogOpen, setIsCreateDuelDialogOpen] =
    useState<boolean>(false);
  const [isFindDuelDialogOpen, setIsFindDuelDialogOpen] =
    useState<boolean>(false);
  const [duelId, setDuelId] = useState<number>(0);

  const handleReveal = useCallback(async () => {}, []);

  const handleUndo = useCallback(
    async (id: number) => {
      if (!signer || !duelContract || !duelContract || !updateDuels) return;

      await duelContract.undoDuel(id);

      await updateDuels();
    },
    [duelContract, signer, updateDuels]
  );

  const findDuel = (id: number) => {
    setIsFindDuelDialogOpen(true);
    setDuelId(id);
  };

  const openCreateDuelDialog = async () => {
    await updateAssetBalances();
    setIsCreateDuelDialogOpen(true);
  };

  const openFindDuelDialog = async () => {
    await updateAssetBalances();
    setIsFindDuelDialogOpen(true);
  };

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

        <CreateDuel
          open={isCreateDuelDialogOpen}
          handleClose={openCreateDuelDialog}
        />

        <FindDuel
          open={isFindDuelDialogOpen}
          handleClose={openFindDuelDialog}
          duelId={duelId}
          setDuelId={setDuelId}
        />

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
              onClick={() =>
                window.location.replace(
                  'https://app.dopex.io/nfts/diamondpepes2'
                )
              }
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 ml-4 mt-1 cursor-pointer"
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
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
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
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-4 mt-1 cursor-pointer"
              onClick={() =>
                window.location.replace('https://twitter.com/chutoro_au')
              }
            >
              <span className={styles['pepeLink']}>CEO</span>
            </Typography>
          </Box>

          <Box className="flex mt-6">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[14rem]">
              <button
                className={styles['pepeButton']}
                onClick={() => setIsCreateDuelDialogOpen(true)}
              >
                CREATE DUEL
              </button>
            </Box>
          </Box>

          <img
            src={'/assets/pepe-line.png'}
            className="ml-auto mr-auto mt-8 mb-12"
            alt={''}
          />

          <Box className="flex mb-14">
            <Typography
              variant="h3"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 text-center"
            >
              <span className={styles['pepeLink']}>
                YOUR ACTIVE AND RECENT DUELS
              </span>
            </Typography>
          </Box>

          {activeDuels.map((duel, key) => (
            <Box className="mb-16" key={key}>
              <ActiveDuel
                duel={duel}
                handleUndo={handleUndo}
                handleReveal={handleReveal}
              />
            </Box>
          ))}

          {activeDuels.length == 0 ? (
            isLoading ? (
              <Box className="text-stieglitz text-center pt-8 pb-9">
                <CircularProgress size={26} color="inherit" />
              </Box>
            ) : (
              <Box className="text-stieglitz text-center pt-8 pb-9">
                <Typography
                  variant="h6"
                  className="text-white font-['Minecraft']"
                >
                  Your duels will appear here
                </Typography>
              </Box>
            )
          ) : null}
        </Box>

        <img
          src={'/assets/pepe-line.png'}
          className="ml-auto mr-auto mb-12"
          alt={''}
        />

        <Box className="flex">
          <Typography
            variant="h3"
            className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 text-center"
          >
            <span className={styles['pepeLink']}>ALL DUELS</span>
          </Typography>
        </Box>

        {/* <Box className={'flex mt-4 z-50 relative'}>
          <Box
            className={
              'flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md w-36 ml-auto mr-3'
            }
          >
            <Box
              className={
                activeFilter === 'open'
                  ? 'text-center w-full pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                  : 'text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
              }
            >
              <Typography
                variant="h6"
                className={
                  activeFilter === 'open'
                    ? 'text-xs font-normal font-["Minecraft"]'
                    : 'text-[#78859E] text-xs font-normal font-["Minecraft"]'
                }
                onClick={() => setActiveFilter('open')}
              >
                OPEN
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md w-36 mr-3">
            <Box
              className={
                activeFilter === 'finished'
                  ? 'text-center w-full pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                  : 'text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
              }
            >
              <Typography
                variant="h6"
                className={
                  activeFilter === 'finished'
                    ? 'text-xs font-normal font-["Minecraft"]'
                    : 'text-[#78859E] text-xs font-normal font-["Minecraft"]'
                }
                onClick={() => setActiveFilter('finished')}
              >
                FINISHED
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md w-36 mr-auto">
            <Box
              className={
                activeFilter === 'yours'
                  ? 'text-center w-full pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                  : 'text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
              }
            >
              <Typography
                variant="h6"
                className={
                  activeFilter === 'yours'
                    ? 'text-xs font-normal font-["Minecraft"]'
                    : 'text-[#78859E] text-xs font-normal font-["Minecraft"]'
                }
                onClick={() => setActiveFilter('yours')}
              >
                YOURS
              </Typography>
            </Box>
          </Box>
        </Box> */}

        <Box className="pt-2 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0 mt-8">
          <Duels findDuel={findDuel} />
        </Box>
      </Box>
    </Box>
  );
};

const DuelPepesPage = () => (
  <DuelProvider>
    <DuelPepes />
  </DuelProvider>
);

export default DuelPepesPage;
