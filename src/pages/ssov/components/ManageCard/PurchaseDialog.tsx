import { useCallback, useEffect, useContext, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { utils as ethersUtils, BigNumber } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import dpxIcon from 'assets/tokens/dpx.svg';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import { newEthersTransaction } from 'utils/contracts/transactions';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
}

const PurchaseDialog = ({ open, handleClose }: Props) => {
  const {
    ssovSdk,
    currentEpoch,
    currentEpochSsovData: { epochStrikes, epochStrikeTokens },
    updateCurrentEpochSsovData,
    dpxToken,
    dpxTokenPrice,
    ssovOptionPricingSdk,
    volatilityOracleContracts,
  } = useContext(SsovContext);
  const { updateAssetBalances } = useContext(AssetsContext);
  const { accountAddress } = useContext(WalletContext);
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);
  const [volatility, setVolatility] = useState(0);
  const [optionPricing, setOptionPricing] = useState(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [maxApprove, setMaxApprove] = useState(false);
  const [error, setError] = useState('');
  const [userDpxBalance, setUserDpxBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const strikes = epochStrikes.map((strike) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const epochStrikeToken =
    strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null;

  const [
    userEpochStrikePurchasableAmount,
    setUserEpochStrikePurchasableAmount,
  ] = useState(0);
  const updateUserEpochStrikePurchasableAmount = useCallback(async () => {
    if (!epochStrikeToken || !ssovSdk) {
      setUserEpochStrikePurchasableAmount(0);
      return;
    }
    const vaultEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      ssovSdk.call.address
    );
    setUserEpochStrikePurchasableAmount(
      getUserReadableAmount(vaultEpochStrikeTokenBalance, 18)
    );
  }, [epochStrikeToken, ssovSdk]);
  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  const currentPrice = getUserReadableAmount(dpxTokenPrice, 8);

  // Handle Input Amount
  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const premium = useMemo(() => {
    return ethersUtils.parseEther(
      ((optionPricing * formik.values.amount) / currentPrice).toString()
    );
  }, [optionPricing, currentPrice, formik.values.amount]);

  const inputHandleChange = useCallback(
    (e) => {
      formik.setFieldValue('amount', e.target.value);
    },
    [formik]
  );
  // Handles isApproved
  useEffect(() => {
    if (!dpxToken || !ssovSdk) return;
    (async function () {
      const finalAmount = premium;

      const userDpxAmount = await dpxToken.balanceOf(accountAddress);

      setUserDpxBalance(userDpxAmount);

      let allowance = await dpxToken.allowance(
        accountAddress,
        ssovSdk.call.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [accountAddress, premium, dpxToken, ssovSdk]);

  useEffect(() => {
    if (premium.gt(userDpxBalance)) {
      setError('Purchase amount exceeds balance');
    } else {
      setError('');
    }
  }, [premium, userDpxBalance, userEpochStrikePurchasableAmount]);

  const handleApprove = useCallback(async () => {
    const finalAmount = premium;
    try {
      await newEthersTransaction(
        dpxToken.approve(
          ssovSdk.call.address,
          maxApprove ? MAX_VALUE : finalAmount
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [premium, maxApprove, dpxToken, ssovSdk]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    const finalAmount = ethersUtils.parseEther(String(formik.values.amount));
    try {
      await newEthersTransaction(
        ssovSdk.send.purchase(strikeIndex, finalAmount)
      );
      updateCurrentEpochSsovData();
      updateUserEpochStrikePurchasableAmount();
      updateAssetBalances();
      formik.setFieldValue('amount', 0);
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovSdk,
    strikeIndex,
    updateCurrentEpochSsovData,
    updateUserEpochStrikePurchasableAmount,
    updateAssetBalances,
    formik,
  ]);

  // Calculate the Option Pricing
  const updateOptionPricing = useCallback(async () => {
    if (
      strikeIndex === null ||
      !ssovOptionPricingSdk ||
      !volatilityOracleContracts
    )
      return;

    const strike = epochStrikes[strikeIndex];
    try {
      const expiry = await ssovSdk.call.getMonthlyExpiryFromTimestamp(
        Math.floor(Date.now() / 1000)
      );

      const volatility = await volatilityOracleContracts.call.getVolatility();
      const optionPricing = await ssovOptionPricingSdk.call.getOptionPrice(
        false,
        expiry,
        strike,
        dpxTokenPrice,
        volatility
      );
      setVolatility(volatility.toNumber());
      setOptionPricing(getUserReadableAmount(optionPricing, 8));
    } catch (err) {
      console.log(err);
    }
  }, [
    strikeIndex,
    epochStrikes,
    ssovSdk,
    ssovOptionPricingSdk,
    volatilityOracleContracts,
    dpxTokenPrice,
  ]);

  useEffect(() => {
    updateOptionPricing();
  }, [updateOptionPricing]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton className="p-0 pr-3 pb-1" onClick={handleClose}>
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Purchase</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz mb-2">
            Balance:{' '}
            <Typography variant="caption" component="span">
              {formatAmount(getUserReadableAmount(userDpxBalance, 18))} DPX
            </Typography>
          </Typography>
          <Typography variant="h6" className="text-stieglitz mb-2">
            Option Size
          </Typography>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col mb-4 p-4">
          <Box className="flex flex-row justify-between mb-4">
            <Box className="h-12 bg-cod-gray rounded-xl p-2 flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img src={dpxIcon} alt="DPX" />
              </Box>
              <Typography variant="h5" className="text-white">
                DPX
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
          <Box className="flex flex-row mb-4">
            <Typography variant="h6" className="mr-2 text-stieglitz">
              Select Strike Prices
            </Typography>
          </Box>
          <Box className="flex  justify-center">
            <Select
              id="strike"
              name="strike"
              value={strikeIndex || -1}
              onChange={(e) => setStrikeIndex(Number(e.target.value))}
              className="bg-mineshaft rounded-md p-1 text-white"
              fullWidth
              disableUnderline
              renderValue={(selected) => {
                return (
                  <Typography
                    variant="h6"
                    className="text-white text-center w-full relative"
                  >
                    {strikeIndex !== null
                      ? `$${strikes[strikeIndex]}`
                      : 'Strike Price'}
                  </Typography>
                );
              }}
              classes={{ icon: 'absolute right-20 text-white' }}
              label="strikes"
            >
              {strikes.map((strike, index) => (
                <MenuItem key={index} value={index}>
                  <ListItemText primary={strike} />
                </MenuItem>
              ))}
            </Select>
          </Box>
          {error ? (
            <Typography
              variant="caption"
              component="div"
              className="text-down-bad text-left mt-5"
            >
              {error}
            </Typography>
          ) : null}
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col mb-4 p-4">
          <Box className="flex flex-col">
            <Box className="flex flex-row justify-between mb-4">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Current Price (DPX)
              </Typography>
              <Typography variant="caption" component="div">
                ${currentPrice.toFixed(2)}
              </Typography>
            </Box>

            {strikeIndex !== null && (
              <>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Available
                  </Typography>
                  <Typography variant="caption" component="div">
                    {formatAmount(userEpochStrikePurchasableAmount, 5)}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Strike Price
                  </Typography>
                  <Typography variant="caption" component="div">
                    ${strikes[strikeIndex]}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Amount
                  </Typography>
                  <Typography variant="caption" component="div">
                    {formik.values.amount}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Volatility
                  </Typography>
                  <Typography variant="caption" component="div">
                    {volatility}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Option Price
                  </Typography>
                  <Typography variant="caption" component="div">
                    ${formatAmount(optionPricing, 5)}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Total Cost
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-wave-blue"
                  >
                    {formatAmount(getUserReadableAmount(premium, 18), 5)} DPX
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        {strikeIndex === null ||
        formik.values.amount === 0 ||
        formik.values.amount > userEpochStrikePurchasableAmount ? (
          <CustomButton size="xl" className="w-full mb-4" disabled>
            Purchase
          </CustomButton>
        ) : approved ? (
          <CustomButton
            size="xl"
            className="w-full mb-4"
            onClick={handlePurchase}
          >
            Purchase
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
                Purchase
              </CustomButton>
            </Box>
          </Box>
        )}
        <Box className="flex flex-row justify-between mt-4">
          <Typography variant="h6" component="div" className="text-stieglitz">
            Epoch {currentEpoch}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PurchaseDialog;
