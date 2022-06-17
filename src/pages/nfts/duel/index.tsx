import Head from 'next/head';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { WalletContext } from 'contexts/Wallet';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import ActiveDuel from 'components/nfts/duel/ActiveDuel';
import Duels from 'components/nfts/duel/Duels';
import CreateDuel from 'components/nfts/duel/Dialogs/CreateDuel';

import styles from 'components/nfts/duel/styles.module.scss';

const ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_feeCollector', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'collection',
        type: 'address',
      },
    ],
    name: 'LogAddToWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: true,
        internalType: 'address',
        name: 'challenger',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'LogChallengedDuel',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'challenger',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isCreatorWinner',
        type: 'bool',
      },
    ],
    name: 'LogDecidedDuel',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'LogNewDuel',
    type: 'event',
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
    inputs: [{ internalType: 'address', name: '_collection', type: 'address' }],
    name: 'addToWhitelist',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address', name: 'collection', type: 'address' },
      { internalType: 'uint256', name: 'nftId', type: 'uint256' },
      { internalType: 'uint256[5]', name: 'moves', type: 'uint256[5]' },
    ],
    name: 'challenge',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'challengeTimelimit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'claimForfeit',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'identifier', type: 'bytes32' },
      { internalType: 'uint256', name: 'wager', type: 'uint256' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'collection', type: 'address' },
      { internalType: 'uint256', name: 'nftId', type: 'uint256' },
      { internalType: 'bytes', name: 'movesSig', type: 'bytes' },
    ],
    name: 'createDuel',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'decideDuel',
    outputs: [
      { internalType: 'uint256', name: 'creatorDamage', type: 'uint256' },
      { internalType: 'uint256', name: 'challengerDamage', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'duelCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'duelIdentifiers',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'duels',
    outputs: [
      { internalType: 'bytes32', name: 'identifier', type: 'bytes32' },
      { internalType: 'uint256', name: 'wager', type: 'uint256' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'fees', type: 'uint256' },
      { internalType: 'bytes', name: 'initialMovesSignature', type: 'bytes' },
      { internalType: 'bool', name: 'isCreatorWinner', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeCollector',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fees',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'moveAttributes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'nftLeaderboard',
    outputs: [
      { internalType: 'uint256', name: 'wins', type: 'uint256' },
      { internalType: 'uint256', name: 'losses', type: 'uint256' },
      { internalType: 'uint256', name: 'draws', type: 'uint256' },
      { internalType: 'uint256', name: 'winnings', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'percentagePrecision',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256[5]', name: 'moves', type: 'uint256[5]' },
    ],
    name: 'revealDuel',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealTimeLimit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'undoDuel',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'userDuels',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userLeaderboard',
    outputs: [
      { internalType: 'uint256', name: 'wins', type: 'uint256' },
      { internalType: 'uint256', name: 'losses', type: 'uint256' },
      { internalType: 'uint256', name: 'draws', type: 'uint256' },
      { internalType: 'uint256', name: 'winnings', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[5]', name: 'moves', type: 'uint256[5]' }],
    name: 'validateMoves',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'data', type: 'bytes32' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'verify',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelistedCollections',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const DuelPepes = () => {
  const { signer, accountAddress } = useContext(WalletContext);
  const [activeFilter, setActiveFilter] = useState<string>('open');
  const [isCreateDuelDialogOpen, setIsCreateDuelDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duels, setDuels] = useState<{ [key: string]: any }[]>([]);

  const duel = useMemo(
    () =>
      new ethers.Contract(
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        ABI,
        signer
      ),
    [signer]
  );

  const getDuels = useCallback(async () => {
    if (!signer || !accountAddress || !duel) return;

    setIsLoading(true);

    const duelCount = await duel['duelCount']();
    const _duels: { [key: string]: any }[] = [];

    for (let i = 0; i < duelCount; i++) {
      const duelData = await duel['duels'](i);

      const finishDate = duelData[10][2];

      const rawMoves = duelData[8];
      const moves: string[] = [];

      for (let j in rawMoves) {
        if (rawMoves[j] === 1) moves.push('kick');
        else if (rawMoves[j] === 0) moves.push('punch');
        else if (rawMoves[j] === 3) moves.push('special');
        else moves.push('block');
      }

      _duels.push({
        id: i,
        identifier: duelData[0],
        duelistAddress: duelData[1][0],
        challengerAddress: duelData[1][1],
        wager: duelData[2],
        tokenAddress: duelData[3],
        fees: duelData[4],
        duelist: duelData[6][0],
        challenger: duelData[6][1],
        isCreatorWinner: duelData[9],
        creationDate: duelData[10][0],
        challengedDate: duelData[10][1],
        finishDate: finishDate,
        isRevealed: finishDate < new Date(),
        moves: moves,
      });
    }

    setDuels(_duels);
    setIsLoading(false);
  }, [duel, accountAddress, signer]);

  useEffect(() => {
    getDuels();
  }, [getDuels]);

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
          handleClose={() => {
            setIsCreateDuelDialogOpen(false);
          }}
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

          {duels.map((duel) => (
            <Box className="mb-16">
              <ActiveDuel
                opponentAddress={duel['challengerAddress']}
                duelist={duel['duelist']}
                opponent={duel['challenger']}
                duelId={duel['id']}
                moves={['punch', 'kick', 'special', 'block']}
                wager={duel['wager']}
                isCreatorWinner={duel['isCreatorWinner']}
                isRevealed={duel['isRevealed']}
              />
            </Box>
          ))}

          {duels.length == 0 ? (
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

        <Box className={'flex mt-4 z-50 relative'}>
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
        </Box>

        <Box className="pt-2 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0 mt-3">
          <Duels />
        </Box>
      </Box>
    </Box>
  );
};

export default DuelPepes;
