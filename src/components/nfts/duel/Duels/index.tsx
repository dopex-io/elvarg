import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import cx from 'classnames';

import styles from '../styles.module.scss';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { WalletContext } from 'contexts/Wallet';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

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

const Duels = () => {
  const { signer, accountAddress } = useContext(WalletContext);
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
    <Box className={'bg-[#181C24] w-full p-4 pt-2 pb-4.5 pb-0 rounded-sm'}>
      <Box className="balances-table text-white">
        <TableContainer className={cx(styles['optionsTable'], 'bg-[#181C24]')}>
          {isLoading ? (
            <Box>
              <Box className={cx('rounded-lg text-center mt-1')}>
                <CircularProgress size={25} className={'mt-10'} />
                <Typography
                  variant="h6"
                  className="text-white mb-10 mt-2 font-['Minecraft']"
                >
                  Retrieving duels...
                </Typography>
              </Box>
            </Box>
          ) : duels.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Duelist</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Opponent</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Expiry In</span>
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Duel ID</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Wager</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Head</span>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {/* @ts-ignore TODO: FIX */}
                {duels.map((duel, i) => (
                  <TableRow key={i} className="text-white mb-2 rounded-lg mt-2">
                    <TableCell align="left" className="mx-0 pt-2">
                      <Box className="flex">
                        <img
                          src={`https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/633/280/static.jpg`}
                          className="rounded-md w-12 h-12 mt-1 mr-1"
                        />
                        <Box>
                          <Typography
                            variant="h5"
                            className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
                          >
                            <span>#677</span>
                          </Typography>
                          <Typography
                            variant="h5"
                            className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
                          >
                            <span>Diamond Pepe</span>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        0X013A
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        11H 11M 11S
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        #234
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        1234.4 USDC
                      </Typography>
                      <Typography variant="h6" className="font-['Minecraft']">
                        <span className="text-stieglitz">~$1341.23</span>
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      {/* @ts-ignore TODO: FIX */}
                      <CustomButton
                        size="medium"
                        className={styles['smallPepeButton']}
                      >
                        {/* @ts-ignore TODO: FIX */}
                        <Typography
                          variant="h5"
                          className={styles['pepeButtonText']}
                        >
                          DUEL
                        </Typography>
                      </CustomButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </TableContainer>
        {duels.length == 0 && !isLoading ? (
          <Box className="text-stieglitz text-center pt-8 pb-9">
            <Typography variant="h6" className="text-white font-['Minecraft']">
              No active duels to show
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Duels;
