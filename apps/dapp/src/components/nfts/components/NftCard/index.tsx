import Image from 'next/image';

import { useMemo, useState } from 'react';

import { Button } from '@dopex-io/ui';
import Box from '@mui/material/Box';
import cx from 'classnames';
import { useBoundStore } from 'store';

import { NftData } from 'store/Nfts';

import Typography from 'components/UI/Typography';

import ClaimDialog from '../ClaimDialog';

interface NftCardProps {
  nftData: NftData;
  className?: string;
  index: number;
}

const NftCard = ({ nftData, className, index }: NftCardProps) => {
  const [claimDialog, setClaimDialog] = useState(false);
  const { userNftsData } = useBoundStore();

  const {
    nftName,
    nftSymbol,
  }: {
    nftName: string;
    nftSymbol: string;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        nftName: '',
        nftSymbol: '',
      };
    } else {
      return {
        nftName: nftData.nftName,
        nftSymbol: nftData.nftSymbol,
      };
    }
  }, [userNftsData, nftData]);

  const NAME_TO_CONTRACT_NAME: { [key: string]: string } = {
    'Dopex Bridgoor NFT': 'DopexBridgoorNFT',
    'Dopex Halloween NFT': 'DopexHalloweenNFT',
    'Dopex Santas NFT': 'DopexSantasNFT',
  };
  const nft = NAME_TO_CONTRACT_NAME[nftName];

  const handleClaimDialogClose = () => setClaimDialog(false);

  const handleClaimDialog = () => {
    setClaimDialog(true);
  };

  return (
    <>
      <ClaimDialog
        open={claimDialog}
        handleClose={handleClaimDialogClose}
        index={index}
        name={nftName}
        symbol={nftSymbol}
      />
      <Box className={cx('flex flex-col mb-4', className)}>
        <Box className="flex flex-col">
          <Typography className="mb-6 text-center" variant="h2">
            {nftName}
          </Typography>
          <Box className="mb-6">
            <Image
              src={'/images/nfts/' + nft + '.gif'}
              alt={nftName}
              quality={100}
              height={500}
              width={400}
            />
          </Box>
          <Button size="medium" onClick={handleClaimDialog}>
            Claim
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NftCard;
