import { useState, useMemo, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Box from '@mui/material/Box';

import Countdown from 'react-countdown';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';

import ActionsDialog from 'components/nfts/diamondpepes2/ActionsDialog';
import styles from 'components/nfts/diamondpepes2/styles.module.scss';

import { DuelContext } from 'contexts/Duel';

const DiamondPepesNfts = () => {
  const { data, updateData } = useContext(DuelContext);

  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const boxes = useMemo(
    () =>
      data
        ? [
            {
              title:
                data?.maxPublicMints.sub(data?.nextMintId)?.toNumber() - 889,
              subTitle: 'PEPES REMAINING',
            },
            { title: '5:55PM 5/12/2022', subTitle: 'START' },
            {
              title: (
                <Countdown
                  date={new Date(data?.endTime?.toNumber() * 1000)}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return (
                        <span className="text-wave-blue">
                          The sale has been closed
                        </span>
                      );
                    } else {
                      return (
                        <span className="text-wave-blue">
                          {days}d {hours}h {minutes}m {seconds}s
                        </span>
                      );
                    }
                  }}
                />
              ),
              subTitle: 'TIME REMAINING',
            },
          ]
        : [],
    [data]
  );

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      {data ? (
        <ActionsDialog
          open={actionsDialogDisplayState.visible}
          tab={actionsDialogDisplayState.tab}
          handleClose={() => {
            setActionsDialogDisplayState({ visible: false, tab: 'mint' });
          }}
          data={data}
          updateData={updateData!}
        />
      ) : null}
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
              <Box key={index} className="md:w-1/3 p-4 text-center">
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
          <Box className="flex mt-9">
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
              onClick={() =>
                window.location.replace(
                  'https://app.dopex.io/nfts/diamondpepes2'
                )
              }
            >
              <span className={styles['pepeLink']}>Main page</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'How to mint'}
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint'
                )
              }
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint'
                )
              }
            >
              <span className={styles['pepeLink']}>How to mint</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'UI Walkthrough'}
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
                )
              }
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
                )
              }
            >
              <span className={styles['pepeLink']}>UI Walkthrough</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'Claim Lootbox'}
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox'
                )
              }
            />
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1 mr-2 ml-4 mt-1 cursor-pointer"
              onClick={() =>
                window.location.replace(
                  'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox'
                )
              }
            >
              <span className={styles['pepeLink']}>How to claim lootbox</span>
            </Typography>

            <img
              src={'/assets/export.svg'}
              className={'w-5 h-5 ml-8 mt-1'}
              alt={'Pepe tweet'}
              onClick={() =>
                window.location.replace('https://twitter.com/chutoro_au')
              }
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
            <Box className="ml-auto mr-1 mb-5 mt-5 lg:w-[7rem]">
              <button
                className={styles['pepeButton']!}
                onClick={() =>
                  setActionsDialogDisplayState({ visible: true, tab: 'mint' })
                }
              >
                MINT
              </button>
            </Box>

            <Box className="ml-3 mr-auto mb-5 mt-5 lg:w-[12rem]">
              <Link href="/nfts/duel">
                <button className={styles['pepeButton']!}>DUEL TO MINT</button>
              </Link>
            </Box>
          </Box>
          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/joypad-pepe.png'}
                className="w-40 ml-auto mr-auto"
                alt={'Joypad'}
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
                {
                  'To learn how to mint, read through the "How to mint" and "UI Walkthrough" Explainers'
                }
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src={'/assets/export.svg'}
                  className={'w-5 ml-auto cursor-pointer'}
                  alt={'Export'}
                  onClick={() =>
                    window.location.replace(
                      'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint'
                    )
                  }
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2 cursor-pointer"
                  onClick={() =>
                    window.location.replace(
                      'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-how-to-mint'
                    )
                  }
                >
                  <span className={styles['pepeLink']!}>How to Mint</span>
                </Typography>

                <img
                  src="/assets/pepe-tweet.png"
                  className="w-6 h-5 ml-auto cursor-pointer"
                  alt="Pepe tweet"
                  onClick={() =>
                    window.location.replace(
                      'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
                    )
                  }
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2 cursor-pointer"
                  onClick={() =>
                    window.location.replace(
                      'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-mint-ui-walkthrough'
                    )
                  }
                >
                  <span className={styles['pepeLink']!}>UI Walkthrough</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/hand-pepe.png'}
                className="w-36 ml-auto mr-auto mt-9 mb-14"
                alt={'Pepe'}
              />
              <img
                src={'/assets/lootbox-button.png'}
                className="w-56 z-50 mt-12 ml-auto mr-auto cursor-pointer"
                alt={'Duel Pepe'}
                onClick={() =>
                  window.location.replace(
                    'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox'
                  )
                }
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
                onClick={() =>
                  window.location.replace(
                    'https://blog.dopex.io/articles/diamond-pepe/gen-2-mint-claiming-your-lootbox'
                  )
                }
              >
                There will be 333 lootboxes up for grabs for our quickest
                minters.
                <br />
                <br />
                Read here to learn how to claim!
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src="/assets/export.svg"
                  className="w-5 ml-auto cursor-pointer"
                  alt="Export"
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2 cursor-pointer"
                >
                  <span className={styles['pepeLink']!}>How to claim</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
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
                Please follow the Diamond Pepes Twitter or Dopex’s official
                Twitter account for more information.
              </Typography>

              <Box className={'flex mt-6'}>
                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto cursor-pointer'}
                  alt={'Pepe tweet'}
                  onClick={() =>
                    window.location.replace('https://twitter.com/dopex_io')
                  }
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2 cursor-pointer"
                  onClick={() =>
                    window.location.replace('https://twitter.com/dopex_io')
                  }
                >
                  <span className={styles['pepeLink']!}>DOPEX</span>
                </Typography>

                <img
                  src="/assets/pepe-tweet.png"
                  className="w-6 h-5 ml-auto cursor-pointer"
                  alt="Pepe tweet"
                  onClick={() =>
                    window.location.replace('https://twitter.com/diamondpepes')
                  }
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2 cursor-pointer"
                  onClick={() =>
                    window.location.replace('https://twitter.com/diamondpepes')
                  }
                >
                  <span className={styles['pepeLink']!}>DIAMOND PEPES</span>
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
                href={
                  'https://arbiscan.io/address/0x1acf58D681883ee4beC36921bE9Aa3a4a09B95bd'
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                0x1acf58D681883ee4beC36921bE9Aa3a4a09B95bd
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
