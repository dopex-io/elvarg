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
import Slide from '@material-ui/core/Slide';
import { Addresses, ERC20, ERC20__factory } from '@dopex-io/sdk';
import ZapIn from '../../../../components/ZapIn';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import styles from './styles.module.scss';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
import ZapInButton from '../../../../components/ZapInButton';
import ZapOutButton from '../../../../components/ZapOutButton';

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
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, provider, chainId } = useContext(WalletContext);
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovProperties.tokenName)
      ? ssovProperties.tokenName
      : ssovSignerArray[selectedSsov].token[0]
  );
  const ssovToken = ssovSignerArray[selectedSsov].token[0];
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
  const isZapActive: boolean = useMemo(() => {
    return tokenName.toUpperCase() !== ssovTokenSymbol.toUpperCase();
  }, [tokenName, ssovTokenSymbol]);
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

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'] === tokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

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
  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);
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

  const getValueInUsd = (symbol) => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === symbol) {
        value =
          (record['price'] * parseInt(userAssetBalances[symbol])) / 10 ** 18;
      }
    });
    return value;
  };

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = tokens
        .filter(function (item) {
          return item !== ssovTokenSymbol && Addresses[chainId][item];
        })
        .sort((a, b) => {
          return getValueInUsd(b) - getValueInUsd(a);
        });

      const randomToken = ERC20__factory.connect(
        Addresses[chainId][filteredTokens[0]],
        provider
      );
      setToken(randomToken);
      setIsZapInVisible(true);
    }
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
    if (
      !isZapInVisible &&
      formik.values.zapInAmount > getUserReadableAmount(userTokenBalance, 18)
    ) {
      setTokenName(ssovTokenSymbol);
    }
  }, [isZapInVisible]);

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
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Buy Call Option</Typography>

        <ZapOutButton
          isZapActive={isZapActive}
          handleClick={() => {
            if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
            else setToken(ssovToken);
          }}
        />

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
                {formatAmount(getUserReadableAmount(userTokenBalance, 18), 3)}{' '}
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

      <Box>
        {debouncedIsChartVisible[0] && (
          <Slide direction="left" in={isChartVisible}>
            <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
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
          </Slide>
        )}

        {!debouncedIsChartVisible[0] && (
          <Slide direction="left" in={!isChartVisible}>
            <Box className="h-[12.88rem]">
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
          </Slide>
        )}
      </Box>

      <Box className="flex mt-5 mb-5">
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

      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Option Size
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(formik.values.optionsAmount, 0)}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
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
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
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
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Total
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(state.totalCost, 18), 5)}{' '}
                {ssovTokenSymbol}
              </Typography>
            </Box>
          </Box>

          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Purchase Power
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(purchasePower, 5)} {ssovTokenSymbol}
              </Typography>
            </Box>
          </Box>

          <EstimatedGasCostButton gas={700000} />
        </Box>

        <ZapInButton
          openZapIn={openZapIn}
          isZapActive={isZapActive}
          quote={quote}
          tokenName={tokenName}
          ssovTokenSymbol={ssovTokenSymbol}
          selectedTokenPrice={selectedTokenPrice}
        />

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
            This option will <span className="text-white">Auto Exercise</span>{' '}
            and can be settled anytime after expiry.
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
                ? userEpochStrikePurchasableAmount < formik.values.optionsAmount
                  ? null
                  : handlePurchase
                : handleApprove
              : null
          }
        >
          {formik.values.optionsAmount > 0 ? (
            isFetchingPath ? (
              <Box className={'flex'}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7081 2.29182C10.3497 0.93349 8.42473 0.150156 6.30807 0.366823C3.24973 0.675156 0.733066 3.15849 0.3914 6.21682C-0.0669337 10.2585 3.05807 13.6668 6.99973 13.6668C9.65807 13.6668 11.9414 12.1085 13.0081 9.86682C13.2747 9.30849 12.8747 8.66682 12.2581 8.66682C11.9497 8.66682 11.6581 8.83349 11.5247 9.10849C10.5831 11.1335 8.32473 12.4168 5.85807 11.8668C4.00807 11.4585 2.5164 9.95016 2.12473 8.10016C1.42473 4.86682 3.88307 2.00016 6.99973 2.00016C8.38307 2.00016 9.6164 2.57516 10.5164 3.48349L9.25807 4.74182C8.73307 5.26682 9.09973 6.16682 9.8414 6.16682H12.8331C13.2914 6.16682 13.6664 5.79182 13.6664 5.33349V2.34182C13.6664 1.60016 12.7664 1.22516 12.2414 1.75016L11.7081 2.29182Z"
                    fill="#8E8E8E"
                  />
                </svg>
                <span className="ml-2">Elaborating best route...</span>
              </Box>
            ) : getUserReadableAmount(state.totalCost, 18) > purchasePower ? (
              'Insufficient balance'
            ) : approved ? (
              userEpochStrikePurchasableAmount < formik.values.optionsAmount ? (
                'Not enough liquidity'
              ) : (
                'Purchase'
              )
            ) : (
              'Approve'
            )
          ) : (
            'Enter an amount'
          )}
        </CustomButton>
      </Box>

      <Slide direction="left" in={isZapInVisible} mountOnEnter unmountOnExit>
        <Box className={styles.zapIn}>
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
            selectedTokenPrice={selectedTokenPrice}
            isInDialog={true}
          />
        </Box>
      </Slide>
    </Dialog>
  );
};

export default PurchaseDialog;
