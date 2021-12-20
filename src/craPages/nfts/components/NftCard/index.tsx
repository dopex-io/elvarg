import { useState } from 'react';
import Box from '@material-ui/core/Box';
import cx from 'classnames';
import Image from 'next/image';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import ClaimDialog from '../ClaimDialog';

interface NftCardProps {
  gif: any;
  nft: string;
  className?: string;
}

const NftCard = ({ gif, nft, className }: NftCardProps) => {
  const [claimDialog, setClaimDialog] = useState(false);
  const handleClaimDialogClose = () => setClaimDialog(false);

  const handleClaimDialog = () => {
    setClaimDialog(true);
  };
  const name =
    nft === 'DopexBridgoorNFT' ? 'Dopex Bridgoor NFT' : 'Dopex Halloween NFT';

  return (
    <>
      <ClaimDialog
        open={claimDialog}
        handleClose={handleClaimDialogClose}
        nft={nft}
        name={name}
      />
      <Box className={cx('flex flex-col mb-4 w-full', className)}>
        <Box className="flex flex-col">
          <Typography className="mb-6 text-center" variant="h2">
            {name}
          </Typography>
          <Box className="mb-6">
            <Image
              src={gif}
              alt={name}
              quality={100}
              height={500}
              width={400}
            ></Image>
          </Box>
          <Box>
            <CustomButton
              className="w-full"
              size="large"
              onClick={handleClaimDialog}
            >
              <span className="text-xl">Claim</span>
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NftCard;
