import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BigNumber } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

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
    ssovPropertiesArray,
  } = useContext(SsovContext);
  const { accountAddress, signer } = useContext(WalletContext);

  const { selectedEpoch, tokenPrice } = ssovProperties;
  const { ssovContractWithSigner } = ssovSignerArray[selectedSsov];
  const { epochStrikes } = ssovDataArray[selectedSsov];
  const { epochStrikeTokens /*, userEpochStrikeDeposits */ } =
    userSsovDataArray[selectedSsov];
  const { ssovContract } = ssovPropertiesArray[selectedEpoch];

  const [approved, setApproved] = useState<boolean>(false);
  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<BigNumber>(BigNumber.from('0'));

  const epochStrikeToken = epochStrikeTokens[strikeIndex];
  const strikePrice = getUserReadableAmount(epochStrikes[strikeIndex] ?? 0, 8);
  const currentPrice = getUserReadableAmount(tokenPrice ?? 0, 8);
  // const userEpochStrikeDepositAmount = getUserReadableAmount(
  //   userEpochStrikeDeposits[strikeIndex] ?? 0,
  //   18
  // );

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

  const PnL =
    ((currentPrice - strikePrice) *
      getUserReadableAmount(settleableAmount, 18)) /
    strikePrice;

  // const PnLPercent = PnL - 100 / userEpochStrikeDepositAmount;

  const PnLPercent = (PnL / getUserReadableAmount(settleableAmount, 18)) * 100;

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        epochStrikeToken
          .connect(signer)
          .approve(ssovContract.address, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [epochStrikeToken, signer, ssovContract]);

  // Handle Settle
  const handleSettle = useCallback(async () => {
    try {
      await sendTx(
        ssovContractWithSigner.settle(
          strikeIndex,
          settleableAmount,
          accountAddress
        )
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
    accountAddress,
    updateSsovData,
    updateUserSsovData,
    updateUserEpochStrikeTokenBalance,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!epochStrikeToken || !ssovContract) return;
    (async function () {
      let allowance = await epochStrikeToken.allowance(
        accountAddress,
        ssovContract.address
      );
      setApproved(settleableAmount.lte(allowance) && !allowance.eq(0));
    })();
  }, [
    accountAddress,
    epochStrikeToken,
    ssovContract,
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
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz mb-2">
            Balance:{' '}
            {formatAmount(
              getUserReadableAmount(userEpochStrikeTokenBalance, 18),
              5
            )}
          </Typography>
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
                Current Price
              </Typography>
              <Typography variant="caption" component="div">
                ${formatAmount(currentPrice, 5)}
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
              <Typography variant="caption">
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
              <Typography variant="caption" component="div">
                {formatAmount(PnL, 5)} {`${token}`}
              </Typography>
            </Box>
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                PNL%
              </Typography>
              <Typography
                variant="caption"
                component="div"
                className="text-wave-blue"
              >
                {formatAmount(PnLPercent, 5)}%
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
              !settleableAmount.eq(userEpochStrikeTokenBalance) ||
              strikePrice > currentPrice
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
