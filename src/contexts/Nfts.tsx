import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { BigNumber } from 'ethers';

import { BaseNFT__factory, BaseNFT } from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

export interface NftData {
  nftName: string;
  nftUri: string;
}

export interface UserNftData {
  balance: BigNumber;
  tokenId: BigNumber;
  nftContractSigner: BaseNFT;
}

interface NftsContextInterface {
  nftsData: NftData[];
  userNftsData: UserNftData[];
  updateData?: Function;
  updateUserData?: Function;
}

const initialData: NftsContextInterface = {
  nftsData: [],
  userNftsData: [],
};

export const NftsContext = createContext<NftsContextInterface>(initialData);

export const NftsProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [nftsData, setNftsData] = useState<NftData[]>([]);
  const [userNftsData, setUserNftsData] = useState<UserNftData[]>([]);

  const updateData = useCallback(async () => {
    if (!provider || !contractAddresses) return;
    const nftsData: NftData[] = [];
    for (const nft in contractAddresses.NFTS) {
      const nftContract = BaseNFT__factory.connect(
        contractAddresses.NFTS[nft],
        provider
      );

      const [nftName, nftUri] = await Promise.all([
        nftContract.name(),
        nftContract.tokenURI(0),
      ]);

      nftsData.push({
        nftName: nftName,
        nftUri: nftUri,
      });
    }
    setNftsData(nftsData);
  }, [provider, contractAddresses]);

  const updateUserData = useCallback(async () => {
    if (!signer || !accountAddress || !contractAddresses) return;
    const userNftsData: UserNftData[] = [];
    for (const nft in contractAddresses.NFTS) {
      const nftContract = BaseNFT__factory.connect(
        contractAddresses.NFTS[nft],
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
    setUserNftsData(userNftsData);
  }, [accountAddress, contractAddresses, signer]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  let contextValue = {
    nftsData,
    userNftsData,
    updateData,
    updateUserData,
  };

  return (
    <NftsContext.Provider value={contextValue}>
      {props.children}
    </NftsContext.Provider>
  );
};
