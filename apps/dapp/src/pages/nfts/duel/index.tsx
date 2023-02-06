import Head from 'next/head';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import {
  BackgroundBox,
  MobileBackgroundOverlay,
  BackgroundOverlay,
} from 'components/nfts/components/PepeBackground';
import PepeLink from 'components/nfts/components/PepeLink';
import PepeText from 'components/nfts/components/PepeText';
import { PepeButton } from 'components/nfts/components/PepeButton';
import ActiveDuel from 'components/nfts/duel/ActiveDuel';
import Duels from 'components/nfts/duel/Duels';
import CreateDuel from 'components/nfts/duel/Dialogs/CreateDuel';
import FindDuel from 'components/nfts/duel/Dialogs/FindDuel';
import RevealDuel from 'components/nfts/duel/Dialogs/RevealDuel';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { useBoundStore } from 'store';
import { Duel } from 'store/Duel';

const DuelPepes = () => {
  const {
    isLoading,
    activeDuels,
    updateDuels,
    updatePepesData,
    duelContract,
    setSelectedDuel,
    availableCredit,
    updateCredit,
    pepesData,
  } = useBoundStore();
  const { signer } = useBoundStore();
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
    return Math.floor(getUserReadableAmount(availableCredit, 18) / 0.8);
  }, [availableCredit]);

  const remainingETHToPayToMint = useMemo(() => {
    const credit = getUserReadableAmount(availableCredit, 18);

    return 0.88 - credit;
  }, [availableCredit]);

  const mintForFree = useCallback(async () => {
    if (!duelContract || !signer || !updateCredit) return;

    await duelContract['mint']();
    await updateCredit();
  }, [duelContract, signer, updateCredit]);

  const mintMixed = useCallback(async () => {
    if (!duelContract || !signer || !updateCredit) return;

    const missing = BigNumber.from('880000000000000000').sub(availableCredit);

    await duelContract['mintMixed']({ value: missing });
    await updateCredit();
  }, [duelContract, signer, updateCredit, availableCredit]);

  const boxes = useMemo(
    () =>
      pepesData
        ? [
            {
              title: Math.max(
                BigNumber.from(1111).sub(pepesData?.nextMintId)?.toNumber(),
                0
              ),
              subTitle: 'PEPES REMAINING',
            },
            { title: '6:00pm UTC 09/27/2022', subTitle: 'START' },
            {
              title: 'The sale has been opened',
              subTitle: 'GOOD LUCK SER',
            },
          ]
        : [],
    [pepesData]
  );

  useEffect(() => {
    if (updateCredit && signer) updateCredit();
  }, [updateCredit, signer]);

  useEffect(() => {
    if (updateDuels && signer) updateDuels();
  }, [updateDuels, signer]);

  useEffect(() => {
    if (updatePepesData && signer) updatePepesData();
  }, [updatePepesData, signer]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Duel Pepes | Dopex</title>
      </Head>

      <BackgroundBox>
        <BackgroundOverlay />
        <MobileBackgroundOverlay />
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
              a player can create duels by submitting a token, wager amount and
              signature of their initial selected moves.
            </Typography>
          </Box>

          <Box className="p-2 mt-7 md:flex">
            {boxes.map((box, index) => (
              <Box key={index} className="md:w-1/3 p-4 text-center">
                <PepeText
                  text={String(box.title)}
                  variant="h3"
                  className="text-white font-display font-['Minecraft'] relative z-1"
                />
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

          <Box className={'flex mt-6'}>
            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-auto mt-1'}
              alt={'How to mint'}
              onClick={() =>
                window.open(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint',
                  '_blank'
                )
              }
            />

            <PepeLink
              link={
                'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint'
              }
              text={'How to mint'}
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              variant={'h5'}
            />

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'UI Walkthrough'}
              onClick={() =>
                window.open(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough',
                  '_blank'
                )
              }
            />

            <PepeLink
              link={
                'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
              }
              text={'UI Walkthrough'}
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              variant={'h5'}
            />

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'Claim Lootbox'}
              onClick={() =>
                window.open(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox',
                  '_blank'
                )
              }
            />
            <PepeLink
              link={
                'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox'
              }
              text={'How to claim lootbox'}
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              variant={'h5'}
            />

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'Pepe tweet'}
              onClick={() =>
                window.open('https://twitter.com/chutoro_au', '_blank')
              }
            />

            <PepeLink
              link={'https://twitter.com/chutoro_au'}
              text={'CEO'}
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-4 mt-1 cursor-pointer"
              variant={'h5'}
            />
          </Box>

          <Box className=" mt-6 text-center">
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mt-1 text-center"
            >
              {
                "During the Duel Mint, the winner will only receive 20% of the loser's wager with the remaining 80% going to the Treasury."
              }
            </Typography>{' '}
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mt-1 text-center"
            >
              Losers will receive{' '}
              <span className="text-white">Mint Credits</span> 1:1 for ETH that
              goes to the treasury.
              <br />
              <span className="text-white">Mint Credits</span> can be used to
              mint Duel Pepes at a discounted cost of 0.8 Mint Credits each.
              <br />
              <span className="text-white">Mint Credits</span> can be also be
              used to offset 1:1 the standard mint cost of 0.88 ETH.
              <br />
              <br />
              You currently have{' '}
              <span className="text-white">
                {formatAmount(getUserReadableAmount(availableCredit, 18), 4)}{' '}
                Mint Credits
              </span>
            </Typography>
            <Box className=" mt-6 text-center">
              {' '}
              {toMintForFree > 0 ? (
                <Typography
                  variant="h5"
                  className="text-white font-['Minecraft'] relative z-1 mt-1 text-center mt-8 cursor-pointer hover:opacity-70"
                  onClick={mintForFree}
                >
                  Click here to mint {toMintForFree} pepes using your credit at
                  no additional cost
                </Typography>
              ) : null}
              {toMintForFree === 0 &&
              remainingETHToPayToMint > 0 &&
              availableCredit.gt(0) ? (
                <Typography
                  variant="h5"
                  className="text-white font-['Minecraft'] relative z-1 mt-1 text-center cursor-pointer hover:opacity-70"
                  onClick={mintMixed}
                >
                  Click here to mint 1 pepe using your credit and paying with{' '}
                  {formatAmount(remainingETHToPayToMint, 4)} ETH for the
                  remaining part
                </Typography>
              ) : null}
            </Box>
          </Box>

          <Box className="flex mt-6">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[14rem]">
              <PepeButton
                action={() => setIsCreateDuelDialogOpen(true)}
                text={'CREATE DUEL'}
                className="pl-2 pr-2 p-1.5"
                variant={'h4'}
                disabled={false}
              />
            </Box>
          </Box>

          <img
            src={'/assets/pepe-line.png'}
            className="ml-auto mr-auto mt-8 mb-12"
            alt={''}
          />

          <Box className="flex mb-14">
            <PepeText
              text={'YOUR ACTIVE AND RECENT DUELS'}
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-auto mt-1 cursor-pointer"
              variant={'h3'}
            />
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
          <PepeText
            text={'ALL DUELS'}
            className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 text-center"
            variant={'h3'}
          />
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
      </BackgroundBox>
    </Box>
  );
};

export default DuelPepes;
