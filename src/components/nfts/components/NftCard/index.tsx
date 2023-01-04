import { useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import cx from 'classnames';
import Image from 'next/image';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import ClaimDialog from '../ClaimDialog';
import TransferDialog from '../TransferDialog';

import { useBoundStore } from 'store';
import { NftData } from 'store/Nfts';

interface NftCardProps {
  nftData: NftData;
  className?: string;
  index: number;
}

const NftCard = ({ nftData, className, index }: NftCardProps) => {
  const [claimDialog, setClaimDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const { userNftsData } = useBoundStore();

  const {
    balance,
    nftName,
    nftSymbol,
  }: {
    balance: BigNumber;
    nftName: string;
    nftSymbol: string;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        balance: BigNumber.from(0),
        nftName: '',
        nftSymbol: '',
      };
    } else {
      return {
        balance: userNftsData[index]?.balance ?? BigNumber.from(0),
        nftName: nftData.nftName,
        nftSymbol: nftData.nftSymbol,
      };
    }
  }, [userNftsData, index, nftData]);

  const NAME_TO_CONTRACT_NAME: { [key: string]: string } = {
    'Dopex Bridgoor NFT': 'DopexBridgoorNFT',
    'Dopex Halloween NFT': 'DopexHalloweenNFT',
    'Dopex Santas NFT': 'DopexSantasNFT',
  };
  const nft = NAME_TO_CONTRACT_NAME[nftName];

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
        symbol={nftSymbol}
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
