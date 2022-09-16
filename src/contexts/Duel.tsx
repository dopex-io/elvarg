import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { ethers, BigNumber } from 'ethers';
import {
  Addresses,
  DiamondPepeNFTs__factory,
  ERC20__factory,
} from '@dopex-io/sdk';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import addHoursToDate from 'utils/date/addHoursToDate';

import { WalletContext } from './Wallet';
import { AssetsContext } from './Assets';

export interface Duel {
  id: number;
  identifier: number;
  duelistAddress: string;
  challengerAddress: string;
  wager: number;
  tokenName: string;
  tokenAddress: string;
  fees: number;
  duelist: number;
  challenger: number;
  isCreatorWinner: boolean;
  creationDate: Date;
  challengedLimitDate: Date;
  challengedDate: Date;
  finishDate: Date;
  isRevealed: boolean;
  duelistMoves: string[];
  challengerMoves: string[];
  status: string;
  wagerValueInUSD: string | number;
}

export interface UserNft {
  collectionAddress: string;
  id: number;
  src: string;
}

interface DuelContextInterface {
  nfts: UserNft[];
  duels: Duel[];
  activeDuels: Duel[];
  updateDuels?: Function;
  updateUserNfts?: Function;
  isLoading: boolean;
  duelContract?: any;
  selectedDuel: Duel | null;
  setSelectedDuel?: Function;
  availableCredit: BigNumber;
  updateCredit?: Function;
}

const initialData: DuelContextInterface = {
  nfts: [],
  duels: [],
  activeDuels: [],
  isLoading: true,
  selectedDuel: null,
  availableCredit: BigNumber.from('0'),
};

const DuelPepesABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_logic',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_leaderboard',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_whitelist',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_feeCollector',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dp2',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_weth',
        type: 'address',
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
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
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
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
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
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
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
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'adminExecute',
    outputs: [],
    stateMutability: 'payable',
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
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'adminWithdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256[5]',
        name: 'moves',
        type: 'uint256[5]',
      },
    ],
    name: 'challenge',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'challengeTimelimit',
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
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'claimForfeit',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'wager',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'movesSig',
        type: 'bytes',
      },
    ],
    name: 'createDuel',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dp2',
    outputs: [
      {
        internalType: 'contract IDP2Mint',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'duelCount',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'duelIdentifiers',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'duels',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'wager',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'fees',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'initialMovesSignature',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'isCreatorWinner',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeCollector',
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
    name: 'fees',
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
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getDuel',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'identifier',
            type: 'bytes32',
          },
          {
            internalType: 'address[2]',
            name: 'duellors',
            type: 'address[2]',
          },
          {
            internalType: 'uint256',
            name: 'wager',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'initialMovesSignature',
            type: 'bytes',
          },
          {
            internalType: 'uint256[5][2]',
            name: 'moves',
            type: 'uint256[5][2]',
          },
          {
            internalType: 'bool',
            name: 'isCreatorWinner',
            type: 'bool',
          },
          {
            internalType: 'uint256[3]',
            name: 'timestamps',
            type: 'uint256[3]',
          },
        ],
        internalType: 'struct DuelPepes.Duel',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getDuelTimestamps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    name: 'leaderboard',
    outputs: [
      {
        internalType: 'contract IDuelPepesLeaderboard',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'logic',
    outputs: [
      {
        internalType: 'contract IDuelPepesLogic',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintMixed',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'moveAttributes',
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
    name: 'percentagePrecision',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256[5]',
        name: 'moves',
        type: 'uint256[5]',
      },
    ],
    name: 'revealDuel',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealTimeLimit',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'undoDuel',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userDuels',
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
        internalType: 'uint256[5]',
        name: 'moves',
        type: 'uint256[5]',
      },
    ],
    name: 'validateMoves',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weth',
    outputs: [
      {
        internalType: 'contract IWETH9',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
];
const DuelPepesLeaderboardABI = [
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
    inputs: [
      { internalType: 'address', name: 'duellor', type: 'address' },
      { internalType: 'uint256', name: 'expense', type: 'uint256' },
    ],
    name: 'charge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'charges',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'duellor', type: 'address' }],
    name: 'getCreditForMinting',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainContract',
    outputs: [
      { internalType: 'contract IDuelPepes', name: '', type: 'address' },
    ],
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
      { internalType: 'uint256', name: 'lostToTreasury', type: 'uint256' },
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newAddress', type: 'address' }],
    name: 'setMainContract',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'bool', name: 'isDraw', type: 'bool' },
      { internalType: 'uint256', name: 'creatorDamage', type: 'uint256' },
      { internalType: 'uint256', name: 'challengerDamage', type: 'uint256' },
    ],
    name: 'updateUserLeaderboard',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { internalType: 'uint256', name: 'lostToTreasury', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const DuelContext = createContext<DuelContextInterface>(initialData);

export const DuelProvider = (props: { children: ReactNode }) => {
  const { accountAddress, /*contractAddresses, */ provider, signer, chainId } =
    useContext(WalletContext);

  const { tokenPrices } = useContext(AssetsContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const duelContract = useMemo(() => {
    if (!signer) return;
    return new ethers.Contract(
      '0x51B483e1AaEcE04a7ef925a17bA77de678571dad',
      DuelPepesABI,
      signer
    );
  }, [signer]);

  const diamondPepeNfts = useMemo(() => {
    if (!signer) return;
    return DiamondPepeNFTs__factory.connect(
      '0xede855ceD3e5A59Aaa267aBdDdB0dB21CCFE5072',
      signer
    );
  }, [/*contractAddresses, */ signer]);

  const duelLeaderboardContract = useMemo(() => {
    if (!signer) return;
    return new ethers.Contract(
      '0x94Cbc2CB052Cbe2Bb7B93dd074D5218327384737',
      DuelPepesLeaderboardABI,
      signer
    );
  }, [signer]);

  const [nfts, setNfts] = useState<UserNft[]>([]);
  const [duels, setDuels] = useState<Duel[]>([]);
  const [activeDuels, setActiveDuels] = useState<Duel[]>([]);
  const [selectedDuel, setSelectedDuel] = useState<null | Duel>(null);
  const [availableCredit, setAvailableCredit] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const getDuelData = useCallback(
    async (i: number) => {
      if (!duelContract) return;

      const duelData = await duelContract['getDuel'](i);

      const finishDate = new Date(duelData[7][1].toNumber() * 1000);

      const maxRevealDate = addHoursToDate(finishDate, 12);
      const revealDate = new Date(duelData[7][2].toNumber() * 1000);

      let challengerAddress = duelData[1][1];
      if (challengerAddress.includes('0x00000000000000000000'))
        challengerAddress = '?';

      const rawMoves = duelData[5];
      let duelistMoves: string[] = [];
      let challengerMoves: string[] = [];

      const isRevealed = finishDate < new Date() && challengerAddress !== '?';

      if (isRevealed) {
        for (let j in rawMoves[0]) {
          if (rawMoves[0][j].eq(BigNumber.from('1'))) duelistMoves.push('kick');
          else if (rawMoves[0][j].eq(BigNumber.from('0')))
            duelistMoves.push('punch');
          else if (rawMoves[0][j].eq(BigNumber.from('3')))
            duelistMoves.push('special');
          else duelistMoves.push('block');
        }

        for (let j in rawMoves[1]) {
          if (rawMoves[1][j].eq(BigNumber.from('1')))
            challengerMoves.push('kick');
          else if (rawMoves[1][j].eq(BigNumber.from('0')))
            challengerMoves.push('punch');
          else if (rawMoves[1][j].eq(BigNumber.from('3')))
            challengerMoves.push('special');
          else challengerMoves.push('block');
        }
      }

      if (duelistMoves.every((item) => item === 'punch')) {
        challengerMoves = [];
        duelistMoves = [];
      }

      const token = ERC20__factory.connect(
        Addresses[chainId]['WETH'],
        provider
      );

      const symbol = await token.symbol();
      const decimals = getTokenDecimals(symbol, chainId);

      const creationDate = new Date(duelData[7][0].toNumber() * 1000);

      const challengedLimitDate = addHoursToDate(creationDate, 12);

      let status = 'waiting';

      const duelistAddress = duelData[1][0];

      const isCreatorWinner = duelData[6];

      if (finishDate.getTime() > 1000) {
        if (
          revealDate.getTime() < new Date().getTime() &&
          revealDate.getTime() > 1000
        ) {
          if (duelData[3].eq(0)) status = 'tie';
          else if (
            isCreatorWinner === true &&
            duelistAddress === accountAddress
          )
            status = 'won';
          else if (
            isCreatorWinner === false &&
            challengerAddress === accountAddress
          )
            status = 'won';
          else status = 'lost';
        } else {
          if (maxRevealDate.getTime() < new Date().getTime()) {
            status = 'forfeit';
          } else {
            status = 'requireReveal';
          }
        }
        if (
          revealDate.getTime() === 0 &&
          maxRevealDate.getTime() < new Date().getTime() &&
          revealDate.getTime()
        ) {
          if (duelistAddress !== accountAddress) status = 'requireClaimForfeit';
          else status = 'waitClaimForfeit';
        }
      } else {
        if (new Date() > challengedLimitDate && challengerAddress === '?')
          status = 'requireUndo';
      }

      const wager = getUserReadableAmount(duelData[2], decimals);

      let wagerValueInUSD = 0;

      tokenPrices.map((tokenPrice) => {
        if (tokenPrice['name'] === symbol) {
          wagerValueInUSD = wager * tokenPrice['price'];
        }
      });

      const minimum = 1100;
      const maximum = 1300;

      const duel: Duel = {
        id: i,
        identifier: duelData[0],
        duelistAddress: duelistAddress,
        challengerAddress: challengerAddress,
        wager: wager,
        tokenName: symbol,
        tokenAddress: Addresses[chainId]['WETH'],
        fees: duelData[3],
        duelist: Math.floor(Math.random() * (maximum - minimum + 1)) + minimum,
        challenger:
          Math.floor(Math.random() * (maximum - minimum + 1)) + minimum,
        isCreatorWinner: isCreatorWinner,
        creationDate: creationDate,
        challengedLimitDate: challengedLimitDate,
        challengedDate: new Date(duelData[7][1].toNumber() * 1000),
        finishDate: finishDate,
        isRevealed: isRevealed,
        duelistMoves: duelistMoves,
        challengerMoves: challengerMoves,
        status: status,
        wagerValueInUSD: wagerValueInUSD,
      };

      return duel;
    },
    [duelContract, chainId, provider, tokenPrices, accountAddress]
  );

  const updateDuels = useCallback(async () => {
    if (!signer || !accountAddress || !provider || !duelContract) return;

    setIsLoading(true);

    const duelCount = await duelContract['duelCount']();
    const _duels: Duel[] = [];
    const _activeDuels: Duel[] = [];
    const _promises = [];

    for (let i = 1; i <= duelCount; i++) {
      _promises.push(getDuelData(i));
    }

    const results: (Duel | undefined)[] = await Promise.all(_promises)
      .then((duels) => duels)
      .catch((e) => {
        console.log(e);
        return [];
      });

    console.log(results);

    results.map((_duel) => {
      if (!_duel) return;

      if (
        _duel['challengerAddress'] === accountAddress ||
        _duel['duelistAddress'] === accountAddress
      )
        _activeDuels.push(_duel);
      else _duels.push(_duel);
    });

    _duels.reverse();
    _activeDuels.reverse();
    setDuels(_duels);
    setActiveDuels(_activeDuels);
    setIsLoading(false);
  }, [
    provider,
    signer,
    duelContract,
    /*chainId, contractAddresses, */ accountAddress,
    getDuelData,
  ]);

  const updateNfts = useCallback(async () => {
    if (!signer || !accountAddress || !diamondPepeNfts || !provider) return;

    setIsLoading(true);

    let _nfts: UserNft[] = [];

    let i = 0;
    while (true) {
      try {
        const nftId = await diamondPepeNfts
          .connect(signer)
          .tokenOfOwnerByIndex(accountAddress, i);
        _nfts.push({
          id: nftId.toNumber(),
          src: `https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/${nftId}/1440/image.jpg`,
          collectionAddress: diamondPepeNfts.address,
        });
        i++;
      } catch (e) {
        break;
      }
    }

    setNfts(_nfts);
    setIsLoading(false);
  }, [
    accountAddress,
    /* contractAddresses, */ signer,
    provider,
    diamondPepeNfts,
  ]);

  const updateCredit = useCallback(async () => {
    if (!accountAddress || !duelLeaderboardContract || !provider) return;

    const credit = await duelLeaderboardContract['getCreditForMinting'](
      accountAddress
    );

    setAvailableCredit(credit);
  }, [accountAddress, provider, duelLeaderboardContract]);

  useEffect(() => {
    updateCredit();
  }, [updateCredit]);

  useEffect(() => {
    updateDuels();
  }, [updateDuels]);

  useEffect(() => {
    updateNfts();
  }, [updateNfts]);

  let contextValue = {
    duels,
    activeDuels,
    nfts,
    updateDuels,
    updateNfts,
    isLoading,
    duelContract,
    selectedDuel,
    setSelectedDuel,
    availableCredit,
    updateCredit,
  };

  return (
    <DuelContext.Provider value={contextValue}>
      {props.children}
    </DuelContext.Provider>
  );
};
