import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { ethers } from 'ethers';
import { DiamondPepeNFTs__factory, ERC20__factory } from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';
import getUserReadableAmount from '../utils/contracts/getUserReadableAmount';
import getTokenDecimals from '../utils/general/getTokenDecimals';

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
  challengedDate: Date;
  finishDate: Date;
  isRevealed: boolean;
  duelistMoves: string[];
  challengerMoves: string[];
}

export interface UserNft {
  collectionAddress: string;
  id: number;
  src: string;
}

interface DuelContextInterface {
  nfts: UserNft[];
  duels: Duel[];
  updateDuels?: Function;
  updateUserNfts?: Function;
  isLoading: boolean;
  duelContract?: any;
}

const initialData: DuelContextInterface = {
  nfts: [],
  duels: [],
  isLoading: true,
};

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_feeCollector',
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
    inputs: [
      {
        internalType: 'address',
        name: '_collection',
        type: 'address',
      },
    ],
    name: 'addToWhitelist',
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
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'collection',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
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
    stateMutability: 'nonpayable',
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
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'collection',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
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
    name: 'decideDuel',
    outputs: [
      {
        internalType: 'uint256',
        name: 'creatorDamage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'challengerDamage',
        type: 'uint256',
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
        internalType: 'address',
        name: 'token',
        type: 'address',
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
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
          {
            internalType: 'address[2]',
            name: 'collections',
            type: 'address[2]',
          },
          {
            internalType: 'uint256[2]',
            name: 'ids',
            type: 'uint256[2]',
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
    name: 'nftLeaderboard',
    outputs: [
      {
        internalType: 'uint256',
        name: 'wins',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'losses',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'draws',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'winnings',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userLeaderboard',
    outputs: [
      {
        internalType: 'uint256',
        name: 'wins',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'losses',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'draws',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'winnings',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: 'data',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'whitelistedCollections',
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
];

export const DuelContext = createContext<DuelContextInterface>(initialData);

export const DuelProvider = (props: { children: ReactNode }) => {
  const { accountAddress, contractAddresses, provider, signer, chainId } =
    useContext(WalletContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const duelContract = useMemo(
    () =>
      new ethers.Contract(
        '0x37c163aF0812Eb0E3f88c61987F82A92f2a0f3E4',
        ABI,
        signer
      ),
    [signer]
  );
  const diamondPepeNfts = useMemo(() => {
    if (!signer) return;
    return DiamondPepeNFTs__factory.connect(
      '0xc05ccE32B474ed1EAFE35AAbFdaD07cF024353B5',
      signer
    );
  }, [contractAddresses, signer]);

  const [nfts, setNfts] = useState<UserNft[]>([]);
  const [duels, setDuels] = useState<Duel[]>([]);

  const updateDuels = useCallback(async () => {
    if (!signer || !accountAddress) return;

    setIsLoading(true);

    const duelCount = await duelContract['duelCount']();
    const _duels: Duel[] = [];

    for (let i = 1; i <= duelCount; i++) {
      const duelData = await duelContract['getDuel'](i);

      console.log(duelData);

      const finishDate = duelData[10][2];

      const rawMoves = duelData[8];
      const duelistMoves: string[] = [];
      const challengerMoves: string[] = [];

      for (let j in rawMoves[0]) {
        if (rawMoves[0][j] === 1) duelistMoves.push('kick');
        else if (rawMoves[0][j] === 0) duelistMoves.push('punch');
        else if (rawMoves[0][j] === 3) duelistMoves.push('special');
        else duelistMoves.push('block');
      }

      for (let j in rawMoves[1]) {
        if (rawMoves[0][j] === 1) challengerMoves.push('kick');
        else if (rawMoves[0][j] === 0) challengerMoves.push('punch');
        else if (rawMoves[0][j] === 3) challengerMoves.push('special');
        else challengerMoves.push('block');
      }

      const token = ERC20__factory.connect(duelData[3], provider);

      const symbol = await token.symbol();
      const decimals = getTokenDecimals(symbol, chainId);

      let challengerAddress = duelData[1][1];
      if (challengerAddress.includes('0x00000000000000000000'))
        challengerAddress = '?';

      _duels.push({
        id: i,
        identifier: duelData[0],
        duelistAddress: duelData[1][0],
        challengerAddress: challengerAddress,
        wager: getUserReadableAmount(duelData[2], decimals),
        tokenName: symbol,
        tokenAddress: duelData[3],
        fees: duelData[4],
        duelist: duelData[6][0].toNumber(),
        challenger: duelData[6][1].toNumber(),
        isCreatorWinner: duelData[9],
        creationDate: duelData[10][0],
        challengedDate: duelData[10][1],
        finishDate: finishDate,
        isRevealed: finishDate < new Date() && challengerAddress !== '?',
        duelistMoves: duelistMoves,
        challengerMoves: challengerMoves,
      });
    }

    setDuels(_duels);
    setIsLoading(false);
  }, [provider, contractAddresses, duelContract, chainId]);

  const updateNfts = useCallback(async () => {
    if (!signer || !accountAddress || !diamondPepeNfts) return;

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
        console.log(e);
        break;
      }
    }

    // TODO: REMOVE
    _nfts = [
      {
        id: 2,
        src: `https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/629/1440/image.jpg`,
        collectionAddress: diamondPepeNfts.address,
      },
    ];

    setNfts(_nfts);
    setIsLoading(false);
  }, [accountAddress, contractAddresses, signer, diamondPepeNfts]);

  useEffect(() => {
    updateDuels();
  }, [updateDuels]);

  useEffect(() => {
    updateNfts();
  }, [updateNfts]);

  let contextValue = {
    duels,
    nfts,
    updateDuels,
    updateNfts,
    isLoading,
    duelContract,
  };

  return (
    <DuelContext.Provider value={contextValue}>
      {props.children}
    </DuelContext.Provider>
  );
};
