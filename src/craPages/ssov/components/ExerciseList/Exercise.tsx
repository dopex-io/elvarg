import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BigNumber from 'bignumber.js';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';

import { newEthersTransaction } from 'utils/contracts/transactions';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  strikeIndex: number;
  ssov: 'dpx' | 'rdpx';
}

const Exercise = ({ open, handleClose, strikeIndex, ssov }: Props) => {
  const context = useContext(SsovContext);
  const {
    ssovContractWithSigner,
    selectedEpoch,
    ssovData: { epochStrikes },
    userSsovData: { epochStrikeTokens, userEpochStrikeDeposits },
    tokenPrice,
  } = context[ssov];
  const { updateSsovData, updateUserSsovData } = context;
  const { accountAddress } = useContext(WalletContext);
  const [inputValue, setInputValue] = useState('0');
  const [approved, setApproved] = useState<boolean>(false);
  const [maxApprove, setMaxApprove] = useState(false);

  const epochStrikeToken = epochStrikeTokens[strikeIndex];
  const strikePrice = getUserReadableAmount(epochStrikes[strikeIndex] ?? 0, 8);
  const currentPrice = getUserReadableAmount(tokenPrice ?? 0, 8);
  const userEpochStrikeDepositAmount = getUserReadableAmount(
    userEpochStrikeDeposits[strikeIndex] ?? 0,
    18
  );

  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<number>(0);
  const updateUserEpochStrikeTokenBalance = useCallback(async () => {
    if (!epochStrikeToken || !accountAddress) {
      setUserEpochStrikeTokenBalance(0);
      return;
    }
    const userEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      accountAddress
    );
    setUserEpochStrikeTokenBalance(
      getUserReadableAmount(userEpochStrikeTokenBalance, 18)
    );
  }, [epochStrikeToken, accountAddress]);
  useEffect(() => {
    updateUserEpochStrikeTokenBalance();
  }, [updateUserEpochStrikeTokenBalance]);

  const PnL = currentPrice - (strikePrice * Number(inputValue)) / currentPrice;
  const PnLPercent = PnL - 100 / userEpochStrikeDepositAmount;

  // Handle Input Amount
  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleMax = useCallback(() => {
    setInputValue(userEpochStrikeTokenBalance.toString());
    formik.setFieldValue(
      'amount',
      formatAmount(userEpochStrikeTokenBalance, 5)
    );
  }, [formik, userEpochStrikeTokenBalance]);

  const inputHandleChange = useCallback(
    (e) => {
      formik.setFieldValue('amount', e.target.value);
      setInputValue(e.target.value.toString());
    },
    [formik]
  );

  // Handles isApproved
  useEffect(() => {
    if (!epochStrikeToken || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = getContractReadableAmount(inputValue, 18);

      let allowance = await epochStrikeToken.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [accountAddress, inputValue, epochStrikeToken, ssovContractWithSigner]);

  const handleApprove = useCallback(async () => {
    const finalAmount = getContractReadableAmount(inputValue, 18);
    try {
      await newEthersTransaction(
        epochStrikeToken.approve(
          ssovContractWithSigner.address,
          maxApprove ? MAX_VALUE : finalAmount.toString()
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [inputValue, maxApprove, epochStrikeToken, ssovContractWithSigner]);

  // Handle Exercise
  const handleExercise = useCallback(async () => {
    try {
      await newEthersTransaction(
        ssovContractWithSigner.exercise(
          strikeIndex,
          getContractReadableAmount(inputValue, 18).toString(),
          accountAddress
        )
      );
      updateSsovData(ssov === 'dpx' ? 'dpx' : 'rdpx');
      updateUserSsovData(ssov === 'dpx' ? 'dpx' : 'rdpx');
      updateUserEpochStrikeTokenBalance();
      setInputValue('');
      formik.setFieldValue('amount', '');
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovContractWithSigner,
    strikeIndex,
    inputValue,
    accountAddress,
    updateSsovData,
    updateUserSsovData,
    updateUserEpochStrikeTokenBalance,
    formik,
    ssov,
  ]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton className="p-0 pr-3 pb-1" onClick={handleClose}>
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Exercise</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz mb-2">
            Balance: {userEpochStrikeTokenBalance.toString()}
          </Typography>
          <Typography
            variant="h6"
            className="text-wave-blue uppercase mb-2 mr-2"
            role="button"
            onClick={handleMax}
          >
            Max
          </Typography>
        </Box>

        <Box className="bg-umbra rounded-md flex flex-col mb-4 p-4">
          <Box className="flex flex-row justify-between">
            <Box className="h-12 bg-cod-gray rounded-xl p-2 flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img src={'/assets/dpx.svg'} alt="DPX" />
              </Box>
              <Typography variant="h5" className="text-white">
                DoToken
              </Typography>
            </Box>
            <Input
              disableUnderline={true}
              id="amount"
              name="amount"
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={inputHandleChange}
              placeholder="0"
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              type="number"
              className="h-12 text-2xl text-white ml-2"
              classes={{ input: 'text-right' }}
            />
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
                Amount
              </Typography>
              <Typography variant="caption" component="div">
                {inputValue}
              </Typography>
            </Box>
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Estimated Rewards
              </Typography>
              <Typography variant="caption" component="div">
                {formatAmount(PnL, 5)} DPX
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
                {formatAmount(PnLPercent, 5)}%
              </Typography>
            </Box>
          </Box>
        </Box>
        {inputValue.length === 0 ||
        new BigNumber(inputValue).isZero() ||
        new BigNumber(inputValue).isGreaterThan(userEpochStrikeTokenBalance) ||
        strikePrice > currentPrice ? (
          <CustomButton size="xl" className="w-full mb-4" disabled>
            Exercise
          </CustomButton>
        ) : approved ? (
          <CustomButton
            size="xl"
            className="w-full mb-4"
            onClick={handleExercise}
          >
            Exercise
          </CustomButton>
        ) : (
          <Box className="flex flex-col">
            <MaxApprove value={maxApprove} setValue={setMaxApprove} />
            <Box className="flex flex-row mt-2">
              <CustomButton
                size="large"
                className="w-11/12 mr-1"
                onClick={handleApprove}
              >
                Approve
              </CustomButton>
              <CustomButton size="large" className="w-11/12 ml-1" disabled>
                Exercise
              </CustomButton>
            </Box>
          </Box>
        )}
        <Box className="flex flex-row justify-between mt-4">
          <Typography variant="h6" className="text-stieglitz">
            Epoch {selectedEpoch}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Exercise;
