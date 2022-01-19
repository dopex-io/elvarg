import { useEffect, useContext, useState, useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import * as yup from 'yup';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import debounce from 'lodash/debounce';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import {
  SsovContext,
  SsovProperties,
  SsovData,
  UserSsovData,
} from 'contexts/Ssov';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';
import format from 'date-fns/format';
import Menu from '@material-ui/core/Menu';
import { Addresses, ERC20, ERC20__factory } from '@dopex-io/sdk';
import ZapIn from '../../../../components/ZapIn';
import { useDebounce } from 'use-debounce';
import axios from 'axios';

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
  userSsovData,
  ssovData,
}: Props) => {
  const { updateSsovData, updateUserSsovData, selectedSsov, ssovSignerArray } =
    useContext(SsovContext);
  const { updateAssetBalances, userAssetBalances, tokens } =
    useContext(AssetsContext);
  const { accountAddress, provider, chainId } = useContext(WalletContext);
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovProperties.tokenName)
      ? ssovProperties.tokenName
      : ssovSignerArray[selectedSsov].token[0]
  );
  const ssovToken = ssovSignerArray[selectedSsov].token[0];
  const [estimatedGasCost, setEstimatedGasCost] = useState<number>(0);
  const { tokenPrice, ssovOptionPricingContract, volatilityOracleContract } =
    ssovProperties;
  const { ssovContractWithSigner } =
    ssovSignerArray !== undefined
      ? ssovSignerArray[selectedSsov]
      : { ssovContractWithSigner: null };

  const { epochStrikes } = ssovData;

  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    expiry: 0,
    totalCost: BigNumber.from(0),
  });
  const [strikeIndex, setStrikeIndex] = useState<number | null>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);
  const [
    userEpochStrikePurchasableAmount,
    setUserEpochStrikePurchasableAmount,
  ] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ssovTokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;
  const ssovTokenName = ssovProperties.tokenName;
  const [tokenName, setTokenName] = useState<string>(ssovTokenSymbol);
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const isZapActive = tokenName.toUpperCase() !== ssovTokenSymbol.toUpperCase();
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const purchasePower =
    isZapActive && quote['toToken']
      ? getUserReadableAmount(
          quote['toTokenAmount'],
          quote['toToken']['decimals']
        ) /
        (1 + slippageTolerance / 100)
      : getUserReadableAmount(userTokenBalance, 18);
  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const { epochStrikeTokens } = userSsovData;

  const epochStrikeToken = useMemo(
    () => (strikeIndex !== null ? epochStrikeTokens[strikeIndex] : null),
    [strikeIndex, epochStrikeTokens]
  );

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    await getQuote();
  };

  const updateUserEpochStrikePurchasableAmount = async () => {
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
  };

  const formik = useFormik({
    initialValues: {
      optionsAmount: 1,
      zapInAmount: 1,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      optionsAmount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    }),
    validate: () => {
      const errors: any = {};
      if (state.totalCost.gt(userTokenBalance)) {
        errors.amount = `Insufficient ${tokenName} balance to pay for premium.`;
      }
      return errors;
    },
    onSubmit: noop,
  });

  const isLiquidityEnough =
    formik.values.optionsAmount < userEpochStrikePurchasableAmount;
  const isPurchasePowerEnough =
    purchasePower >= getUserReadableAmount(state.totalCost, 18);

  const debouncedZapInAmount = useDebounce(formik.values.zapInAmount, 1000);
  const [latestZapInAmount, setLatestZapInAmount] = useState<number>(0);

  const getQuote = async () => {
    const fromTokenAddress = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const fromTokenDecimals = IS_NATIVE(token) ? 18 : await token.decimals();
    const toTokenAddress = IS_NATIVE(ssovTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    if (fromTokenAddress === toTokenAddress) return;
    if (debouncedZapInAmount[0] === 0) {
      setQuote({});
      return;
    }
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${BigInt(
        debouncedZapInAmount[0] * 10 ** fromTokenDecimals
      )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );
    setQuote(data);
  };

  const getPriceImpact = async () => {
    const fromTokenAddress = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const fromTokenDecimals = IS_NATIVE(token) ? 18 : await token.decimals();
    const toTokenAddress = IS_NATIVE(ssovTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    if (fromTokenAddress === toTokenAddress) return;
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${BigInt(
        10 ** fromTokenDecimals
      )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );
    const quotePrice = quote['toTokenAmount'] / quote['fromTokenAmount'];
    const dataPrice = data['toTokenAmount'] / data['fromTokenAmount'];
    setPriceImpact(
      100 *
        (Math.min(quotePrice, dataPrice) / Math.max(quotePrice, dataPrice) - 1)
    );
  };

  const getPath = async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress = IS_NATIVE(ssovTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    const fromTokenDecimals = IS_NATIVE(token) ? 18 : await token.decimals();
    if (fromTokenAddress === ssovToken.address) return;
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${BigInt(
        debouncedZapInAmount[0] * 10 ** fromTokenDecimals
      )}&fromAddress=${accountAddress}&slippage=${slippageTolerance}&disableEstimate=true`
    );
    setPath(data);
    setIsFetchingPath(false);
  };

  const openZapIn = async () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = tokens.filter(function (item) {
        return item !== ssovTokenSymbol && Addresses[chainId][item];
      });
      const randomToken = ERC20__factory.connect(
        Addresses[chainId][
          filteredTokens[Math.floor(Math.random() * filteredTokens.length)]
        ],
        provider
      );
      setToken(randomToken);
      setIsZapInVisible(true);
    }
  };

  const updateEstimatedGasCost = async () => {
    const feeData = await provider.getFeeData();
    setEstimatedGasCost(700000 * feeData['gasPrice'].toNumber());
  };

  const handleApprove = async () => {
    try {
      const routerAddress = isZapActive
        ? Addresses[chainId]['SSOV'][ssovTokenName]['Router']
        : ssovContractWithSigner.address;
      await sendTx(token.approve(routerAddress, MAX_VALUE));
      setTimeout(checkAllowance, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePurchase = async () => {
    const finalAmount = ethersUtils.parseEther(
      String(formik.values.optionsAmount)
    );
    try {
      if (IS_NATIVE(token)) {
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
        // TODO: to implement
      }
      await updateSsovData();
      await updateUserSsovData();
      await updateAssetBalances();
      formik.setFieldValue('optionsAmount', 1);
    } catch (err) {
      console.log(err);
    }
  };

  const checkAllowance = async () => {
    const finalAmount = state.totalCost;

    const userAmount = IS_NATIVE(token)
      ? BigNumber.from(userAssetBalances.ETH)
      : await token.balanceOf(accountAddress);

    setUserTokenBalance(userAmount);

    let allowance = IS_NATIVE(token)
      ? BigNumber.from(0)
      : await token.allowance(accountAddress, ssovContractWithSigner.address);

    if (finalAmount.lte(allowance) && !allowance.eq(0)) {
      setApproved(true);
    } else {
      if (IS_NATIVE(token)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  };

  const setMaxAmount = async () => {
    const strike = epochStrikes[strikeIndex];
    const fees = await ssovContractWithSigner.calculatePurchaseFees(
      tokenPrice,
      strike,
      ethersUtils.parseEther(String(1))
    );
    let amount =
      (purchasePower /
        (getUserReadableAmount(fees, 18) +
          getUserReadableAmount(state.optionPrice, 8) /
            getUserReadableAmount(tokenPrice, 8))) *
      0.99;
    formik.setFieldValue('optionsAmount', amount.toFixed(2));
  };

  useEffect(() => {
    getPriceImpact();
  }, [quote]);

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [strikeIndex]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    checkAllowance();
  }, [
    accountAddress,
    state.totalCost,
    token,
    ssovContractWithSigner,
    userAssetBalances.ETH,
  ]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      strikeIndex === null ||
      !ssovContractWithSigner ||
      !ssovOptionPricingContract ||
      !volatilityOracleContract ||
      formik.values.optionsAmount === 0 ||
      formik.values.optionsAmount.toString() === ''
    ) {
      setState((prev) => ({
        ...prev,
        volatility: 0,
        optionPrice: BigNumber.from(0),
        fees: BigNumber.from(0),
        premium: BigNumber.from(0),
        expiry: 0,
        totalCost: BigNumber.from(0),
      }));
      return;
    }

    setIsPurchaseStatsLoading(true);

    async function updateOptionPrice() {
      const strike = epochStrikes[strikeIndex];
      try {
        const expiry =
          await ssovContractWithSigner.getMonthlyExpiryFromTimestamp(
            Math.floor(Date.now() / 1000)
          );

        let volatility;
        if (ssovTokenName === 'ETH') {
          const _abi = [
            'function getVolatility(uint256) view returns (uint256)',
          ];
          const _temp = new ethers.Contract(
            '0x87209686d0f085fD35B084410B99241Dbc03fb4f',
            _abi,
            provider
          );
          volatility = (await _temp.getVolatility(strike)).toNumber();
        } else {
          volatility = (
            await volatilityOracleContract.getVolatility()
          ).toNumber();
        }

        const optionPrice = await ssovOptionPricingContract.getOptionPrice(
          false,
          expiry,
          strike,
          tokenPrice,
          volatility
        );

        const premium = optionPrice
          .mul(ethersUtils.parseEther(String(formik.values.optionsAmount)))
          .div(tokenPrice);

        const fees = await ssovContractWithSigner.calculatePurchaseFees(
          tokenPrice,
          strike,
          ethersUtils.parseEther(String(formik.values.optionsAmount))
        );

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost: premium.add(fees),
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        setIsPurchaseStatsLoading(false);
      }
    }
    debounce(async () => await updateOptionPrice(), 500)();
  }, [
    strikeIndex,
    epochStrikes,
    ssovContractWithSigner,
    ssovOptionPricingContract,
    volatilityOracleContract,
    tokenPrice,
    formik.values.optionsAmount,
    provider,
    ssovTokenName,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner) return;
    (async function () {
      const finalAmount = state.totalCost;

      const userAmount = IS_NATIVE(token)
        ? BigNumber.from(userAssetBalances.ETH)
        : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(token)
        ? BigNumber.from(0)
        : await token.allowance(accountAddress, ssovContractWithSigner.address);

      if (finalAmount.lte(allowance) && !allowance.eq(0)) {
        setApproved(true);
      } else {
        if (IS_NATIVE(token)) {
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
    userAssetBalances.ETH,
  ]);

  useEffect(() => {
    updateEstimatedGasCost();
  }, [accountAddress]);

  useEffect(() => {
    getPath();
  }, [isZapInVisible]);

  useEffect(() => {
    if (debouncedZapInAmount[0] !== latestZapInAmount) {
      getQuote();
      setLatestZapInAmount(debouncedZapInAmount[0]);
    }
  }, [debouncedZapInAmount]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded m-0' }}
    >
      {!isZapInVisible && (
        <Box>
          <Box className="flex flex-row items-center mb-4">
            <Typography variant="h5">Buy Call Option</Typography>
            {isZapActive && (
              <Box
                className="rounded-md flex r-0 ml-auto p-1.5 border border-neutral-800 bg-neutral-700 cursor-pointer hover:bg-neutral-600"
                onClick={() => {
                  if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
                  else setToken(ssovToken);
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2.5 mt-0.5"
                >
                  <path
                    d="M7.99989 0.514648C3.86739 0.514648 0.514893 3.86715 0.514893 7.99965C0.514893 12.1321 3.86739 15.4846 7.99989 15.4846C12.1324 15.4846 15.4849 12.1321 15.4849 7.99965C15.4849 3.86715 12.1324 0.514648 7.99989 0.514648Z"
                    fill="url(#paint0_linear_1773_40187)"
                  />
                  <path
                    d="M5.46553 11.5537L7.01803 8.86466L5.29031 7.86716C5.04999 7.72841 5.03761 7.37485 5.27827 7.22801L10.3573 3.95096C10.6829 3.73194 11.0803 4.1086 10.8816 4.45285L9.3103 7.17433L10.9601 8.12683C11.2004 8.26558 11.21 8.6089 10.9824 8.76324L6.00008 12.0528C5.66419 12.2746 5.26678 11.8979 5.46553 11.5537Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1773_40187"
                      x1="15.4849"
                      y1="17.6232"
                      x2="0.399917"
                      y2="0.616632"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#002EFF" />
                      <stop offset="1" stopColor="#22E1FF" />
                    </linearGradient>
                  </defs>
                </svg>

                <Typography variant="h6" className="text-white text-xs">
                  Zap Out
                </Typography>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-3 mr-1 mt-0.5"
                >
                  <path
                    d="M6.00002 0.166748C2.77419 0.166748 0.166687 2.77425 0.166687 6.00008C0.166687 9.22592 2.77419 11.8334 6.00002 11.8334C9.22585 11.8334 11.8334 9.22592 11.8334 6.00008C11.8334 2.77425 9.22585 0.166748 6.00002 0.166748ZM8.50835 8.50842C8.28085 8.73592 7.91335 8.73592 7.68585 8.50842L6.00002 6.82258L4.31419 8.50842C4.08669 8.73592 3.71919 8.73592 3.49169 8.50842C3.26419 8.28092 3.26419 7.91342 3.49169 7.68592L5.17752 6.00008L3.49169 4.31425C3.26419 4.08675 3.26419 3.71925 3.49169 3.49175C3.71919 3.26425 4.08669 3.26425 4.31419 3.49175L6.00002 5.17758L7.68585 3.49175C7.91335 3.26425 8.28085 3.26425 8.50835 3.49175C8.73585 3.71925 8.73585 4.08675 8.50835 4.31425L6.82252 6.00008L8.50835 7.68592C8.73002 7.90758 8.73002 8.28092 8.50835 8.50842Z"
                    fill="#8E8E8E"
                  />
                </svg>
              </Box>
            )}

            <IconButton
              className={
                isZapActive
                  ? 'p-0 pb-1 mr-0 mt-0.5 ml-4'
                  : 'p-0 pb-1 mr-0 mt-0.5 ml-auto'
              }
              onClick={handleClose}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3002 0.709727C12.9102 0.319727 12.2802 0.319727 11.8902 0.709727L7.00022 5.58973L2.11022 0.699727C1.72022 0.309727 1.09021 0.309727 0.700215 0.699727C0.310215 1.08973 0.310215 1.71973 0.700215 2.10973L5.59022 6.99973L0.700215 11.8897C0.310215 12.2797 0.310215 12.9097 0.700215 13.2997C1.09021 13.6897 1.72022 13.6897 2.11022 13.2997L7.00022 8.40973L11.8902 13.2997C12.2802 13.6897 12.9102 13.6897 13.3002 13.2997C13.6902 12.9097 13.6902 12.2797 13.3002 11.8897L8.41021 6.99973L13.3002 2.10973C13.6802 1.72973 13.6802 1.08973 13.3002 0.709727Z"
                  fill="#3E3E3E"
                />
              </svg>
            </IconButton>
          </Box>

          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
                <Box className="flex flex-row h-10 w-10">
                  <img
                    src={SSOV_MAP[ssovProperties.tokenName].imageSrc}
                    alt={ssovTokenSymbol}
                  />
                </Box>
              </Box>
              <Box
                className="bg-mineshaft hover:bg-neutral-700 flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
                onClick={setMaxAmount}
              >
                <Typography variant="caption" component="div">
                  <span className="text-stieglitz pl-2.5 pr-2.5">MAX</span>
                </Typography>
              </Box>
              <Input
                disableUnderline
                id="optionsAmount"
                name="optionsAmount"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={formik.values.optionsAmount}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.optionsAmount &&
                  Boolean(formik.errors.optionsAmount)
                }
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box className="flex">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2"
                >
                  Balance:{' '}
                  <span className="text-white">
                    {formatAmount(
                      getUserReadableAmount(userTokenBalance, 18),
                      3
                    )}{' '}
                    {isZapActive && <span>{tokenName} </span>}
                  </span>
                </Typography>
                {isZapActive && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-3 ml-1"
                  >
                    <path
                      d="M6.00001 0.178345C2.78584 0.178345 0.178345 2.78584 0.178345 6.00001C0.178345 9.21418 2.78584 11.8217 6.00001 11.8217C9.21418 11.8217 11.8217 9.21418 11.8217 6.00001C11.8217 2.78584 9.21418 0.178345 6.00001 0.178345Z"
                      fill="url(#paint0_linear_1600_23889)"
                    />
                    <path
                      d="M4.02883 8.76422L5.23633 6.67277L3.89254 5.89694C3.70563 5.78902 3.696 5.51403 3.88318 5.39982L7.8335 2.85101C8.08677 2.68065 8.39587 2.97362 8.24129 3.24136L7.0192 5.35807L8.30236 6.09891C8.48928 6.20682 8.49677 6.47384 8.31969 6.59389L4.44458 9.15245C4.18334 9.32493 3.87424 9.03197 4.02883 8.76422Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1600_23889"
                        x1="11.8217"
                        y1="13.485"
                        x2="0.0889196"
                        y2="0.257665"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#002EFF" />
                        <stop offset="1" stopColor="#22E1FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </Box>
              <Box className="ml-auto mr-0">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2 pr-3"
                >
                  Option Size
                </Typography>
              </Box>
            </Box>
          </Box>

          {isChartVisible ? (
            <Box className="p-3 bg-cod-gray mb-4 rounded-md border border-neutral-800 ">
              <PnlChart
                breakEven={
                  Number(strikes[strikeIndex]) +
                  getUserReadableAmount(state.optionPrice, 8)
                }
                optionPrice={getUserReadableAmount(state.optionPrice, 8)}
                amount={formik.values.optionsAmount}
                isPut={false}
                price={getUserReadableAmount(tokenPrice, 8)}
                symbol={ssovTokenSymbol}
              />
            </Box>
          ) : (
            <Box>
              <Box className={'flex'}>
                <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                  <Box className={'w-5/6'}>
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      ${strikes[strikeIndex]}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
                      Strike Price
                    </Typography>
                  </Box>
                  <Box className="bg-mineshaft hover:bg-neutral-700 rounded-md items-center w-1/6 h-fit clickable">
                    <IconButton
                      className="p-0"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      {anchorEl ? (
                        <ArrowDropUpIcon
                          className={'fill-gray-100 h-50 pl-0.5'}
                        />
                      ) : (
                        <ArrowDropDownIcon
                          className={'fill-gray-100 h-50 pl-0.5'}
                        />
                      )}
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      classes={{ paper: 'bg-umbra' }}
                      className="mt-12"
                    >
                      {strikes.map((strike, strikeIndex) => (
                        <MenuItem
                          key={strikeIndex}
                          className="capitalize text-white cursor-default hover:bg-mineshaft cursor-pointer"
                          onClick={() => {
                            setStrikeIndex(strikeIndex);
                            setAnchorEl(null);
                          }}
                        >
                          ${strike}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
                <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                  <Typography variant="h5" className="text-white pb-1 pr-2">
                    {state.expiry
                      ? format(new Date(state.expiry * 1000), 'd LLL yyyy')
                      : '-'}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                    Expiry
                  </Typography>
                </Box>
              </Box>

              <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Breakeven
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      $
                      {formatAmount(
                        Number(strikes[strikeIndex]) +
                          getUserReadableAmount(state.optionPrice, 8),
                        2
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Option Price
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      $
                      {formatAmount(
                        getUserReadableAmount(state.optionPrice, 8),
                        2
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Side
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      Call
                    </Typography>
                  </Box>
                </Box>

                <Box className={'flex'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    IV
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {state.volatility}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          <Box className="flex mt-7 mb-5">
            <svg
              className={
                isChartVisible
                  ? 'ml-auto mr-3 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
                  : 'ml-auto mr-3 h-5 w-5 fill-white stroke-white cursor-pointer'
              }
              onClick={() => setIsChartVisible(false)}
            >
              <circle cx="5" cy="5" r="4" />
            </svg>
            <svg
              className={
                isChartVisible
                  ? 'mr-auto ml-0 h-5 w-5 fill-white stroke-white cursor-pointer'
                  : 'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
              }
              onClick={() => setIsChartVisible(true)}
            >
              <circle cx="5" cy="5" r="4" />
            </svg>
          </Box>

          {!isLiquidityEnough && (
            <Box className="text-center mb-4">
              <Typography
                variant="h6"
                className="text-red-500 font-medium pl-14 pr-14"
              >
                Your order exceeds available liquidity for this strike price.
              </Typography>
            </Box>
          )}

          <Box className="rounded-xl p-4 border border-neutral-800 w-full  bg-umbra">
            <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Option Size
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {formatAmount(formik.values.optionsAmount, 0)}
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Total ($)
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    $
                    {formatAmount(
                      getUserReadableAmount(state.optionPrice, 8) *
                        formik.values.optionsAmount,
                      0
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Fees ($)
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    $
                    {formatAmount(
                      getUserReadableAmount(state.fees.mul(tokenPrice), 26),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box className={'flex mb-2'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Total
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {formatAmount(
                      getUserReadableAmount(state.totalCost, 18),
                      5
                    )}{' '}
                    {ssovTokenSymbol}
                  </Typography>
                </Box>
              </Box>

              {isZapActive && (
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Purchase Power
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(purchasePower, 5)} {ssovTokenSymbol}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box className={'flex'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto flex"
                >
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-1.5 mr-2"
                  >
                    <path
                      d="M11.1801 2.82L11.1867 2.81333L9.06008 0.686667C8.86675 0.493333 8.54675 0.493333 8.35341 0.686667C8.16008 0.88 8.16008 1.2 8.35341 1.39333L9.40675 2.44667C8.70675 2.71333 8.23341 3.42667 8.35341 4.25333C8.46008 4.98667 9.08675 5.58 9.82008 5.66C10.1334 5.69333 10.4067 5.64 10.6667 5.52667V10.3333C10.6667 10.7 10.3667 11 10.0001 11C9.63342 11 9.33342 10.7 9.33342 10.3333V7.33333C9.33342 6.6 8.73341 6 8.00008 6H7.33342V1.33333C7.33342 0.6 6.73342 0 6.00008 0H2.00008C1.26675 0 0.666748 0.6 0.666748 1.33333V11.3333C0.666748 11.7 0.966748 12 1.33341 12H6.66675C7.03341 12 7.33342 11.7 7.33342 11.3333V7H8.33342V10.24C8.33342 11.1133 8.96008 11.9067 9.82675 11.9933C10.8267 12.0933 11.6667 11.3133 11.6667 10.3333V4C11.6667 3.54 11.4801 3.12 11.1801 2.82ZM6.00008 4.66667H2.00008V2C2.00008 1.63333 2.30008 1.33333 2.66675 1.33333H5.33342C5.70008 1.33333 6.00008 1.63333 6.00008 2V4.66667ZM10.0001 4.66667C9.63342 4.66667 9.33342 4.36667 9.33342 4C9.33342 3.63333 9.63342 3.33333 10.0001 3.33333C10.3667 3.33333 10.6667 3.63333 10.6667 4C10.6667 4.36667 10.3667 4.66667 10.0001 4.66667Z"
                      fill="#6DFFB9"
                    />
                  </svg>{' '}
                  Est. Gas Cost
                </Typography>
                <Box className={'text-right'}>
                  <Typography
                    variant="h6"
                    className="text-white mr-auto ml-0 flex"
                  >
                    ⧫{' '}
                    {formatAmount(
                      getUserReadableAmount(estimatedGasCost, 18),
                      5
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700 cursor-pointer hover:bg-neutral-600"
              onClick={openZapIn}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 mt-0.5"
              >
                <path
                  d="M7.99989 0.514648C3.86739 0.514648 0.514893 3.86715 0.514893 7.99965C0.514893 12.1321 3.86739 15.4846 7.99989 15.4846C12.1324 15.4846 15.4849 12.1321 15.4849 7.99965C15.4849 3.86715 12.1324 0.514648 7.99989 0.514648Z"
                  fill="url(#paint0_linear_1773_40187)"
                />
                <path
                  d="M5.46553 11.5537L7.01803 8.86466L5.29031 7.86716C5.04999 7.72841 5.03761 7.37485 5.27827 7.22801L10.3573 3.95096C10.6829 3.73194 11.0803 4.1086 10.8816 4.45285L9.3103 7.17433L10.9601 8.12683C11.2004 8.26558 11.21 8.6089 10.9824 8.76324L6.00008 12.0528C5.66419 12.2746 5.26678 11.8979 5.46553 11.5537Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1773_40187"
                    x1="15.4849"
                    y1="17.6232"
                    x2="0.399917"
                    y2="0.616632"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#002EFF" />
                    <stop offset="1" stopColor="#22E1FF" />
                  </linearGradient>
                </defs>
              </svg>

              <Typography variant="h6" className="text-white">
                {isZapActive ? (
                  <span>
                    1 {tokenName} ={' '}
                    {getUserReadableAmount(
                      quote['toTokenAmount'],
                      quote['toToken']['decimals']
                    ).toFixed(8)}{' '}
                    {ssovTokenSymbol}
                  </span>
                ) : (
                  'Zap In'
                )}
              </Typography>

              {isZapActive ? (
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 ml-auto mt-1.5"
                >
                  <path
                    d="M5.28997 0.70998L0.699971 5.29998C0.309971 5.68998 0.309971 6.31998 0.699971 6.70998C1.08997 7.09998 1.71997 7.09998 2.10997 6.70998L5.99997 2.82998L9.87997 6.70998C10.27 7.09998 10.9 7.09998 11.29 6.70998C11.68 6.31998 11.68 5.68998 11.29 5.29998L6.69997 0.70998C6.31997 0.31998 5.67997 0.31998 5.28997 0.70998Z"
                    fill="#8E8E8E"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-0 ml-auto mt-0.5"
                >
                  <path
                    d="M8 4.25C7.5875 4.25 7.25 4.5875 7.25 5V7.25H5C4.5875 7.25 4.25 7.5875 4.25 8C4.25 8.4125 4.5875 8.75 5 8.75H7.25V11C7.25 11.4125 7.5875 11.75 8 11.75C8.4125 11.75 8.75 11.4125 8.75 11V8.75H11C11.4125 8.75 11.75 8.4125 11.75 8C11.75 7.5875 11.4125 7.25 11 7.25H8.75V5C8.75 4.5875 8.4125 4.25 8 4.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
                    fill="white"
                  />
                </svg>
              )}
            </Box>

            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.16667 8.0833H9.5775L6.1675 12.0708C5.66333 12.6666 6.085 13.5833 6.86417 13.5833H10.8333C11.3375 13.5833 11.75 13.1708 11.75 12.6666C11.75 12.1625 11.3375 11.75 10.8333 11.75H8.4225L11.8325 7.76247C12.3367 7.16663 11.915 6.24997 11.1358 6.24997H7.16667C6.6625 6.24997 6.25 6.66247 6.25 7.16663C6.25 7.6708 6.6625 8.0833 7.16667 8.0833ZM17.525 3.88497C17.2042 4.26997 16.6267 4.32497 16.2325 4.00413L13.4183 1.65747C13.0333 1.32747 12.9783 0.749966 13.3083 0.364966C13.6292 -0.0200341 14.2067 -0.075034 14.6008 0.245799L17.415 2.59247C17.8 2.92247 17.855 3.49997 17.525 3.88497ZM0.475 3.88497C0.795834 4.27913 1.37333 4.32497 1.75833 4.00413L4.5725 1.65747C4.96667 1.32747 5.02167 0.749966 4.69167 0.364966C4.37083 -0.0292008 3.79333 -0.075034 3.40833 0.245799L0.585 2.59247C0.2 2.92247 0.145 3.49997 0.475 3.88497ZM9 3.49997C12.5383 3.49997 15.4167 6.3783 15.4167 9.91663C15.4167 13.455 12.5383 16.3333 9 16.3333C5.46167 16.3333 2.58333 13.455 2.58333 9.91663C2.58333 6.3783 5.46167 3.49997 9 3.49997ZM9 1.66663C4.44417 1.66663 0.75 5.3608 0.75 9.91663C0.75 14.4725 4.44417 18.1666 9 18.1666C13.5558 18.1666 17.25 14.4725 17.25 9.91663C17.25 5.3608 13.5558 1.66663 9 1.66663Z"
                    fill="#6DFFB9"
                  />
                </svg>
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                This option will{' '}
                <span className="text-white">Auto Exercise</span> and can be
                settled anytime after expiry.
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-md"
              color={
                formik.values.optionsAmount <= 0 ||
                isFetchingPath ||
                !isPurchasePowerEnough ||
                !isLiquidityEnough
                  ? 'mineshaft'
                  : 'primary'
              }
              disabled={
                formik.values.optionsAmount <= 0 ||
                isFetchingPath ||
                !isPurchasePowerEnough ||
                !isLiquidityEnough
              }
              onClick={
                formik.values.optionsAmount > 0 && isPurchasePowerEnough
                  ? approved
                    ? userEpochStrikePurchasableAmount <
                      formik.values.optionsAmount
                      ? null
                      : handlePurchase
                    : handleApprove
                  : null
              }
            >
              {formik.values.optionsAmount > 0
                ? isFetchingPath
                  ? 'Finding the best route...'
                  : getUserReadableAmount(state.totalCost, 18) > purchasePower
                  ? 'Insufficient balance'
                  : approved
                  ? userEpochStrikePurchasableAmount <
                    formik.values.optionsAmount
                    ? 'Not enough liquidity'
                    : 'Purchase'
                  : 'Approve'
                : 'Enter an amount'}
            </CustomButton>
          </Box>
        </Box>
      )}

      {isZapInVisible && (
        <ZapIn
          setOpen={setIsZapInVisible}
          ssovTokenName={ssovTokenName}
          tokenName={tokenName}
          setToken={setToken}
          token={token}
          userTokenBalance={userTokenBalance}
          quote={quote}
          priceImpact={priceImpact}
          formik={formik}
          setSlippageTolerance={setSlippageTolerance}
          slippageTolerance={slippageTolerance}
          purchasePower={purchasePower}
        />
      )}
    </Dialog>
  );
};

export default PurchaseDialog;
