import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ERC20__factory } from '@dopex-io/sdk';
import { ethers } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import { useBoundStore } from 'store';
import { SsovV3EpochData } from 'store/Vault/ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

export interface Props {
  open: boolean;
  handleClose: () => {};
  strikeIndex: number;
}

const Stat = ({ name, value }: { name: string; value: string }) => {
  return (
    <Box className="flex flex-row justify-between mt-3">
      <Typography variant="caption" component="div" className="text-stieglitz">
        {name}
      </Typography>
      <Typography variant="caption" component="div">
        {value}
      </Typography>
    </Box>
  );
};

const Settle = ({ open, handleClose, strikeIndex }: Props) => {
  const {
    accountAddress,
    provider,
    signer,
    updateSsovV3EpochData,
    updateSsovV3UserData,
    ssovEpochData,
    ssovSigner,
    selectedEpoch,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<string>('0');
  const [approved, setApproved] = useState(false);

  const { epochStrikes, epochStrikeTokens } = ssovEpochData as SsovV3EpochData;

  const strikePrice = getUserReadableAmount(epochStrikes[strikeIndex] ?? 0, 8);
  const epochStrikeToken = epochStrikeTokens[strikeIndex];

  const updateUserEpochStrikeTokenBalance = useCallback(async () => {
    if (!epochStrikeToken || !accountAddress) {
      setUserEpochStrikeTokenBalance('0');
      return;
    }
    const _userEpochStrikeTokenBalance = await ERC20__factory.connect(
      epochStrikeToken,
      provider
    ).balanceOf(accountAddress);
    setUserEpochStrikeTokenBalance(_userEpochStrikeTokenBalance.toString());
  }, [epochStrikeToken, accountAddress, provider]);

  const handleSettle = useCallback(async () => {
    if (
      !accountAddress ||
      !epochStrikeToken ||
      !selectedEpoch ||
      !ssovSigner.ssovContractWithSigner
    )
      return;
    try {
      await sendTx(
        ssovSigner.ssovContractWithSigner.settle(
          strikeIndex,
          userEpochStrikeTokenBalance,
          selectedEpoch,
          accountAddress
        )
      );
      updateSsovV3EpochData();
      updateSsovV3UserData();
      updateUserEpochStrikeTokenBalance();
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedEpoch,
    accountAddress,
    epochStrikeToken,
    sendTx,
    ssovSigner,
    strikeIndex,
    userEpochStrikeTokenBalance,
    updateSsovV3EpochData,
    updateSsovV3UserData,
    updateUserEpochStrikeTokenBalance,
  ]);

  const handleApprove = useCallback(async () => {
    if (
      !accountAddress ||
      !epochStrikeToken ||
      !signer ||
      !ssovSigner.ssovContractWithSigner
    )
      return;
    try {
      const optionsToken = ERC20__factory.connect(epochStrikeToken, signer);

      await sendTx(
        optionsToken.approve(
          ssovSigner.ssovContractWithSigner.address,
          userEpochStrikeTokenBalance
        )
      );
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    epochStrikeToken,
    signer,
    ssovSigner,
    userEpochStrikeTokenBalance,
    sendTx,
  ]);

  useEffect(() => {
    async function checkAllowance() {
      if (
        !accountAddress ||
        !epochStrikeToken ||
        !ssovSigner.ssovContractWithSigner
      )
        return;
      const optionsToken = ERC20__factory.connect(epochStrikeToken, provider);

      const allowance = await optionsToken.allowance(
        accountAddress,
        ssovSigner.ssovContractWithSigner.address
      );

      setApproved(allowance.gte(userEpochStrikeTokenBalance));
    }
    checkAllowance();
  }, [
    accountAddress,
    epochStrikeToken,
    provider,
    ssovSigner,
    userEpochStrikeTokenBalance,
  ]);

  useEffect(() => {
    updateUserEpochStrikeTokenBalance();
  }, [updateUserEpochStrikeTokenBalance]);

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
          <Typography variant="h3">Settle</Typography>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col p-4">
          <Stat
            name="Strike Price"
            value={`$${formatAmount(strikePrice, 5)}`}
          />
          <Stat
            name="Amount"
            value={`${ethers.utils.formatEther(userEpochStrikeTokenBalance)}`}
          />
          <Stat name="Epoch" value={`${selectedEpoch}`} />
        </Box>
        <CustomButton
          className="w-full my-4"
          onClick={approved ? handleSettle : handleApprove}
          size="large"
        >
          {approved ? 'Settle' : 'Approve'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default Settle;
