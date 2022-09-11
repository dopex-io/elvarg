import Head from 'next/head';
import { useCallback, useContext, useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DuelContext, Duel } from 'contexts/Duel';
import { DuelProvider } from 'contexts/Duel';
import { WalletContext } from 'contexts/Wallet';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import ActiveDuel from 'components/nfts/duel/ActiveDuel';
import Duels from 'components/nfts/duel/Duels';
import CreateDuel from 'components/nfts/duel/Dialogs/CreateDuel';
import FindDuel from 'components/nfts/duel/Dialogs/FindDuel';
import RevealDuel from 'components/nfts/duel/Dialogs/RevealDuel';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from 'components/nfts/duel/styles.module.scss';

const DuelPepes = () => {
  const {
    isLoading,
    activeDuels,
    updateDuels,
    duelContract,
    setSelectedDuel,
    availableCredit,
  } = useContext(DuelContext);
  const { signer } = useContext(WalletContext);
  const [isCreateDuelDialogOpen, setIsCreateDuelDialogOpen] =
    useState<boolean>(false);
  const [isFindDuelDialogOpen, setIsFindDuelDialogOpen] =
    useState<boolean>(false);
  const [isRevealDuelDialogOpen, setIsRevealDuelDialogOpen] =
    useState<boolean>(false);

  const handleUndo = useCallback(
    async (id: number) => {
      if (!signer || !duelContract || !duelContract || !updateDuels) return;

      await duelContract.undoDuel(id);

      await updateDuels();
    },
    [duelContract, signer, updateDuels]
  );

  const handleClaimForfeit = useCallback(
    async (id: number) => {
      if (!signer || !duelContract || !duelContract || !updateDuels) return;

      await duelContract.claimForfeit(id);

      await updateDuels();
    },
    [duelContract, signer, updateDuels]
  );

  const findDuel = (duel: Duel) => {
    setSelectedDuel!(duel);
    setIsFindDuelDialogOpen(true);
  };

  const revealDuel = (duel: Duel) => {
    setSelectedDuel!(duel);
    setIsRevealDuelDialogOpen(true);
  };

  const closeCreateDuelDialog = async () => {
    setIsCreateDuelDialogOpen(false);
  };

  const closeFindDuelDialog = async () => {
    setIsFindDuelDialogOpen(false);
  };

  const closeRevealDuelDialog = async () => {
    setIsRevealDuelDialogOpen(false);
  };

  const toMintForFree = useMemo(() => {
    return Math.floor(getUserReadableAmount(availableCredit, 18) / 0.88);
  }, [availableCredit]);

  const toMintPayingDifference = useMemo(() => {
    return toMintForFree + 1;
  }, [toMintForFree]);

  const remainingETHToPayToMint = useMemo(() => {
    const remainingAmount =
      getUserReadableAmount(availableCredit, 18) - toMintForFree * 0.88;

    const toPay = 0.88 - remainingAmount;

    return toPay;
  }, [availableCredit, toMintForFree]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Duel Pepes | Dopex</title>
      </Head>

      <Box className={styles['background'] ?? ''}>
        <Box className={styles['backgroundOverlay'] ?? ''} />
        <Box className={styles['mobileBackgroundOverlay'] ?? ''} />
        <AppBar />

        <CreateDuel
          open={isCreateDuelDialogOpen}
          handleClose={closeCreateDuelDialog}
        />

        <FindDuel
          open={isFindDuelDialogOpen}
          handleClose={closeFindDuelDialog}
        />

        <RevealDuel
          open={isRevealDuelDialogOpen}
          handleClose={closeRevealDuelDialog}
        />

        <Box className="pt-28 md:pt-32 pb-6lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
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

          <Box className=" mt-6 text-center">
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mt-1 text-center"
            >
              You accumulate ETH credit each time you lose a fight
              <br />
              You can use those ETH to mint new Duel Pepes at the cost of 0,88
              ETH for each
              <br />
              You currently have{' '}
              <span className="text-white">
                {formatAmount(getUserReadableAmount(availableCredit, 18), 4)}{' '}
                ETH credit
              </span>
            </Typography>

            {toMintForFree > 0 ? (
              <Box className=" mt-6 text-center">
                {' '}
                <Typography
                  variant="h5"
                  className="text-white font-['Minecraft'] relative z-1 mt-1 text-center mt-8 cursor-pointer hover:opacity-70"
                >
                  Click here to mint {toMintForFree} pepes using your credit at
                  no additional cost
                </Typography>
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mt-1 text-center"
                >
                  or
                </Typography>
                <Typography
                  variant="h5"
                  className="text-white font-['Minecraft'] relative z-1 mt-1 text-center cursor-pointer hover:opacity-70"
                >
                  Click here to mint {toMintPayingDifference} pepes using your
                  credit and paying with{' '}
                  {formatAmount(remainingETHToPayToMint, 4)} ETH for the
                  remaining part
                </Typography>
              </Box>
            ) : null}
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
                handleReveal={revealDuel}
                handleClaimForfeit={handleClaimForfeit}
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
