import { useContext, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import cx from 'classnames';
import Image from 'next/image';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import ClaimDialog from '../ClaimDialog';
import TransferDialog from '../TransferDialog';
import { NftsContext, NftData } from 'contexts/Nfts';

interface NftCardProps {
  nftData: NftData;
  className?: string;
  index: number;
}

const NftCard = ({ nftData, className, index }: NftCardProps) => {
  const [claimDialog, setClaimDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const { userNftsData } = useContext(NftsContext);

  const {
    balance,
    nftName,
  }: {
    balance: BigNumber;
    nftName: string;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        balance: BigNumber.from(0),
        nftName: '',
      };
    } else {
      return {
        // @ts-ignore TODO: FIX
        balance: userNftsData[index].balance,
        nftName: nftData.nftName,
      };
    }
  }, [userNftsData, index, nftData]);

  const nft =
    nftName === 'Dopex Bridgoor NFT' ? 'DopexBridgoorNFT' : 'DopexHalloweenNFT';

  const handleClaimDialogClose = () => setClaimDialog(false);
  const handleTransferDialogClose = () => setTransferDialog(false);

  const handleClaimDialog = () => {
    setClaimDialog(true);
  };
  const handleTransferDialog = () => {
    setTransferDialog(true);
  };

  const buttonProps = useMemo(() => {
    if (balance.eq(0)) {
      return { disabled: true };
    } else return { disabled: false };
  }, [balance]);

  return (
    <>
      <ClaimDialog
        open={claimDialog}
        handleClose={handleClaimDialogClose}
        index={index}
        name={nftName}
      />
      <TransferDialog
        open={transferDialog}
        handleClose={handleTransferDialogClose}
        index={index}
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
          <Box className="grid grid-cols-2 space-x-4">
            <CustomButton size="medium" onClick={handleClaimDialog}>
              <span className="text-lg">Claim</span>
            </CustomButton>
            <CustomButton
              size="medium"
              onClick={handleTransferDialog}
              disabled={buttonProps.disabled}
            >
              <span className="text-lg">Transfer</span>
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NftCard;
