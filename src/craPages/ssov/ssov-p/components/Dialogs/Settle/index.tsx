import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BigNumber } from 'ethers';
import { ERC20SSOV } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE } from 'constants/index';
import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

export interface Props {
  open: boolean;
  handleClose: () => {};
  strikeIndex: number;
  ssovProperties: SsovProperties;
  token: string;
  settleableAmount: BigNumber;
}

const Settle = ({
  open,
  handleClose,
  strikeIndex,
  ssovProperties,
  token,
  settleableAmount,
}: Props) => {
  const {
    updateSsovData,
    updateUserSsovData,
    selectedSsov,
    ssovDataArray,
    userSsovDataArray,
    ssovSignerArray,
  } = useContext(SsovContext);
  const { accountAddress, signer } = useContext(WalletContext);
  const { convertToVBNB } = useBnbSsovConversion();

  const { selectedEpoch, tokenName } = ssovProperties;
  const { ssovContractWithSigner } = ssovSignerArray[selectedSsov];
  const { epochStrikes, settlementPrice } = ssovDataArray[selectedSsov];
  const { epochStrikeTokens } = userSsovDataArray[selectedSsov];

  const [approved, setApproved] = useState<boolean>(false);
  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<BigNumber>(BigNumber.from('0'));

  const sendTx = useSendTx();

  const epochStrikeToken = epochStrikeTokens[strikeIndex];
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
    ? settlementPrice
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
      updateSsovData();
      updateUserSsovData();
      updateUserEpochStrikeTokenBalance();
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovContractWithSigner,
    strikeIndex,
    settleableAmount,
    updateSsovData,
    updateUserSsovData,
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
          <IconButton className="p-0 mr-3 my-auto" onClick={handleClose}>
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
                <img src={`/assets/${token}.svg`} alt={`${token}`} />
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
            disabled={
              !approved ||
              settleableAmount.eq(BigNumber.from(0)) ||
              !settleableAmount.eq(userEpochStrikeTokenBalance)
            }
            onClick={handleSettle}
          >
            Settle
          </CustomButton>
          <CustomButton
            size="large"
            className="w-11/12 ml-1"
            onClick={handleApprove}
            disabled={approved}
          >
            Approve
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
