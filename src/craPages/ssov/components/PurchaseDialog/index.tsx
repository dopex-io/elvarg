import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  Addresses,
  ERC20,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
  NativeSSOV1inchRouter__factory,
  Aggregation1inchRouterV4__factory,
} from '@dopex-io/sdk';

import { useFormik } from 'formik';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import * as yup from 'yup';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import styles from './styles.module.scss';

import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Slide from '@material-ui/core/Slide';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';
import ZapIn from '../../../../components/ZapIn';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
import ZapInButton from '../../../../components/ZapInButton';
import ZapOutButton from '../../../../components/ZapOutButton';
import getContractReadableAmount from '../../../../utils/contracts/getContractReadableAmount';
import getDecimalsFromSymbol from '../../../../utils/general/getDecimalsFromSymbol';
import useBnbSsovConversion from '../../../../hooks/useBnbSsovConversion';
import { getValueInUsdFromSymbol } from 'utils/general/getValueInUsdFromSymbol';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import {
  SsovContext,
  SsovProperties,
  SsovData,
  UserSsovData,
} from 'contexts/Ssov';

import useSendTx from 'hooks/useSendTx';
import { MAX_VALUE, SSOV_MAP } from 'constants/index';
import BigCrossIcon from '../../../../components/Icons/BigCrossIcon';
import ZapIcon from '../../../../components/Icons/ZapIcon';
import CircleIcon from '../../../../components/Icons/CircleIcon';
import AlarmIcon from '../../../../components/Icons/AlarmIcon';

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
  const { accountAddress, provider, chainId, signer } =
    useContext(WalletContext);
  const aggregation1inchRouter = Addresses[chainId]['1inchRouter']
    ? Aggregation1inchRouterV4__factory.connect(
        Addresses[chainId]['1inchRouter'],
        signer
      )
    : null;
  const erc20SSOV1inchRouter = Addresses[chainId]['ERC20SSOV1inchRouter']
    ? ERC20SSOV1inchRouter__factory.connect(
        Addresses[chainId]['ERC20SSOV1inchRouter'],
        signer
      )
    : null;
  const nativeSSOV1inchRouter = Addresses[chainId]['NativeSSOV1inchRouter']
    ? NativeSSOV1inchRouter__factory.connect(
        Addresses[chainId]['NativeSSOV1inchRouter'],
        signer
      )
    : null;
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);
  const bnbSsovConversion = useBnbSsovConversion();
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovProperties.tokenName)
      ? ssovProperties.tokenName
      : ssovSignerArray[selectedSsov].token[0]
  );
  const ssovToken = ssovSignerArray[selectedSsov].token[0];
  const { tokenPrice, ssovOptionPricingContract, volatilityOracleContract } =
    ssovProperties;
  const { ssovContractWithSigner, ssovRouter } =
    ssovSignerArray !== undefined
      ? ssovSignerArray[selectedSsov]
      : { ssovContractWithSigner: null, ssovRouter: null };

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

  const spender: string = isZapActive
    ? IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB'
      ? nativeSSOV1inchRouter?.address
      : erc20SSOV1inchRouter?.address
    : ssovTokenName === 'BNB'
    ? ssovRouter.address
    : ssovContractWithSigner.address;

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);
  const purchasePower: number = useMemo(() => {
    if (isZapActive) {
      let price: number;
      if (path['toToken'])
        price =
          getUserReadableAmount(
            path['toTokenAmount'],
            quote['toToken']['decimals']
          ) /
          getUserReadableAmount(
            path['fromTokenAmount'],
            path['fromToken']['decimals']
          );
      else if (quote['toToken'])
        price =
          getUserReadableAmount(
            quote['toTokenAmount'],
            quote['toToken']['decimals']
          ) /
          getUserReadableAmount(
            quote['fromTokenAmount'],
            quote['fromToken']['decimals']
          );

      return (
        price *
        getUserReadableAmount(
          userAssetBalances[tokenName],
          getDecimalsFromSymbol(tokenName, chainId)
        )
      );
    } else {
      return parseFloat(
        getUserReadableAmount(
          userTokenBalance,
          getDecimalsFromSymbol(tokenName, chainId)
        ).toString()
      );
    }
  }, [isZapActive, quote, path, slippageTolerance, userTokenBalance]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

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

  const zapInTotalCost: number = useMemo(() => {
    if (!path['toTokenAmount']) return 0;
    const price =
      getUserReadableAmount(
        path['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      );
    return (
      getUserReadableAmount(
        state.totalCost,
        getDecimalsFromSymbol(ssovTokenSymbol, chainId)
      ) / price
    );
  }, [state.totalCost, path]);

  const zapInPurchasePower: number = useMemo(() => {
    if (!path['toTokenAmount']) return 0;
    const price =
      getUserReadableAmount(
        path['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      );
    return purchasePower / price;
  }, [purchasePower, path]);

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

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const getQuote = async () => {
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = IS_NATIVE(ssovTokenName)
      ? ssovTokenName === 'BNB'
        ? Addresses[chainId]['VBNB']
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    if (fromTokenAddress === toTokenAddress) return;
    const amount: number = 10 ** getDecimalsFromSymbol(tokenName, chainId);
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
        amount
      )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );

    setQuote(data);
  };

  const getPath = async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = IS_NATIVE(ssovTokenName)
      ? ssovTokenName === 'BNB'
        ? Addresses[chainId]['VBNB']
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;

    if (!quote['toToken']) return;

    let amount: number =
      parseInt(state.totalCost.toString()) /
      10 **
        getDecimalsFromSymbol(
          ssovTokenSymbol === 'BNB' ? 'vBNB' : ssovTokenSymbol,
          chainId
        ) /
      (parseInt(quote['toTokenAmount']) /
        10 ** parseInt(quote['toToken']['decimals']) /
        parseInt(quote['fromTokenAmount']));

    let attempts: number = 0;
    let bestPath: {} = {};
    let minAmount: number = Math.round(
      parseInt(state.totalCost.toString()) * 1.01
    );
    if (ssovTokenSymbol === 'BNB') minAmount = Math.round(minAmount / 10 ** 10);

    while (true) {
      try {
        const { data } = await axios.get(
          `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
            amount
          )}&fromAddress=${spender}&slippage=${slippageTolerance}&disableEstimate=true`
        );
        if (parseInt(data['toTokenAmount']) > minAmount || attempts > 10) {
          bestPath = data;
          break;
        }
      } catch (err) {
        console.log(err);
        break;
      }
      attempts += 1;
      amount = Math.round(amount * 1.01);
    }

    setPath(bestPath);
    setIsFetchingPath(false);
    return bestPath;
  };

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = ['ETH']
        .concat(tokens)
        .filter(function (item) {
          return (
            item !== ssovTokenSymbol &&
            (Addresses[chainId][item] || IS_NATIVE(item))
          );
        })
        .sort((a, b) => {
          return (
            getValueInUsdFromSymbol(
              b,
              tokenPrices,
              userAssetBalances,
              getDecimalsFromSymbol(b, chainId)
            ) -
            getValueInUsdFromSymbol(
              a,
              tokenPrices,
              userAssetBalances,
              getDecimalsFromSymbol(a, chainId)
            )
          );
        });

      const selectedToken = IS_NATIVE(filteredTokens[0])
        ? filteredTokens[0]
        : ERC20__factory.connect(
            Addresses[chainId][filteredTokens[0]],
            provider
          );

      setToken(selectedToken);
      setIsZapInVisible(true);
    }
  };

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(token.address, signer).approve(
          spender,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [token, signer, sendTx, spender]);

  const handlePurchase = useCallback(async () => {
    try {
      if (ssovTokenName === tokenName) {
        if (tokenName === 'BNB') {
          await sendTx(
            ssovRouter.purchase(strikeIndex, state.totalCost, accountAddress, {
              value: state.totalCost,
            })
          );
        } else if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.purchase(
              strikeIndex,
              state.totalCost,
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
              state.totalCost,
              accountAddress
            )
          );
        }
      } else {
        let bestPath = await getPath();
        if (!bestPath) {
          setIsFetchingPath(false);
          return;
        }

        const decoded = aggregation1inchRouter.interface.decodeFunctionData(
          'swap',
          bestPath['tx']['data']
        );

        if (IS_NATIVE(tokenName)) {
          const value = bestPath['fromTokenAmount'];

          await sendTx(
            erc20SSOV1inchRouter.swapNativeAndPurchase(
              ssovProperties.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              {
                strikeIndex: strikeIndex,
                amount: getContractReadableAmount(
                  formik.values.optionsAmount,
                  18
                ),
                to: accountAddress,
              },
              {
                value: value,
              }
            )
          );
        } else {
          await sendTx(
            IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB'
              ? nativeSSOV1inchRouter.swapAndPurchase(
                  decoded[0],
                  decoded[1],
                  decoded[2],
                  {
                    strikeIndex: strikeIndex,
                    amount: getContractReadableAmount(
                      formik.values.optionsAmount,
                      18
                    ),
                    to: accountAddress,
                  }
                )
              : erc20SSOV1inchRouter.swapAndPurchase(
                  ssovProperties.ssovContract.address,
                  ssovTokenSymbol === 'BNB'
                    ? Addresses[chainId]['VBNB']
                    : ssovToken.address,
                  decoded[0],
                  decoded[1],
                  decoded[2],
                  {
                    strikeIndex: strikeIndex,
                    amount: getContractReadableAmount(
                      formik.values.optionsAmount,
                      18
                    ),
                    to: accountAddress,
                  }
                )
          );
        }
      }

      formik.setFieldValue('optionsAmount', 0);
      updateSsovData();
      updateUserSsovData();
      updateAssetBalances();
    } catch (err) {
      console.log(err);
    }
  }, [
    state.totalCost,
    ssovContractWithSigner,
    updateSsovData,
    updateUserSsovData,
    updateAssetBalances,
    accountAddress,
    tokenName,
    strikeIndex,
    isZapActive,
  ]);

  const checkDEXAggregatorStatus = async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(
        !!(status === 200 && (erc20SSOV1inchRouter || nativeSSOV1inchRouter))
      );
    } catch (err) {
      setIsZapInAvailable(false);
    }
  };

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, []);

  useEffect(() => {
    getPath();
  }, [isZapInVisible]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [updateUserEpochStrikePurchasableAmount]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      if (!purchasePower) return;
      if (IS_NATIVE(token)) {
        setApproved(true);
      } else {
        const allowance = parseInt(
          (await token.allowance(accountAddress, spender)).toString()
        );
        setApproved(allowance > 0);
      }
    })();
  }, [token, accountAddress, ssovContractWithSigner, approved, purchasePower]);

  const setMaxAmount = async () => {
    const strike: BigNumber = epochStrikes[strikeIndex];
    const fees: BigNumber = await ssovContractWithSigner.calculatePurchaseFees(
      tokenPrice,
      strike,
      ethersUtils.parseEther(String(1))
    );
    let amount: number =
      (purchasePower /
        (getUserReadableAmount(fees, 18) +
          getUserReadableAmount(state.optionPrice, 8) /
            getUserReadableAmount(tokenPrice, 8))) *
      0.97; // margin of safety;
    formik.setFieldValue('optionsAmount', amount.toFixed(2));
  };

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  useEffect(() => {
    updateUserEpochStrikePurchasableAmount();
  }, [strikeIndex]);

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

        let fees = await ssovContractWithSigner.calculatePurchaseFees(
          tokenPrice,
          strike,
          ethersUtils.parseEther(String(formik.values.optionsAmount))
        );

        if (ssovTokenSymbol === 'BNB') {
          const abi = [
            ' function vbnbToBnb(uint256 vbnbAmount) public view returns (uint256)',
          ];
          const bnbSsov = new ethers.Contract(
            '0x43a5cfb83d0decaaead90e0cc6dca60a2405442b',
            abi,
            provider
          );
          fees = await bnbSsov.vbnbToBnb(fees);
        }

        let totalCost = premium.add(fees);
        if (isZapActive && ssovTokenSymbol === 'BNB') {
          const bnbToVBnb =
            parseInt(
              bnbSsovConversion
                .convertToVBNB(BigNumber.from('100000000000000000000'))
                .toString()
            ) / 99.5; // keep 0.5% of extra margin for the router
          totalCost = BigNumber.from(
            Math.round(
              parseInt(premium.add(fees).toString()) * bnbToVBnb
            ).toString()
          );
        }

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost: totalCost,
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        console.log(err);
        setIsPurchaseStatsLoading(false);
      }
    }
    debounce(async () => await updateOptionPrice(), 1000)();
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
      formik.values.zapInAmount >
        getUserReadableAmount(
          userTokenBalance,
          getDecimalsFromSymbol(tokenName, chainId)
        )
    ) {
      setTokenName(ssovTokenSymbol);
    }
  }, [isZapInVisible]);

  useEffect(() => {
    getPath();
  }, [state.totalCost]);

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
          <BigCrossIcon className="" />
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
              Available:{' '}
              <span className="text-white">
                {formatAmount(userEpochStrikePurchasableAmount, 3)}{' '}
              </span>
            </Typography>
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
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                        />
                      ) : (
                        <ArrowDropDownIcon
                          className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
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
        <CircleIcon
          className={
            isChartVisible
              ? 'ml-auto mr-3 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
              : 'ml-auto mr-3 h-5 w-5 fill-white stroke-white cursor-pointer'
          }
          onClick={() => setIsChartVisible(false)}
        />

        <CircleIcon
          className={
            isChartVisible
              ? 'mr-auto ml-0 h-5 w-5 fill-white stroke-white cursor-pointer'
              : 'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
          }
          onClick={() => setIsChartVisible(true)}
        />
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
              Purchase Power
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(
                  isZapActive ? zapInPurchasePower : purchasePower,
                  5
                )}{' '}
                {isZapActive
                  ? tokenName
                  : ssovTokenSymbol === 'BNB'
                  ? 'vBNB'
                  : ssovTokenSymbol}
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

          {isZapActive ? (
            <Box className={'flex mb-2'}>
              <ZapIcon
                id="6"
                className="ml-[-0.1rem] mt-[0.2rem] mr-[0.3rem]"
              />
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(zapInTotalCost, 5)} {tokenName}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(getUserReadableAmount(state.totalCost, 18), 5)}{' '}
                  {ssovTokenSymbol === 'BNB' ? 'vBNB' : ssovTokenSymbol}
                </Typography>
              </Box>
            </Box>
          )}

          <EstimatedGasCostButton gas={700000} />
        </Box>

        <ZapInButton
          openZapIn={openZapIn}
          isZapActive={isZapActive}
          quote={quote}
          path={path}
          isFetchingPath={isFetchingPath}
          tokenName={tokenName}
          ssovTokenSymbol={ssovTokenSymbol}
          selectedTokenPrice={selectedTokenPrice}
          isZapInAvailable={isZapInAvailable}
          chainId={chainId}
        />

        <Box className="flex">
          <Box className="flex text-center p-2 mr-2 mt-1">
            <AlarmIcon />
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
                <span>Purchase</span>
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
            setSlippageTolerance={setSlippageTolerance}
            slippageTolerance={slippageTolerance}
            purchasePower={purchasePower}
            selectedTokenPrice={selectedTokenPrice}
            isInDialog={true}
            ssovToken={ssovToken}
          />
        </Box>
      </Slide>
    </Dialog>
  );
};

export default PurchaseDialog;
