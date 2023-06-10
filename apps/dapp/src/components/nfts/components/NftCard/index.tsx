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

const NftCard = ({ nftData, className }: NftCardProps) => {
  const { userNftsData } = useBoundStore();

  const {
    nftName,
  }: {
    nftName: string;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        nftName: '',
      };
    } else {
      return {
        nftName: nftData.nftName,
      };
    }
  }, [userNftsData, nftData]);

  const NAME_TO_CONTRACT_NAME: { [key: string]: string } = {
    'Dopex Bridgoor NFT': 'DopexBridgoorNFT',
    'Dopex Halloween NFT': 'DopexHalloweenNFT',
    'Dopex Santas NFT': 'DopexSantasNFT',
  };

  const nft = NAME_TO_CONTRACT_NAME[nftName];

  return (
    <div className={cx('flex flex-col mb-4', className)}>
      <div className="flex flex-col">
        <div className="mb-6 text-center text-3xl text-white">{nftName}</div>
        <div className="mb-6">
          <Image
            src={'/images/nfts/' + nft + '.gif'}
            alt={nftName}
            quality={100}
            height={500}
            width={400}
          />
        </div>
      </div>
    </div>
  );
};

export default NftCard;
