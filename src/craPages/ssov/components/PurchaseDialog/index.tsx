import { useCallback, useEffect, useContext, useState, useMemo } from 'react';
import { useFormik } from 'formik';
import { utils as ethersUtils, BigNumber } from 'ethers';
import * as yup from 'yup';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';

import { WalletContext } from 'contexts/Wallet';
import {
  SsovContext,
  SsovProperties,
  SsovData,
  UserSsovData,
} from 'contexts/Ssov';
import { AssetsContext } from 'contexts/Assets';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  ssovProperties: SsovProperties;
  userSsovData: UserSsovData;
  ssovData: SsovData;
}

const PurchaseDialog = ({
  open,
  handleClose,
  ssovProperties,
  ssovData,
  userSsovData,
}: Props) => {
  const { updateSsovData, updateUserSsovData, selectedSsov, ssovSignerArray } =
    useContext(SsovContext);
  const { updateAssetBalances, userAssetBalances } = useContext(AssetsContext);
  const { accountAddress } = useContext(WalletContext);

  const {
    currentEpoch,
    tokenPrice,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenName,
  } = ssovProperties;
  const { ssovContractWithSigner, token } =
    ssovSignerArray !== undefined
      ? ssovSignerArray[selectedSsov]
      : { ssovContractWithSigner: null, token: null };
  const { epochStrikes } = ssovData;
  const { epochStrikeTokens } = userSsovData;

  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    totalCost: BigNumber.from(0),
  });
  const [strikeIndex, setStrikeIndex] = useState<number | null>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [
    userEpochStrikePurchasableAmount,
    setUserEpochStrikePurchasableAmount,
  ] = useState(0);

  const tokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const epochStrikeToken = useMemo(
    () => (strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null),
    [strikeIndex, epochStrikeTokens]
  );

  const updateUserEpochStrikePurchasableAmount = useCallback(async () => {
    if (!epochStrikeToken || !ssovContractWithSigner) {
      setUserEpochStrikePurchasableAmount(0);
      return;
    }
    const vaultEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      ssovContractWithSigner.address
    );
    setUserEpochStrikePurchasableAmount(
      getUserReadableAmount(vaultEpochStrikeTokenBalance, 18)
    );
  }, [epochStrikeToken, ssovContractWithSigner]);

  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      amount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    }),
    validate: () => {
      const errors: any = {};
      if (state.totalCost.gt(userTokenBalance)) {
        errors.amount = `Insufficient ${tokenSymbol} balance to pay for premium.`;
      }
      return errors;
    },
    onSubmit: noop,
  });

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;

      const userAmount =
        tokenName === 'ETH'
          ? BigNumber.from(userAssetBalances.ETH)
          : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = await token.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH') {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    tokenName,
    userAssetBalances.ETH,
  ]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(token.approve(ssovContractWithSigner.address, MAX_VALUE));
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [token, ssovContractWithSigner]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    const finalAmount = ethersUtils.parseEther(String(formik.values.amount));
    try {
      if (tokenName === 'ETH') {
        await sendTx(
          ssovContractWithSigner.purchase(
            strikeIndex,
            finalAmount,
            accountAddress,
            {
              value: state.totalCost,
            }
          )
        );
      } else {
        await sendTx(
          ssovContractWithSigner.purchase(
            strikeIndex,
            finalAmount,
            accountAddress
          )
        );
      }
      updateSsovData();
      updateUserSsovData();
      updateUserEpochStrikePurchasableAmount();
      updateAssetBalances();
      formik.setFieldValue('amount', 0);
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovContractWithSigner,
    strikeIndex,
    updateSsovData,
    updateUserSsovData,
    updateUserEpochStrikePurchasableAmount,
    updateAssetBalances,
    formik,
    accountAddress,
    tokenName,
    state.totalCost,
  ]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;

      const userAmount =
        tokenName === 'ETH'
          ? BigNumber.from(userAssetBalances.ETH)
          : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = await token.allowance(
        accountAddress,
        ssovContractWithSigner.address
      );

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (tokenName === 'ETH') {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    tokenName,
    userAssetBalances.ETH,
  ]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      strikeIndex === null ||
      !ssovContractWithSigner ||
      !ssovOptionPricingContract ||
      !volatilityOracleContract
    )
      return;

    async function updateOptionPrice() {
      const strike = epochStrikes[strikeIndex];
      try {
        const expiry =
          await ssovContractWithSigner.getMonthlyExpiryFromTimestamp(
            Math.floor(Date.now() / 1000)
          );

        const volatility = (
          await volatilityOracleContract.getVolatility()
        ).toNumber();

        const optionPrice = await ssovOptionPricingContract.getOptionPrice(
          false,
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        const premium = optionPrice
          .mul(ethersUtils.parseEther(String(formik.values.amount)))
          .div(tokenPrice);

        const fees = await ssovContractWithSigner.calculateFees(
          premium,
          tokenPrice,
          true
        );

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          totalCost: premium.add(fees),
        });
      } catch (err) {
        console.log(err);
      }
    }

    updateOptionPrice();
  }, [
    strikeIndex,
    epochStrikes,
    ssovContractWithSigner,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenPrice,
    formik.values.amount,
  ]);
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
            Available:{' '}
            <Typography variant="caption" component="span">
              {userEpochStrikePurchasableAmount === 0
                ? '-'
                : `${userEpochStrikePurchasableAmount.toString()}`}
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
                <img
                  src={SSOV_MAP[ssovProperties.tokenName].imageSrc}
                  alt={tokenSymbol}
                />
              </Box>
              <Typography variant="h5" className="text-white">
                {tokenSymbol}
              </Typography>
            </Box>
            <Input
              disableUnderline
              id="amount"
              name="amount"
              placeholder="0"
              type="number"
              className="h-12 text-2xl text-white ml-2"
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
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
              value={strikeIndex}
              onChange={(e) => setStrikeIndex(Number(e.target.value))}
              className="bg-mineshaft rounded-md p-1 text-white"
              fullWidth
              disableUnderline
              renderValue={() => {
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
              classes={{
                icon: 'absolute right-20 text-white',
              }}
              MenuProps={{ classes: { paper: 'bg-umbra' } }}
              label="strikes"
            >
              {strikes.map((strike, index) => (
                <MenuItem key={index} value={index} className="text-white">
                  <ListItemText primary={strike} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col mb-4 p-4">
          <Box className="flex flex-col">
            <Box className="flex flex-row justify-between mb-4">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Oracle Price ({tokenSymbol})
              </Typography>
              <Typography variant="caption" component="div">
                ${formatAmount(getUserReadableAmount(tokenPrice, 8), 3)}
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
                    {state.volatility}
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
                    $
                    {formatAmount(
                      getUserReadableAmount(state.optionPrice, 8),
                      3
                    )}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Fees
                  </Typography>
                  <Typography variant="caption" component="div">
                    $
                    {formatAmount(
                      getUserReadableAmount(state.fees.mul(tokenPrice), 26),
                      3
                    )}
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between mb-4">
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
                    {formatAmount(
                      getUserReadableAmount(state.totalCost, 18),
                      3
                    )}{' '}
                    {tokenSymbol} ($
                    {formatAmount(
                      getUserReadableAmount(
                        state.totalCost.mul(tokenPrice),
                        26
                      ),
                      3
                    )}
                    )
                  </Typography>
                </Box>
                <Box className="flex flex-row justify-between">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Your Balance
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-wave-blue"
                  >
                    {formatAmount(
                      getUserReadableAmount(userTokenBalance, 18),
                      3
                    )}{' '}
                    {tokenSymbol}
                  </Typography>
                </Box>
                {formik.errors.amount ? (
                  <Box>
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-down-bad text-left mt-5"
                    >
                      {formik.errors.amount}
                    </Typography>
                  </Box>
                ) : null}
              </>
            )}
          </Box>
        </Box>
        {strikeIndex === null ? null : (
          <Box className="p-4 bg-umbra mb-4 rounded-md">
            <PnlChart
              breakEven={
                Number(strikes[strikeIndex]) +
                getUserReadableAmount(state.optionPrice, 8)
              }
              optionPrice={getUserReadableAmount(state.optionPrice, 8)}
              amount={formik.values.amount}
              isPut={false}
              price={getUserReadableAmount(tokenPrice, 8)}
              symbol={tokenSymbol}
            />
          </Box>
        )}
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
