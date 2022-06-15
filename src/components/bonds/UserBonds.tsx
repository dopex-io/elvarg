// import { createContext, useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomButton from 'components/UI/CustomButton';

type UserBondsProps = {
  accountAddress: string | undefined;
  handleModal: () => {};
};

export const UserBonds = ({ accountAddress, handleModal }: UserBondsProps) => {
  return (
    <Box className="mt-5">
      <Typography variant="h5">Your Bonds</Typography>
      {accountAddress ? (
        <Box className="border border-[#1E1E1E] rounded-2xl p-3 md:w-[728px] mt-5">
          <div className="text-center">
            You have no vested DPX.{' '}
            <span className="text-[#22E1FF]" onClick={handleModal}>
              Bond Now
            </span>
          </div>
        </Box>
      ) : (
        <Box className="border border-[#1E1E1E] rounded-2xl p-3 flex w-[728px] mt-5">
          <div className="flex-1">
            <AccountBalanceWalletIcon /> Connect your wallet to see your bonds
          </div>
          <CustomButton
            variant="text"
            size="small"
            className="text-white bg-primary hover:bg-primary"
          >
            Connect {accountAddress}
          </CustomButton>
        </Box>
      )}
      <Box></Box>
    </Box>
  );
};
