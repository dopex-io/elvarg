import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Head from 'next/head';

import Box from '@mui/material/Box';

import Countdown from 'react-countdown';

import { BigNumber, ethers } from 'ethers';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';

import ActionsDialog from 'components/nfts/diamondpepes2/ActionsDialog';
import styles from 'components/nfts/diamondpepes2/styles.module.scss';

import { WalletContext } from 'contexts/Wallet';

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_whitelist',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_mintPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_discountedMintPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DP2',
    outputs: [
      {
        internalType: 'contract IDP2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'adminSetDiscountedMintPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'adminSetEndTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'adminSetMintPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'adminSetStartTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
    ],
    name: 'adminSetTrustedDP2',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
    ],
    name: 'adminSetTrustedDuelPepes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'discountedMintPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'duelpepes',
    outputs: [
      {
        internalType: 'contract IDuelPepes',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'whitelist',
    outputs: [
      {
        internalType: 'contract IDuelPepesWhitelist',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const DiamondPepesNfts = () => {
  const { provider, signer } = useContext(WalletContext);
  const [data, setData] = useState<{
    publicMints: BigNumber;
    nextMintId: BigNumber;
    maxPublicMints: BigNumber;
    mintPrice: BigNumber;
    endTime: BigNumber;
    startTime: BigNumber;
  }>();

  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const boxes = useMemo(
    () =>
      data
        ? [
            {
              title: data?.maxPublicMints.sub(data?.nextMintId)?.toNumber(),
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

  const updateData = useCallback(async () => {
    if (!provider || !signer) return;

    const publicSaleContract = new ethers.Contract(
      '0xeF6d04290cc234d8e6A21e575d271673d408C55B',
      ABI,
      signer
    );

    const [
      publicMints,
      nextMintId,
      maxPublicMints,
      mintPrice,
      endTime,
      startTime,
    ] = await Promise.all([
      publicSaleContract['publicMints'](),
      publicSaleContract['nextMintId'](),
      publicSaleContract['maxPublicMints'](),
      publicSaleContract['mintPrice'](),
      publicSaleContract['endTime'](),
      publicSaleContract['startTime'](),
    ]);

    setData({
      publicMints: publicMints,
      nextMintId: nextMintId,
      maxPublicMints: maxPublicMints,
      mintPrice: mintPrice,
      endTime: endTime,
      startTime: startTime,
    });
  }, [provider, signer]);

  useEffect(() => {
    updateData();
  }, [updateData]);

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
          updateData={updateData}
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
                href={
                  'https://arbiscan.io/address/0xccab2F8772fFA6Cf1b29fc299CBabFE384E7bE81'
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                0xccab2F8772fFA6Cf1b29fc299CBabFE384E7bE81
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
