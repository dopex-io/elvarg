import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  Addresses,
  ERC20__factory,
  DuelDiamondPepesNFTsDuel__factory,
  DuelDiamondPepesNFTsMint__factory,
  DuelDiamondPepesNFTsLeaderboard__factory,
  DuelDiamondPepesNFTs__factory,
  BaseNFT__factory,
} from '@dopex-io/sdk';

import { AssetsSlice } from 'store/Assets';
import { WalletSlice } from 'store/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import addHoursToDate from 'utils/date/addHoursToDate';

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

export interface DuelSlice {
  nfts: UserNft[];
  duels: Duel[];
  activeDuels: Duel[];
  updateDuels?: Function;
  updateUserNfts?: Function;
  isLoading: boolean;
  duelContract?: any;
  mintContract?: any;
  selectedDuel: Duel | null;
  setSelectedDuel?: Function;
  availableCredit: BigNumber;
  updateCredit?: Function;
  updatePepesData?: Function;
  pepesData: {
    publicMints: BigNumber;
    nextMintId: BigNumber;
    maxPublicMints: BigNumber;
    mintPrice: BigNumber;
    endTime: BigNumber;
    startTime: BigNumber;
  };
}

export const createDuelSlice: StateCreator<
  DuelSlice & AssetsSlice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  DuelSlice
> = (set, get) => ({
  nfts: [],
  duels: [],
  activeDuels: [],
  isLoading: true,
  selectedDuel: null,
  availableCredit: BigNumber.from('0'),
  pepesData: {
    publicMints: BigNumber.from('0'),
    nextMintId: BigNumber.from('0'),
    maxPublicMints: BigNumber.from('0'),
    mintPrice: BigNumber.from('0'),
    endTime: BigNumber.from('0'),
    startTime: BigNumber.from('0'),
  },
  updatePepesData: async () => {
    const { provider, signer, contractAddresses } = get();
    if (!provider || !signer) return;

    const nftContract = DuelDiamondPepesNFTs__factory.connect(
      contractAddresses['NFTS']['DuelDiamondPepesNFT'],
      provider
    );

    const publicSaleContract = DuelDiamondPepesNFTsMint__factory.connect(
      contractAddresses['DuelDiamondPepesNFTsMint'],
      provider
    );

    const [publicMints, nextMintId] = await Promise.all([
      nftContract['publicMints'](),
      nftContract['nextMintId'](),
      nftContract['maxPublicMints'](),
    ]);

    const [mintPrice, endTime, startTime, maxMints] = await Promise.all([
      publicSaleContract['mintPrice'](),
      publicSaleContract['endTime'](),
      publicSaleContract['startTime'](),
      publicSaleContract['maxMints'](),
    ]);

    const data = {
      publicMints: publicMints,
      nextMintId: nextMintId,
      maxPublicMints: maxMints,
      mintPrice: mintPrice,
      endTime: endTime,
      startTime: startTime,
    };

    set((prevState) => ({
      ...prevState,
      pepesData: data,
    }));
  },
  updateCredit: async () => {
    const { accountAddress, provider } = get();

    if (!accountAddress || !provider) return;

    const duelLeaderboardContract =
      DuelDiamondPepesNFTsLeaderboard__factory.connect(
        '0x4E31359828F279fa6d748971eE087a6f168c21a2',
        provider
      );

    const credit = await duelLeaderboardContract!['getCreditForMinting'](
      accountAddress
    );

    set((prevState) => ({
      ...prevState,
      availableCredit: credit,
    }));
  },
  updateDuels: async () => {
    const {
      accountAddress,
      tokenPrices,
      provider,
      signer,
      chainId,
      contractAddresses,
    } = get();

    if (!signer || !accountAddress || !provider) return;

    const duelContract = DuelDiamondPepesNFTsDuel__factory.connect(
      contractAddresses['DuelDiamondPepesNFTsDuel'],
      provider
    );

    const mintContract = DuelDiamondPepesNFTsMint__factory.connect(
      contractAddresses['DuelDiamondPepesNFTsMint'],
      provider
    );

    const getDuelData = async (i: number) => {
      if (!duelContract) return;

      const duelData = await duelContract['getDuel'](i);

      const finishDate = new Date(duelData[7][1].toNumber() * 1000);

      const maxRevealDate = addHoursToDate(finishDate, 4);
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
          if (rawMoves[0][j]!.eq(BigNumber.from('1')))
            duelistMoves.push('kick');
          else if (rawMoves[0][j]!.eq(BigNumber.from('0')))
            duelistMoves.push('punch');
          else if (rawMoves[0][j]!.eq(BigNumber.from('3')))
            duelistMoves.push('special');
          else duelistMoves.push('block');
        }

        for (let j in rawMoves[1]) {
          if (rawMoves[1][j]!.eq(BigNumber.from('1')))
            challengerMoves.push('kick');
          else if (rawMoves[1][j]!.eq(BigNumber.from('0')))
            challengerMoves.push('punch');
          else if (rawMoves[1][j]!.eq(BigNumber.from('3')))
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

      const challengedLimitDate = addHoursToDate(creationDate, 4);

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

            if (duelistMoves.length === 0) {
              if (duelistAddress !== accountAddress)
                status = 'requireClaimForfeit';
              else status = 'waitClaimForfeit';
            }
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
      const fees = parseInt(duelData[3].toString());
      const challengedDate = new Date(duelData[7][1].toNumber() * 1000);

      const duel: Duel = {
        id: i,
        identifier: Number(duelData[0]),
        duelistAddress: duelistAddress,
        challengerAddress: challengerAddress,
        wager: wager,
        tokenName: symbol,
        tokenAddress: Addresses[chainId]['WETH'],
        fees: fees,
        duelist: Math.floor(Math.random() * (maximum - minimum + 1)) + minimum,
        challenger:
          Math.floor(Math.random() * (maximum - minimum + 1)) + minimum,
        isCreatorWinner: isCreatorWinner,
        creationDate: creationDate,
        challengedLimitDate: challengedLimitDate,
        challengedDate: challengedDate,
        finishDate: finishDate,
        isRevealed: isRevealed,
        duelistMoves: duelistMoves,
        challengerMoves: challengerMoves,
        status: status,
        wagerValueInUSD: wagerValueInUSD,
      };

      return duel;
    };

    const duelCount = (await duelContract['duelCount']()).toNumber();
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

    set((prevState) => ({
      ...prevState,
      duels: _duels,
      activeDuels: _activeDuels,
      isLoading: false,
      duelContract: duelContract,
      mintContract: mintContract,
    }));
  },
  updateNfts: async () => {
    const { accountAddress, provider, signer, contractAddresses } = get();

    if (!signer || !accountAddress || !provider) return;

    const diamondPepeNfts = BaseNFT__factory.connect(
      contractAddresses['NFTS']['DiamondPepesNFT'],
      signer
    );

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

    set((prevState) => ({
      ...prevState,
      nfts: _nfts,
    }));
  },
});
