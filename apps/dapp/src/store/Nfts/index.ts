import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import { BaseNFT__factory, BaseNFT } from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';

import getTokenUri from 'utils/contracts/getTokenUri';

export interface NftData {
  nftName: string;
  nftSymbol: string;
  nftUri: string;
}

export interface UserNftData {
  balance: BigNumber;
  tokenId: BigNumber;
  nftContractSigner: BaseNFT;
}

export interface NftsSlice {
  nftsData: NftData[];
  userNftsData: UserNftData[];
  updateNftsData: Function;
  updateUserNftsData: Function;
}

export const createNftsSlice: StateCreator<
  WalletSlice & NftsSlice,
  [['zustand/devtools', never]],
  [],
  NftsSlice
> = (set, get) => ({
  nftsData: [],
  userNftsData: [],
  updateNftsData: async () => {
    const { provider, contractAddresses } = get();

    if (!provider || !contractAddresses) return;
    const nftsData: NftData[] = [];
    const nftAddresses = {
      DopexBridgoorNFT: contractAddresses['NFTS']['DopexBridgoorNFT'],
      DopexHalloweenNFT: contractAddresses['NFTS']['DopexHalloweenNFT'],
      DopexSantasNFT: contractAddresses['NFTS']['DopexSantasNFT'],
    };
    for (let nft in nftAddresses) {
      const nftContract = BaseNFT__factory.connect(
        contractAddresses['NFTS'][nft],
        provider
      );

      const [nftName, nftSymbol, nftUri] = await Promise.all([
        nftContract.name(),
        nftContract.symbol(),
        getTokenUri(nftContract),
      ]);

      nftsData.push({
        nftName: nftName,
        nftSymbol: nftSymbol ?? '',
        nftUri: nftUri ?? '',
      });
    }
    set((prevState) => ({ ...prevState, nftsData }));
  },
  updateUserNftsData: async () => {
    const { signer, accountAddress, contractAddresses } = get();

    if (!signer || !accountAddress || !contractAddresses) return;

    const nftAddresses = {
      DopexBridgoorNFT: contractAddresses['NFTS']['DopexBridgoorNFT'],
      DopexHalloweenNFT: contractAddresses['NFTS']['DopexHalloweenNFT'],
      DopexSantasNFT: contractAddresses['NFTS']['DopexSantasNFT'],
    };

    const userNftsData: UserNftData[] = [];
    for (const nft in nftAddresses) {
      const nftContract = BaseNFT__factory.connect(
        contractAddresses['NFTS'][nft],
        signer
      );

      const userBalance = await nftContract.balanceOf(accountAddress);
      let tokenId = BigNumber.from(0);
      if (userBalance.gt(0)) {
        tokenId = await nftContract.tokenOfOwnerByIndex(accountAddress, 0);
      }

      userNftsData.push({
        balance: userBalance,
        tokenId: tokenId,
        nftContractSigner: nftContract,
      });
    }

    set((prevState) => ({ ...prevState, userNftsData }));
  },
});
