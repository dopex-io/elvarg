import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BigNumber } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';
import { BnbConversionContext } from 'contexts/BnbConversion';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  strikeIndex: number;
  token: string;
  settleableAmount: BigNumber;
  activeSsovContextSide: string;
}

const Settle = ({
  open,
  handleClose,
  strikeIndex,
  token,
  settleableAmount,
  activeSsovContextSide,
}: Props) => {
  const ssovContext = useContext(SsovContext);
  const {
    updateSsovEpochData,
    updateSsovUserData,
    ssovData,
    ssovEpochData,
    ssovUserData,
    ssovSigner,
    selectedEpoch,
    selectedSsov,
  } = ssovContext[activeSsovContextSide];
  const { accountAddress, signer } = useContext(WalletContext);
  const { convertToVBNB } = useContext(BnbConversionContext);

  const { tokenName } = ssovData;
  const { ssovContractWithSigner } = ssovSigner;
  const { epochStrikes, settlementPrice } = ssovEpochData;
  const { epochStrikeTokens } = ssovUserData;

  const [approved, setApproved] = useState<boolean>(false);
  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<BigNumber>(BigNumber.from('0'));

  const sendTx = useSendTx();

  const epochStrikeToken = epochStrikeTokens[strikeIndex] || null;
  const strikePrice = getUserReadableAmount(epochStrikes[strikeIndex] ?? 0, 8);

  const updateUserEpochStrikeTokenBalance = useCallback(async () => {
    if (!epochStrikeToken || !accountAddress) {
      setUserEpochStrikeTokenBalance(BigNumber.from('0'));
      return;
    }
    const userEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      accountAddress
    );
    setUserEpochStrikeTokenBalance(userEpochStrikeTokenBalance);
  }, [epochStrikeToken, accountAddress]);

  useEffect(() => {
    updateUserEpochStrikeTokenBalance();
  }, [updateUserEpochStrikeTokenBalance]);

  const PnL = !settlementPrice.isZero()
    ? activeSsovContextSide === 'PUT'
      ? epochStrikes[strikeIndex]
          .sub(settlementPrice)
          .mul(settleableAmount)
          .mul(1e10)
          .div(ssovData.lpPrice)
      : settlementPrice
          .sub(epochStrikes[strikeIndex])
          .mul(settleableAmount)
          .div(settlementPrice)
    : BigNumber.from(0);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        epochStrikeToken
          .connect(signer)
          .approve(ssovContractWithSigner.address, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [epochStrikeToken, signer, ssovContractWithSigner, sendTx]);

  // Handle Settle
  const handleSettle = useCallback(async () => {
    try {
      await sendTx(
        ssovContractWithSigner.settle(strikeIndex, settleableAmount, 1)
      );
      updateSsovEpochData();
      updateSsovUserData();
      updateUserEpochStrikeTokenBalance();
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovContractWithSigner,
    strikeIndex,
    settleableAmount,
    updateSsovEpochData,
    updateSsovUserData,
    updateUserEpochStrikeTokenBalance,
    sendTx,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!epochStrikeToken || !ssovContractWithSigner) return;
    (async function () {
      let allowance = await epochStrikeToken.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );
      setApproved(settleableAmount.lte(allowance) && !allowance.eq(0));
    })();
  }, [
    accountAddress,
    epochStrikeToken,
    ssovContractWithSigner,
    settleableAmount,
    approved,
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
            className="p-0 mr-3 my-auto"
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
        <Box className="bg-umbra rounded-md flex flex-col mb-2 p-4">
          <Box className="flex flex-row justify-between">
            <Box className="h-12 bg-cod-gray rounded-xl p-2 flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img
                  src={`/assets/${token.toLowerCase()}.svg`}
                  alt={`${token}`}
                />
              </Box>
              <Typography variant="h5" className="text-white">
                {`${token}-CALL${strikePrice}-EPOCH-${selectedEpoch}`}
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-col">
            <Box className="flex flex-row justify-between mt-4">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Settlement Price (Expiration Price)
              </Typography>
              <Typography variant="caption" component="div">
                ${formatAmount(getUserReadableAmount(settlementPrice, 18), 5)}
              </Typography>
            </Box>
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Strike Price
              </Typography>
              <Typography variant="caption" component="div">
                ${formatAmount(strikePrice, 5)}
              </Typography>
            </Box>
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Settlement Amount
              </Typography>
              <Typography variant="caption" component="div">
                {formatAmount(getUserReadableAmount(settleableAmount, 18), 5)}
              </Typography>
            </Box>
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                PNL
              </Typography>
              <Typography
                variant="caption"
                component="div"
                className="text-wave-blue"
              >
                {formatAmount(
                  tokenName === 'BNB'
                    ? getUserReadableAmount(convertToVBNB(PnL), 8)
                    : getUserReadableAmount(PnL, 18),
                  5
                )}{' '}
                {`${tokenName === 'BNB' ? 'vBNB' : token}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="flex mb-2">
          <CustomButton
            size="large"
            className="w-11/12 mr-1"
            onClick={handleApprove}
            disabled={approved}
          >
            Approve
          </CustomButton>
          <CustomButton
            size="large"
            className="w-11/12 ml-1"
            disabled={
              !approved ||
              settleableAmount.eq(BigNumber.from(0)) ||
              !settleableAmount.eq(userEpochStrikeTokenBalance)
            }
            onClick={handleSettle}
          >
            Settle
          </CustomButton>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz">
            Epoch {selectedEpoch}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Settle;
