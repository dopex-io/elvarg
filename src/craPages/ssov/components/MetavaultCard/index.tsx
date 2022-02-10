import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Addresses,
  ERC20,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
  NativeSSOV1inchRouter__factory,
  Aggregation1inchRouterV4__factory,
} from '@dopex-io/sdk';

import Countdown from 'react-countdown';
import cx from 'classnames';
import format from 'date-fns/format';
import { isNaN, useFormik } from 'formik';
import axios from 'axios';
import { Tabs, PanelList, Panel } from 'react-swipeable-tab';
import { BigNumber } from 'ethers';
import { Range, getTrackBackground } from 'react-range';
import * as yup from 'yup';
import noop from 'lodash/noop';

import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import styles from './styles.module.scss';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
import ZapInButton from '../../../../components/ZapInButton';
import ZapOutButton from '../../../../components/ZapOutButton';
import getDecimalsFromSymbol from '../../../../utils/general/getDecimalsFromSymbol';

import useSendTx from 'hooks/useSendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { getValueInUsdFromSymbol } from 'utils/general/getValueInUsdFromSymbol';
import { MAX_VALUE, SSOV_MAP } from 'constants/index';

import ZapIcon from '../../../../components/Icons/ZapIcon';
import TransparentCrossIcon from '../../../../components/Icons/TransparentCrossIcon';
import ArrowRightIcon from '../../../../components/Icons/ArrowRightIcon';
import LockerIcon from '../../../../components/Icons/LockerIcon';
import WhiteLockerIcon from '../../../../components/Icons/WhiteLockerIcon';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const ManageCard = ({ ssovProperties }: { ssovProperties: SsovProperties }) => {
  const {
    updateSsovData,
    updateUserSsovData,
    selectedSsov,
    ssovDataArray,
    userSsovDataArray,
    ssovSignerArray,
  } = useContext(SsovContext);
  const sendTx = useSendTx();
  const { accountAddress, chainId, provider, signer } =
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
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const ssovTokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(true);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);
  const { ssovContractWithSigner, ssovRouter } = ssovSignerArray[selectedSsov];
  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);
  const { userEpochDeposits } = userSsovDataArray[selectedSsov];
  const { epochTimes, isVaultReady, epochStrikes, totalEpochDeposits } =
    ssovDataArray[selectedSsov];

  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: number | string;
  }>({});
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovProperties.tokenName)
      ? ssovProperties.tokenName
      : ssovSignerArray[selectedSsov].token[0]
  );
  const [tokenName, setTokenName] = useState<string>(ssovTokenSymbol);
  const ssovToken = ssovSignerArray[selectedSsov].token[0];

  const colors: string[] = [
    '#22E1FF',
    '#22FFE4',
    '#002EFF',
    '#9CBCF9',
    '#7B61FF',
  ];

  const [
    manuallyInsertedStrikePercentages,
    setManuallyInsertedStrikePercentages,
  ] = useState({});

  const handleManuallyInsertedStrikePercentagesInput = (value, index) => {
    const percentages = { ...manuallyInsertedStrikePercentages };
    const cleanValue = parseFloat(value.replace('%', ''));
    const isValid = !isNaN(cleanValue) && cleanValue >= 0 && cleanValue <= 100;

    percentages[index] = {
      value: value,
      isValid: isValid,
    };

    setManuallyInsertedStrikePercentages(percentages);
  };

  const [ranges, setRanges] = useState<number[]>([]);

  const handleSelectStrikes = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const strikeIndexes = (event.target.value as number[]).sort();
      setSelectedStrikeIndexes(strikeIndexes);
    },
    []
  );

  const updateRanges = () => {
    let newRanges: number[] = ranges.slice();
    while (newRanges.length < selectedStrikeIndexes.length - 1) {
      if (newRanges.length > 0 && newRanges[0] !== 0) newRanges.unshift(0);
      else {
        newRanges = [];
        for (let i = 0; i < selectedStrikeIndexes.length; i++) {
          const value = (100 / selectedStrikeIndexes.length) * (i + 1);
          newRanges.push(value);
        }
      }
    }
    while (newRanges.length > selectedStrikeIndexes.length - 1) {
      newRanges.pop();
    }
  };

  useEffect(() => {
    if (selectedStrikeIndexes.length === 0) return;
    let newRanges: number[] = ranges.slice();
    while (newRanges.length < selectedStrikeIndexes.length - 1) {
      if (newRanges.length > 0 && newRanges[0] !== 0) newRanges.unshift(0);
      else {
        newRanges = [];
        for (let i = 0; i < selectedStrikeIndexes.length; i++) {
          const value = (100 / selectedStrikeIndexes.length) * (i + 1);
          newRanges.push(value);
        }
      }
    }
    while (newRanges.length > selectedStrikeIndexes.length - 1) {
      newRanges.pop();
    }
    setRanges(newRanges);
  }, [selectedStrikeIndexes]);

  const strikePercentages = useMemo<{
    [key: number]: number;
  }>(() => {
    const output = {};
    let cumulativeValue: number = 0;
    for (let i: number = 0; i <= ranges.length; i++) {
      output[i] = ranges[i] - (ranges[i - 1] || 0);
      if (isNaN(output[i])) output[i] = 100 - cumulativeValue;
      else cumulativeValue += output[i];
    }
    return output;
  }, [ranges]);

  console.log(ranges);
  console.log(strikePercentages);

  const activeIndex: number = useMemo(() => {
    if (isZapInVisible) return 2;
    else {
      if (activeTab === 'deposit') return 0;
      else return 1;
    }
  }, [activeTab, isZapInVisible]);

  const getQuote = async () => {
    const fromTokenAddress = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress = IS_NATIVE(ssovTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    if (fromTokenAddress === toTokenAddress) return;
    const amount = (10 ** getDecimalsFromSymbol(tokenName, chainId)).toString();
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );

    setQuote(data);
  };

  const contractReadableStrikeDepositAmounts = useMemo(() => {
    const readable: {
      [key: number]: BigNumber;
    } = {};
    Object.keys(strikeDepositAmounts).map((key) => {
      readable[key] = getContractReadableAmount(strikeDepositAmounts[key], 18);
    });
    return readable;
  }, [strikeDepositAmounts]);

  const isZapActive: boolean = useMemo(() => {
    return tokenName.toUpperCase() !== ssovTokenSymbol.toUpperCase();
  }, [tokenName, ssovTokenSymbol]);

  const ssovTokenName = ssovProperties.tokenName;
  const [denominationTokenName, setDenomationTokenName] =
    useState<string>(ssovTokenName);

  const spender: string = isZapActive
    ? IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB'
      ? nativeSSOV1inchRouter?.address
      : erc20SSOV1inchRouter?.address
    : ssovTokenName === 'BNB'
    ? ssovRouter.address
    : ssovContractWithSigner.address;

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'].toUpperCase() === tokenName.toUpperCase())
        price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

  const purchasePower =
    isZapActive && quote['toToken'] && denominationTokenName === ssovTokenName
      ? getUserReadableAmount(
          quote['toTokenAmount'],
          quote['toToken']['decimals']
        ) /
        (1 + slippageTolerance / 100)
      : getUserReadableAmount(
          userTokenBalance,
          getDecimalsFromSymbol(tokenName, chainId)
        );

  const strikes = epochStrikes.map((strike) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const totalDepositAmount = useMemo(() => {
    let total = 0;
    Object.keys(strikeDepositAmounts).map((strike) => {
      total += parseFloat(strikeDepositAmounts[strike]);
    });
    return total;
  }, [strikeDepositAmounts]);

  const isPurchasePowerEnough = useMemo(() => {
    return purchasePower >= totalDepositAmount;
  }, [purchasePower, totalDepositAmount]);

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
              getValueInUsdFromSymbol,
              getDecimalsFromSymbol(b, chainId)
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

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    await getQuote();
  };

  const totalEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(totalEpochDeposits, 8).toString()
      : getUserReadableAmount(totalEpochDeposits, 18).toString();

  const userEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(userEpochDeposits, 8).toString()
      : getUserReadableAmount(userEpochDeposits, 18).toString();

  const vaultShare = useMemo(() => {
    return (
      (100 * parseFloat(userEpochDepositsAmount)) /
      parseFloat(totalEpochDepositsAmount)
    );
  }, [userEpochDepositsAmount, totalEpochDepositsAmount]);

  const unselectStrike = (index) => {
    setSelectedStrikeIndexes(
      selectedStrikeIndexes.filter(function (item) {
        return item !== index;
      })
    );
  };

  const inputStrikeDepositAmount = useCallback(
    (
      index: number,
      e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      value?: number
    ) => {
      let input = e
        ? [',', '.'].includes(e.target.value[e.target.value.length - 1])
          ? e.target.value
          : parseFloat(e.target.value.replace(',', '.'))
        : value;
      if (e && parseFloat(e.target.value) === 0) input = e.target.value;
      if (isNaN(input)) input = 0;
      setStrikeDepositAmounts((prevState) => ({
        ...prevState,
        [index]: input,
      }));
    },
    []
  );

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
  }, [totalDepositAmount, token, ssovContractWithSigner, sendTx]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          contractReadableStrikeDepositAmounts[index] &&
          contractReadableStrikeDepositAmounts[index].gt('0')
      );

      if (ssovTokenName === tokenName) {
        if (ssovTokenName === 'BNB') {
          await sendTx(
            ssovRouter.depositMultiple(
              strikeIndexes,
              strikeIndexes.map((index) => strikeDepositAmounts[index]),
              accountAddress,
              {
                value: getContractReadableAmount(
                  totalDepositAmount,
                  getDecimalsFromSymbol(ssovTokenName, chainId)
                ),
              }
            )
          );
        } else if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.depositMultiple(
              strikeIndexes,
              strikeIndexes.map((index) => strikeDepositAmounts[index]),
              accountAddress
            )
          );
        }
      } else {
        const decoded = aggregation1inchRouter.interface.decodeFunctionData(
          'swap',
          path['tx']['data']
        );

        const toTokenAmount: BigNumber = BigNumber.from(path['toTokenAmount']);
        const price =
          parseFloat(path['toTokenAmount']) /
          parseFloat(path['fromTokenAmount']);
        let total = BigNumber.from('0');
        let amounts = [];
        strikeIndexes.map((index) => {
          const amount = getContractReadableAmount(
            // @ts-ignore
            strikeDepositAmounts[index] *
              (denominationTokenName !== ssovTokenName ? price : 1),
            getDecimalsFromSymbol(ssovTokenName, chainId)
          );
          amounts.push(amount);
          total = total.add(amount);
        });

        if (total.gt(toTokenAmount)) {
          const difference = total.sub(toTokenAmount);
          const toSubtract = difference.div(amounts.length);
          for (let i in amounts) amounts[i] = amounts[i].sub(toSubtract);
        }

        if (IS_NATIVE(tokenName)) {
          const value = getContractReadableAmount(
            totalDepositAmount /
              (denominationTokenName === ssovTokenName ? price : 1),
            getDecimalsFromSymbol(tokenName, chainId)
          );

          await sendTx(
            erc20SSOV1inchRouter.swapNativeAndDepositMultiple(
              ssovProperties.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              strikeIndexes,
              amounts,
              accountAddress,
              {
                value: value,
              }
            )
          );
        } else {
          await sendTx(
            erc20SSOV1inchRouter.swapAndDepositMultiple(
              ssovProperties.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              strikeIndexes,
              amounts,
              accountAddress
            )
          );
        }
      }

      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateSsovData();
      updateUserSsovData();
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedStrikeIndexes,
    ssovContractWithSigner,
    contractReadableStrikeDepositAmounts,
    updateSsovData,
    updateUserSsovData,
    updateAssetBalances,
    accountAddress,
    tokenName,
    totalDepositAmount,
    ssovRouter,
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

  const getPath = async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress = IS_NATIVE(ssovTokenName)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;
    const fromTokenDecimals = IS_NATIVE(token)
      ? getDecimalsFromSymbol(token, chainId)
      : await token.decimals();
    if (fromTokenAddress === ssovToken.address) return;
    const amount = Math.round(totalDepositAmount * 10 ** fromTokenDecimals);
    if (isNaN(amount) || amount <= 0) return;
    try {
      const { data } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${spender}&slippage=${slippageTolerance}&disableEstimate=true`
      );
      setPath(data);
    } catch (err) {
      setPath({ error: 'Invalid amounts' });
    }
    setIsFetchingPath(false);
  };

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, []);

  useEffect(() => {
    getPath();
  }, [strikeDepositAmounts, denominationTokenName]);

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount: BigNumber = getContractReadableAmount(
        totalDepositAmount.toString(),
        getDecimalsFromSymbol(ssovTokenName, chainId)
      );

      if (IS_NATIVE(token)) {
        setApproved(true);
      } else {
        const allowance: BigNumber = await token.allowance(
          accountAddress,
          spender
        );
        setApproved(allowance.gte(finalAmount));
      }
    })();
  }, [
    token,
    accountAddress,
    ssovContractWithSigner,
    approved,
    totalDepositAmount,
  ]);

  // Handles isApproved
  useEffect(() => {
    if (!token || !ssovContractWithSigner || !accountAddress) return;
    (async function () {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        getDecimalsFromSymbol(ssovTokenName, chainId)
      );

      let userAmount = IS_NATIVE(token)
        ? BigNumber.from(userAssetBalances.ETH)
        : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(token)
        ? BigNumber.from(0)
        : await token.allowance(accountAddress, spender);

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
    totalDepositAmount,
    token,
    ssovContractWithSigner,
    userAssetBalances.ETH,
    tokenName,
  ]);

  const formik = useFormik({
    initialValues: {
      depositAmount: 1,
      zapInAmount: 1,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      depositAmount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    }),
    validate: () => {
      const errors: any = {};
      return errors;
    },
    onSubmit: noop,
  });

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4',
        styles.cardWidth
      )}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Create Vault</Typography>

        <ZapOutButton
          isZapActive={isZapActive}
          handleClick={() => {
            null;
          }}
          size="slim"
        />
      </Box>

      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-10">
              <img src={'/assets/dpx.svg'} alt={'DPX'} />
            </Box>
          </Box>
          <Box
            className="bg-mineshaft hover:bg-neutral-700 flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
            onClick={null}
          >
            <Typography variant="caption" component="div">
              <span className="text-stieglitz pl-2.5 pr-2.5">MAX</span>
            </Typography>
          </Box>
          <Input
            disableUnderline
            id="depositAmount"
            name="depositAmount"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={formik.values.depositAmount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={
              formik.touched.depositAmount &&
              Boolean(formik.errors.depositAmount)
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
                width="14"
                height="14"
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
              Amount
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
        <Box className="flex">
          <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
            Select distribution
          </Typography>
        </Box>
        <Box
          className={
            Object.keys(strikePercentages).length > 1
              ? 'flex-wrap mb-3 mt-3'
              : 'hidden'
          }
        >
          <Range
            values={ranges}
            step={0.5}
            min={0}
            max={100}
            onChange={(values) => setRanges(values)}
            renderTrack={({ props, children }) => (
              <div
                style={{
                  ...props.style,
                  height: '36px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '2.2rem',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values: ranges,
                      colors: colors,
                      min: 0,
                      max: 100,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, index, isDragged }) => (
              <Box {...props} className="rounded-full outline-0">
                <Box className="absolute h-[2.6rem] w-[0.12rem] bg-umbra bottom-[-8.72px] left-[8.6px] -z-10" />
                <Box className="bg-umbra border-[1.7px] border-black flex h-[18.5px] w-[18.5px] items-center justify-center rounded-full">
                  <svg
                    width="12.5"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79991 6.59982L2.19991 3.99982L4.79991 1.39982C5.05991 1.13982 5.05991 0.726484 4.79991 0.466484C4.53991 0.206484 4.12657 0.206484 3.86657 0.466484L0.806572 3.52648C0.546572 3.78648 0.546572 4.20648 0.806572 4.46648L3.86657 7.53315C4.12657 7.79315 4.53991 7.79315 4.79991 7.53315C5.05991 7.27315 5.05991 6.85982 4.79991 6.59982ZM9.19991 6.59982L11.7999 3.99982L9.19991 1.39982C8.93991 1.13982 8.93991 0.726484 9.19991 0.466484C9.45991 0.206484 9.87324 0.206484 10.1332 0.466484L13.1932 3.52648C13.4532 3.78648 13.4532 4.20648 13.1932 4.46648L10.1332 7.53315C9.87324 7.79315 9.45991 7.79315 9.19991 7.53315C8.93991 7.27315 8.93991 6.85982 9.19991 6.59982Z"
                      fill="white"
                    />
                  </svg>
                </Box>
              </Box>
            )}
          />
        </Box>
        <Box className="mt-4">
          {selectedStrikeIndexes.map((index, counter) => (
            <Box className="flex mb-3 group">
              <Button
                className="p-2 pl-4 pr-4 bg-mineshaft text-white hover:bg-mineshaft hover:opacity-80 font-normal cursor-pointer"
                disableRipple
                onClick={() => unselectStrike(index)}
              >
                ${formatAmount(strikes[index], 4)}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M5.99984 0.166748C2.774 0.166748 0.166504 2.77425 0.166504 6.00008C0.166504 9.22592 2.774 11.8334 5.99984 11.8334C9.22567 11.8334 11.8332 9.22592 11.8332 6.00008C11.8332 2.77425 9.22567 0.166748 5.99984 0.166748ZM8.50817 8.50841C8.28067 8.73591 7.91317 8.73591 7.68567 8.50841L5.99984 6.82258L4.314 8.50841C4.0865 8.73591 3.719 8.73591 3.4915 8.50841C3.264 8.28091 3.264 7.91342 3.4915 7.68592L5.17734 6.00008L3.4915 4.31425C3.264 4.08675 3.264 3.71925 3.4915 3.49175C3.719 3.26425 4.0865 3.26425 4.314 3.49175L5.99984 5.17758L7.68567 3.49175C7.91317 3.26425 8.28067 3.26425 8.50817 3.49175C8.73567 3.71925 8.73567 4.08675 8.50817 4.31425L6.82234 6.00008L8.50817 7.68592C8.72984 7.90758 8.72984 8.28091 8.50817 8.50841Z"
                    fill="#8E8E8E"
                  />
                </svg>
              </Button>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-4 mt-2.5"
              >
                <path
                  d="M0.916829 5.58334L7.43266 5.58334L4.586 8.43C4.3585 8.6575 4.3585 9.03084 4.586 9.25834C4.8135 9.48584 5.181 9.48584 5.4085 9.25834L9.25266 5.41417C9.48016 5.18667 9.48016 4.81917 9.25266 4.59167L5.41433 0.74167C5.18683 0.51417 4.81933 0.51417 4.59183 0.74167C4.36433 0.96917 4.36433 1.33667 4.59183 1.56417L7.43266 4.41667L0.916829 4.41667C0.595996 4.41667 0.333496 4.67917 0.333496 5C0.333496 5.32084 0.595996 5.58334 0.916829 5.58334Z"
                  fill="#3E3E3E"
                />
              </svg>
              <Tooltip
                title={
                  manuallyInsertedStrikePercentages[index]?.isValid === false
                    ? 'Invalid amount'
                    : 'Your input exceeds the total maximum allowed (100%)'
                }
                placement="right"
                classes={{
                  tooltip:
                    manuallyInsertedStrikePercentages[index]?.isValid === false
                      ? ''
                      : 'hidden',
                }}
              >
                <Box className="flex ml-auto mr-0 w-fluid">
                  <Tooltip
                    title={
                      selectedStrikeIndexes.length > 1
                        ? 'Use the range to set the desired percentages'
                        : ''
                    }
                  >
                    <Input
                      disableUnderline={true}
                      name="address"
                      className={
                        manuallyInsertedStrikePercentages[index]?.isValid ===
                        false
                          ? 'w-[9.3rem] border-[#FF617D] border-t-[1.7px] border-b-[1.7px] border-l-[1.7px] border-r-[1.7px] rounded-md pl-2 pr-2 border-red-400'
                          : 'w-[9.3rem] border-[#545454] border-t-[1.7px] border-b-[1.7px] border-l-[1.7px] border-r-[1.7px] rounded-md pl-2 pr-2'
                      }
                      classes={{ input: 'text-white text-xs text-right' }}
                      value={
                        selectedStrikeIndexes.length <= 1
                          ? manuallyInsertedStrikePercentages[index]?.value
                          : strikePercentages[counter]?.toFixed(2) + '%'
                      }
                      readOnly={selectedStrikeIndexes.length > 1}
                      placeholder="%"
                      onChange={(e) =>
                        handleManuallyInsertedStrikePercentagesInput(
                          e.target.value,
                          index
                        )
                      }
                    />
                  </Tooltip>

                  {manuallyInsertedStrikePercentages[index]?.isValid ===
                  false ? (
                    <Box className="absolute ml-[0.45rem] mt-[0.5rem]">
                      <svg
                        width="15"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.00016 3.66732C7.36683 3.66732 7.66683 3.96732 7.66683 4.33398V7.00065C7.66683 7.36732 7.36683 7.66732 7.00016 7.66732C6.6335 7.66732 6.3335 7.36732 6.3335 7.00065V4.33398C6.3335 3.96732 6.6335 3.66732 7.00016 3.66732ZM6.9935 0.333984C3.3135 0.333984 0.333496 3.32065 0.333496 7.00065C0.333496 10.6807 3.3135 13.6673 6.9935 13.6673C10.6802 13.6673 13.6668 10.6807 13.6668 7.00065C13.6668 3.32065 10.6802 0.333984 6.9935 0.333984ZM7.00016 12.334C4.0535 12.334 1.66683 9.94732 1.66683 7.00065C1.66683 4.05398 4.0535 1.66732 7.00016 1.66732C9.94683 1.66732 12.3335 4.05398 12.3335 7.00065C12.3335 9.94732 9.94683 12.334 7.00016 12.334ZM7.66683 10.334H6.3335V9.00065H7.66683V10.334Z"
                          fill="#FF617D"
                        />
                      </svg>
                    </Box>
                  ) : (
                    ''
                  )}
                </Box>
              </Tooltip>
            </Box>
          ))}
        </Box>
        <Box className="mt-2 flex mb-3.5">
          <Box className="w-full">
            <Select
              className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
              fullWidth
              multiple
              displayEmpty
              disableUnderline
              value={selectedStrikeIndexes}
              onChange={handleSelectStrikes}
              input={<Input />}
              variant="outlined"
              renderValue={() => {
                return (
                  <Typography
                    variant="h6"
                    className="text-white text-center w-full relative"
                  >
                    Select Strike Prices
                  </Typography>
                );
              }}
              MenuProps={SelectMenuProps}
              classes={{
                icon: isZapActive
                  ? 'absolute right-7 text-white scale-x-75'
                  : 'absolute right-16 text-white scale-x-75',
                select: 'overflow-hidden',
              }}
              label="strikes"
            >
              {strikes.map((strike, index) => (
                <MenuItem key={index} value={index} className="pb-2 pt-2">
                  <Checkbox
                    className={
                      selectedStrikeIndexes.indexOf(index) > -1
                        ? 'p-0 text-white'
                        : 'p-0 text-white border'
                    }
                    checked={selectedStrikeIndexes.indexOf(index) > -1}
                  />
                  <Typography
                    variant="h5"
                    className="text-white text-left w-full relative ml-3"
                  >
                    ${formatAmount(strike, 4)}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>

      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-4">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
          <EstimatedGasCostButton gas={500000} />
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="7.5"
                stroke="url(#paint0_angular_4935_6860)"
                strokeWidth="4"
              />
              <defs>
                <radialGradient
                  id="paint0_angular_4935_6860"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(10 10) rotate(90) scale(9.5)"
                >
                  <stop stopColor="white" />
                  <stop offset="0.34375" stopColor="white" />
                  <stop offset="0.34385" stopColor="#3E3E3E" />
                  <stop offset="1" stopColor="#3E3E3E" />
                </radialGradient>
              </defs>
            </svg>
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            Your vault is configured to{' '}
            <span className="text-white">Dollar Cost Average</span> Call Options
            from SSOV
          </Typography>
        </Box>

        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={false ? 'primary' : 'mineshaft'}
          disabled={false}
          onClick={null}
        >
          Next
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ManageCard;
