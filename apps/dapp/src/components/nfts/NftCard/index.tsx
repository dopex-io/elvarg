import { useMemo } from 'react';
import Image from 'next/image';

import cx from 'classnames';

import { useBoundStore } from 'store';
import { NftData } from 'store/Nfts';

interface NftCardProps {
  nftData: NftData;
  className?: string;
  index: number;
}

const NFT_DATA: {
  [key: string]: { contractName: string; openseaURL: string };
} = {
  'Dopex Bridgoor NFT': {
    contractName: 'DopexBridgoorNFT',
    openseaURL: 'https://opensea.io/collection/dopex-bridgoor-nft',
  },
  'Dopex Halloween NFT': {
    contractName: 'DopexHalloweenNFT',
    openseaURL: 'https://opensea.io/collection/dopex-halloween-nft',
  },
  'Dopex Santas NFT': {
    contractName: 'DopexSantasNFT',
    openseaURL: 'https://opensea.io/collection/dopex-santas-nft',
  },
};

const NftCard = ({ nftData, className }: NftCardProps) => {
  const { nftsData } = useBoundStore();

  const {
    nftName,
  }: {
    nftName: string;
  } = useMemo(() => {
    if (nftsData.length === 0) {
      return {
        nftName: '',
      };
    } else {
      return {
        nftName: nftData.nftName,
      };
    }
  }, [nftsData, nftData]);

  return (
    <div className={cx('flex flex-col mb-4', className)}>
      <div className="flex flex-col">
        <div className="mb-6 text-center text-2xl text-white">{nftName}</div>
        <div className="mb-6 flex flex-col space-y-4 items-center">
          <Image
            src={'/images/nfts/' + NFT_DATA[nftName].contractName + '.gif'}
            alt={nftName}
            quality={100}
            height={400}
            width={300}
          />
          <a
            href={NFT_DATA[nftName].openseaURL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-wave-blue"
          >
            Opensea
          </a>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
