import { SetStateAction, useCallback, useMemo, useState } from 'react';
import { ethers, utils as ethersUtils } from 'ethers';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { WritePositionInterface } from 'store/Vault/ssov';

import CustomButton from 'components/UI/Button';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import Stat from '../Stat';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: WritePositionInterface;
}

const WithdrawDialog = ({ open, handleClose, data }: Props) => {
  const { accountAddress, ssovData, ssovSigner, updateSsovV3UserData } =
    useBoundStore();

  const sendTx = useSendTx();

  const handleClaim = useCallback(async () => {
    if (
      !ssovSigner.ssovStakingRewardsWithSigner ||
      !accountAddress ||
      !ssovData ||
      !ssovData.ssovContract
    )
      return;
    await sendTx(ssovSigner.ssovStakingRewardsWithSigner, 'claim', [
      ssovData.ssovContract.address,
      data.tokenId,
      accountAddress,
    ]).then(async () => {
      await updateSsovV3UserData();
    });
  }, [
    accountAddress,
    data,
    ssovData,
    sendTx,
    ssovSigner,
    updateSsovV3UserData,
  ]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton
            className="p-0 pr-3 pb-1"
            onClick={handleClose}
            size="large"
          >
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Claim Rewards</Typography>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col p-4 space-y-4 pt-2">
          <span className="text-white">
            {' '}
            {data.stakeRewardAmounts.length > 0
              ? 'Claimable Rewards'
              : 'No Rewards to claim'}
          </span>
          {data.stakeRewardAmounts.map((rewardAmount, index) => {
            return (
              <Stat
                name={data.stakeRewardTokens[index].symbol}
                key={index}
                value={ethers.utils.formatUnits(rewardAmount, '18')}
              />
            );
          })}
        </Box>
        <CustomButton
          className="w-full mb-4"
          onClick={handleClaim}
          size="large"
        >
          Claim
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default WithdrawDialog;
