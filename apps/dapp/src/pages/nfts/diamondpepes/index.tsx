import Head from 'next/head';
import Link from 'next/link';

import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import PepeActionsDialog from 'components/nfts/components/PepeActionsDialog';
import {
  BackgroundBox,
  BackgroundOverlay,
  MobileBackgroundOverlay,
} from 'components/nfts/components/PepeBackground';
import { PepeButton } from 'components/nfts/components/PepeButton';
import PepeLink from 'components/nfts/components/PepeLink';
import PepeText from 'components/nfts/components/PepeText';

const DiamondPepesNfts = () => {
  const {
    updateDuels,
    updatePepesData,
    updateCredit,
    pepesData,
    contractAddresses,
    signer,
  } = useBoundStore();

  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const handleClickOnMintButton = () => {
    setActionsDialogDisplayState({ visible: true, tab: 'mint' });
  };

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
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <PepeActionsDialog
        open={actionsDialogDisplayState.visible}
        tab={actionsDialogDisplayState.tab}
        handleClose={() => {
          setActionsDialogDisplayState({ visible: false, tab: 'mint' });
        }}
      />
      <BackgroundBox>
        <BackgroundOverlay />
        <MobileBackgroundOverlay />
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
          <Box className="flex">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[7rem]">
              <PepeButton
                action={handleClickOnMintButton}
                text={'MINT'}
                className="pl-2 pr-2 p-1.5"
                variant={'h4'}
                disabled={false}
              />
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
                <Link
                  href="https://tofunft.com/collection/duel-pepes/items"
                  target="_blank"
                >
                  <img
                    src={'/assets/export.svg'}
                    className={'w-4 ml-auto'}
                    alt={'Export'}
                  />
                </Link>
                <PepeLink
                  link={'https://tofunft.com/collection/duel-pepes/items'}
                  text={'Tofunft'}
                  className=""
                  variant="caption"
                />
                <Link
                  href="https://twitter.com/dopex_io"
                  target="_blank"
                  className="ml-auto"
                >
                  <img
                    src={'/assets/pepe-tweet.png'}
                    className={'w-6 h-5'}
                    alt={'Pepe tweet'}
                  />
                </Link>
                <PepeLink
                  link={'https://twitter.com/dopex_io'}
                  text={'DOPEX'}
                  className="mr-auto"
                  variant={'caption'}
                />
                <Link href="https://twitter.com/chutoro_au" target="_blank">
                  {' '}
                  <img
                    src={'/assets/pepe-tweet.png'}
                    className={'w-6 h-5 ml-auto'}
                    alt={'Pepe tweet'}
                  />
                </Link>
                <PepeLink
                  link={'https://twitter.com/chutoro_au'}
                  text={'CEO'}
                  className="mr-auto"
                  variant={'caption'}
                />
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
                <Link
                  href="https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough"
                  target="_blank"
                  className="ml-auto"
                >
                  {' '}
                  <img
                    src={'/assets/export.svg'}
                    className={'w-5 ml-auto'}
                    alt={'Export'}
                  />
                </Link>
                <PepeLink
                  link={
                    'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
                  }
                  text={'How to play'}
                  className="mr-auto"
                  variant={'caption'}
                />
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
                href={
                  'https://arbiscan.io/address/' +
                  contractAddresses['DuelDiamondPepesNFTsMint']
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                {contractAddresses['DuelDiamondPepesNFTsMint']!}
              </a>
            </Typography>
          </Box>
        </Box>
      </BackgroundBox>
    </Box>
  );
};

export default DiamondPepesNfts;
