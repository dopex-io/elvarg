import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { BigNumber } from 'ethers';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';

import useSendTx from 'hooks/useSendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';
import Button from '@material-ui/core/Button';
import format from 'date-fns/format';
import { LinearProgress } from '@material-ui/core';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
import ZapInButton from '../../../../components/ZapInButton';
import {
  Addresses,
  ERC20,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
  Aggregation1inchRouterV4__factory,
} from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import cx from 'classnames';
import styles from './styles.module.scss';
import Withdraw from './Withdraw';
import ZapIn from '../../../../components/ZapIn';
import { isNaN, useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import ZapOutButton from '../../../../components/ZapOutButton';
import { Tabs, PanelList, Panel } from 'react-swipeable-tab';

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

const MAX_DEPOSIT = {
  ETH: 25000,
  RPDX: 100000,
  DPX: 100000,
  GMX: 100000,
  BNB: 100000,
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
  const { accountAddress, chainId, provider, contractAddresses, signer } =
    useContext(WalletContext);
  const aggregation1inchRouter = Aggregation1inchRouterV4__factory.connect(
    Addresses[chainId]['1inchRouter'],
    signer
  );
  const erc20SSOV1inchRouter = ERC20SSOV1inchRouter__factory.connect(
    '0xC296C505207E34FE8aFaC9d0B1ceD6ff17d0e89a',
    signer
  ); // TODO CHANGE WITH SDK ADDRESS
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const containerRef = React.useRef(null);
  const ssovTokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);
  const { ssovContractWithSigner, ssovRouter } = ssovSignerArray[selectedSsov];
  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);
  const { userEpochStrikeDeposits, userEpochDeposits } =
    userSsovDataArray[selectedSsov];
  const {
    epochTimes,
    isVaultReady,
    epochStrikes,
    totalEpochStrikeDeposits,
    totalEpochDeposits,
  } = ssovDataArray[selectedSsov];

  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: number | string;
  }>({});
  const [error, setError] = useState('');
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovProperties.tokenName)
      ? ssovProperties.tokenName
      : ssovSignerArray[selectedSsov].token[0]
  );
  const [tokenName, setTokenName] = useState<string>(ssovTokenSymbol);
  const ssovToken = ssovSignerArray[selectedSsov].token[0];
  const [latestZapInAmount, setLatestZapInAmount] = useState<number>(0);
  const formik = useFormik({
    initialValues: {
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
      return errors;
    },
    onSubmit: noop,
  });
  const debouncedZapInAmount = useDebounce(formik.values.zapInAmount, 1000);

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'].toUpperCase() === tokenName.toUpperCase())
        price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

  const extraHeight: number = useMemo(() => {
    if (isZapInVisible) return 10;
    if (activeTab === 'deposit') return selectedStrikeIndexes.length * 2.6;
    else if (activeTab === 'withdraw') return 0;
  }, [activeTab, selectedStrikeIndexes, isZapInVisible]);

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady) return false;
    return true;
  }, [isVaultReady]);

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

  const spender = isZapActive
    ? erc20SSOV1inchRouter.address
    : ssovContractWithSigner.address;

  const purchasePower =
    isZapActive && quote['toToken'] && denominationTokenName === ssovTokenName
      ? getUserReadableAmount(
          quote['toTokenAmount'],
          quote['toToken']['decimals']
        ) /
        (1 + slippageTolerance / 100)
      : getUserReadableAmount(userTokenBalance, 18);

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

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    await getQuote();
  };

  const totalEpochStrikeDepositsAmounts = totalEpochStrikeDeposits.map(
    (deposit) =>
      ssovTokenSymbol === 'BNB'
        ? getUserReadableAmount(deposit, 8).toString()
        : getUserReadableAmount(deposit, 18).toString()
  );

  const totalEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(totalEpochDeposits, 8).toString()
      : getUserReadableAmount(totalEpochDeposits, 18).toString();

  const userEpochStrikeDepositsAmounts = userEpochStrikeDeposits.map(
    (deposit) =>
      ssovTokenSymbol === 'BNB'
        ? getUserReadableAmount(deposit, 8).toString()
        : getUserReadableAmount(deposit, 18).toString()
  );

  const userEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(userEpochDeposits, 8).toString()
      : getUserReadableAmount(userEpochDeposits, 18).toString();

  // Handles strikes & deposit amounts
  const handleSelectStrikes = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedStrikeIndexes((event.target.value as number[]).sort());
    },
    []
  );

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
        if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.depositMultiple(
              strikeIndexes,
              strikeIndexes.map((index) => strikeDepositAmounts[index]),
              accountAddress
            )
          );
        } else {
          await sendTx(
            ssovRouter.depositMultiple(
              strikeIndexes,
              strikeIndexes.map((index) => strikeDepositAmounts[index]),
              accountAddress,
              {
                value: getContractReadableAmount(totalDepositAmount, 18),
              }
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
            18
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
          console.log(totalDepositAmount);
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
                value: getContractReadableAmount(totalDepositAmount, 18),
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
      `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
        totalDepositAmount * 10 ** fromTokenDecimals
      )}&fromAddress=${
        erc20SSOV1inchRouter.address
      }&slippage=${slippageTolerance}&disableEstimate=true`
    );
    setPath(data);
    setIsFetchingPath(false);
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

  useEffect(() => {
    getPath();
  }, [strikeDepositAmounts]);

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  useEffect(() => {
    getPriceImpact();
  }, [quote]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount = getContractReadableAmount(
        totalDepositAmount.toString(),
        18
      );

      if (IS_NATIVE(token)) {
        setApproved(true);
      } else {
        const allowance = await token.allowance(accountAddress, spender);
        setApproved(allowance.gte(finalAmount) ? true : false);
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
        18
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

  useEffect(() => {
    if (debouncedZapInAmount[0] !== latestZapInAmount) {
      getQuote();
      setLatestZapInAmount(debouncedZapInAmount[0]);
    }
  }, [debouncedZapInAmount]);

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4',
        styles.cardWidth
      )}
    >
      <Tabs activeIndex={activeIndex} panelIscroll={false}>
        {['deposit', 'withdraw'].includes(activeTab) && (
          <Box className={isZapInVisible ? 'hidden' : 'flex'}>
            <Box className={isZapActive ? 'w-2/3 mr-2' : 'w-full'}>
              <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
                <Box
                  className={
                    activeTab === 'deposit'
                      ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                      : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  }
                  onClick={() => setActiveTab('deposit')}
                >
                  <Typography variant="h6" className="text-xs font-normal">
                    Deposit
                  </Typography>
                </Box>
                <Box
                  className={
                    activeTab === 'withdraw'
                      ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                      : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  }
                  onClick={() => setActiveTab('withdraw')}
                >
                  <Typography variant="h6" className="text-xs font-normal">
                    Withdraw
                  </Typography>
                </Box>
              </Box>
            </Box>
            {isZapActive && (
              <Box className="w-1/3">
                <ZapOutButton
                  isZapActive={isZapActive}
                  handleClick={() => {
                    if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
                    else setToken(ssovToken);
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <PanelList style={{ height: 32 + extraHeight + 'rem' }}>
          <Panel>
            <Box>
              <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
                <Box className="flex">
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
                  >
                    Balance
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-white ml-auto mr-0 text-[0.72rem]"
                  >
                    {getUserReadableAmount(userTokenBalance, 18)} {tokenName}
                  </Typography>
                  {isZapActive && (
                    <svg
                      className="mt-1 ml-2"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.00001 0.34668C3.32668 0.34668 0.34668 3.32668 0.34668 7.00001C0.34668 10.6733 3.32668 13.6533 7.00001 13.6533C10.6733 13.6533 13.6533 10.6733 13.6533 7.00001C13.6533 3.32668 10.6733 0.34668 7.00001 0.34668Z"
                        fill="url(#paint0_linear_1600_23889)"
                      />
                      <path
                        d="M4.7472 10.1591L6.12719 7.76884L4.59144 6.88217C4.37782 6.75884 4.36682 6.44457 4.58074 6.31404L9.09539 3.40111C9.38485 3.20642 9.7381 3.54123 9.56143 3.84723L8.16477 6.26633L9.63124 7.11299C9.84486 7.23633 9.85342 7.54149 9.65104 7.67868L5.22234 10.6028C4.92378 10.7999 4.57053 10.4651 4.7472 10.1591Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_1600_23889"
                          x1="13.6533"
                          y1="15.5543"
                          x2="0.24448"
                          y2="0.437332"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#002EFF" />
                          <stop offset="1" stopColor="#22E1FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </Box>
                <Box className="mt-2 flex">
                  <Box className={isZapActive ? 'w-3/4 mr-3' : 'w-full'}>
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
                        <MenuItem
                          key={index}
                          value={index}
                          className="pb-2 pt-2"
                        >
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

                  {isZapActive && (
                    <Box className="w-1/4">
                      <Select
                        className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
                        fullWidth
                        displayEmpty
                        disableUnderline
                        value={[denominationTokenName]}
                        onChange={(e) => {
                          const symbol = e.target.value;
                          setDenomationTokenName(symbol.toString());
                        }}
                        input={<Input />}
                        variant="outlined"
                        renderValue={() => {
                          return (
                            <Typography
                              variant="h6"
                              className="text-white text-center w-full relative"
                            >
                              {denominationTokenName}
                            </Typography>
                          );
                        }}
                        MenuProps={SelectMenuProps}
                        classes={{
                          icon: 'absolute right-1 text-white scale-x-75',
                          select: 'overflow-hidden',
                        }}
                        label="tokens"
                      >
                        <MenuItem
                          key={tokenName}
                          value={tokenName}
                          className="pb-2 pt-2"
                        >
                          <Checkbox
                            className={
                              denominationTokenName.toUpperCase() ===
                              tokenName.toUpperCase()
                                ? 'p-0 text-white'
                                : 'p-0 text-white border'
                            }
                            checked={
                              denominationTokenName.toUpperCase() ===
                              tokenName.toUpperCase()
                            }
                          />
                          <Typography
                            variant="h5"
                            className="text-white text-left w-full relative ml-3"
                          >
                            {tokenName}
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          key={ssovTokenName}
                          value={ssovTokenName}
                          className="pb-2 pt-2"
                        >
                          <Checkbox
                            className={
                              denominationTokenName.toUpperCase() ===
                              ssovTokenName.toUpperCase()
                                ? 'p-0 text-white'
                                : 'p-0 text-white border'
                            }
                            checked={
                              denominationTokenName.toUpperCase() ===
                              ssovTokenName.toUpperCase()
                            }
                          />
                          <Typography
                            variant="h5"
                            className="text-white text-left w-full relative ml-3"
                          >
                            {ssovTokenName}
                          </Typography>
                        </MenuItem>
                      </Select>
                    </Box>
                  )}
                </Box>
                <Box className="mt-3">
                  {selectedStrikeIndexes.map((index) => (
                    <Box className="flex mb-3 group" key={index}>
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

                      <Box className="ml-auto mr-0">
                        <Input
                          disableUnderline={true}
                          name="address"
                          className="w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                          classes={{ input: 'text-white text-xs text-right' }}
                          value={strikeDepositAmounts[index]}
                          placeholder="0"
                          onChange={(e) => inputStrikeDepositAmount(index, e)}
                        />
                        <Box
                          className="absolute left-[10.2rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
                          onClick={() =>
                            inputStrikeDepositAmount(
                              index,
                              null,
                              parseFloat(
                                (
                                  getUserReadableAmount(userTokenBalance) * 0.99
                                ).toFixed(10)
                              )
                            )
                          }
                        >
                          <img
                            src="/assets/max.svg"
                            alt="MAX"
                            className="cursor-pointer"
                          />
                        </Box>
                        <Box
                          className="absolute left-[12.4rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
                          onClick={() =>
                            inputStrikeDepositAmount(
                              index,
                              null,
                              parseFloat(
                                (
                                  getUserReadableAmount(userTokenBalance) / 2
                                ).toFixed(10)
                              )
                            )
                          }
                        >
                          <img
                            src="/assets/half.svg"
                            alt="half"
                            className="cursor-pointer"
                          />
                        </Box>
                        <Box
                          className="absolute left-[13.8rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
                          onClick={() =>
                            inputStrikeDepositAmount(
                              index,
                              null,
                              parseFloat(
                                (
                                  getUserReadableAmount(userTokenBalance) / 3
                                ).toFixed(10)
                              )
                            )
                          }
                        >
                          <img
                            src="/assets/third.svg"
                            alt="third"
                            className="cursor-pointer"
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box className="mt-3.5">
                <Box className={'flex'}>
                  <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                    <Box className={'w-5/6'}>
                      <Typography variant="h5" className="text-white pb-1 pr-2">
                        {userEpochDepositsAmount !== '0'
                          ? formatAmount(userEpochDepositsAmount, 4)
                          : '-'}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz pb-1 pr-2"
                      >
                        Deposit
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      {vaultShare > 0 ? formatAmount(vaultShare, 4) + '%' : '-'}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
                      Vault Share
                    </Typography>
                  </Box>
                </Box>

                <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
                  <Box className={'flex mb-1'}>
                    <Typography
                      variant="h6"
                      className="text-stieglitz ml-0 mr-auto"
                    >
                      Epoch
                    </Typography>
                    <Box className={'text-right'}>
                      <Typography
                        variant="h6"
                        className="text-white mr-auto ml-0"
                      >
                        {ssovProperties.selectedEpoch}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={'flex mb-1'}>
                    <Typography
                      variant="h6"
                      className="text-stieglitz ml-0 mr-auto"
                    >
                      Withdrawable
                    </Typography>
                    <Box className={'text-right'}>
                      <Typography
                        variant="h6"
                        className="text-white mr-auto ml-0"
                      >
                        {epochTimes[1]
                          ? format(new Date(epochTimes[1] * 1000), 'd LLL yyyy')
                          : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  {false && (
                    <Box className={'flex mb-2'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Deposit Limit
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          {formatAmount(totalEpochDepositsAmount, 0)}{' '}
                          <span className="opacity-50">
                            / {formatAmount(MAX_DEPOSIT[ssovTokenSymbol], 4)}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {false && (
                    <Box className="mt-1">
                      <LinearProgress
                        value={
                          (100 * parseFloat(totalEpochDepositsAmount)) /
                          MAX_DEPOSIT[ssovTokenSymbol]
                        }
                        variant="determinate"
                        className="rounded-sm"
                      />
                    </Box>
                  )}
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
                  tokenName={tokenName}
                  ssovTokenSymbol={ssovTokenSymbol}
                  selectedTokenPrice={selectedTokenPrice}
                />

                <Box className="flex">
                  <Box className="flex text-center p-2 mr-2 mt-1">
                    <svg
                      width="16"
                      height="21"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5001 7.33317H12.5834V5.49984C12.5834 2.96984 10.5301 0.916504 8.00008 0.916504C5.47008 0.916504 3.41675 2.96984 3.41675 5.49984V7.33317H2.50008C1.49175 7.33317 0.666748 8.15817 0.666748 9.1665V18.3332C0.666748 19.3415 1.49175 20.1665 2.50008 20.1665H13.5001C14.5084 20.1665 15.3334 19.3415 15.3334 18.3332V9.1665C15.3334 8.15817 14.5084 7.33317 13.5001 7.33317ZM5.25008 5.49984C5.25008 3.97817 6.47841 2.74984 8.00008 2.74984C9.52175 2.74984 10.7501 3.97817 10.7501 5.49984V7.33317H5.25008V5.49984ZM12.5834 18.3332H3.41675C2.91258 18.3332 2.50008 17.9207 2.50008 17.4165V10.0832C2.50008 9.579 2.91258 9.1665 3.41675 9.1665H12.5834C13.0876 9.1665 13.5001 9.579 13.5001 10.0832V17.4165C13.5001 17.9207 13.0876 18.3332 12.5834 18.3332ZM8.00008 15.5832C9.00841 15.5832 9.83341 14.7582 9.83341 13.7498C9.83341 12.7415 9.00841 11.9165 8.00008 11.9165C6.99175 11.9165 6.16675 12.7415 6.16675 13.7498C6.16675 14.7582 6.99175 15.5832 8.00008 15.5832Z"
                        fill="#8E8E8E"
                      />
                    </svg>
                  </Box>
                  {!isDepositWindowOpen ? (
                    <Typography variant="h6" className="text-stieglitz">
                      Deposits for Epoch {ssovProperties.currentEpoch + 1} will
                      open on
                      <br />
                      <span className="text-white">
                        {epochTimes[1]
                          ? format(
                              new Date(epochTimes[1] * 1000),
                              'd LLLL yyyy'
                            )
                          : '-'}
                      </span>
                    </Typography>
                  ) : (
                    <Typography variant="h6" className="text-stieglitz">
                      Withdrawals are locked until end of Epoch{' '}
                      {ssovProperties.currentEpoch + 1} {'   '}
                      <span className="text-white">
                        {epochTimes[1]
                          ? format(
                              new Date(epochTimes[1] * 1000),
                              'd LLLL yyyy'
                            )
                          : '-'}
                      </span>
                    </Typography>
                  )}
                </Box>

                <CustomButton
                  size="medium"
                  className="w-full mt-4 !rounded-md"
                  color={
                    (isPurchasePowerEnough || !approved) &&
                    isDepositWindowOpen &&
                    totalDepositAmount > 0
                      ? 'primary'
                      : 'mineshaft'
                  }
                  disabled={
                    !isPurchasePowerEnough ||
                    !isDepositWindowOpen ||
                    totalDepositAmount <= 0
                  }
                  onClick={approved ? handleDeposit : handleApprove}
                >
                  {!isDepositWindowOpen && isVaultReady && (
                    <Countdown
                      date={new Date(epochTimes[1] * 1000)}
                      renderer={({
                        days,
                        hours,
                        minutes,
                        seconds,
                        completed,
                      }) => (
                        <Box className="text-stieglitz flex">
                          <svg
                            className="mr-2"
                            width="12"
                            height="17"
                            viewBox="0 0 12 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.5 6H9.75V4.5C9.75 2.43 8.07 0.75 6 0.75C3.93 0.75 2.25 2.43 2.25 4.5V6H1.5C0.675 6 0 6.675 0 7.5V15C0 15.825 0.675 16.5 1.5 16.5H10.5C11.325 16.5 12 15.825 12 15V7.5C12 6.675 11.325 6 10.5 6ZM3.75 4.5C3.75 3.255 4.755 2.25 6 2.25C7.245 2.25 8.25 3.255 8.25 4.5V6H3.75V4.5ZM9.75 15H2.25C1.8375 15 1.5 14.6625 1.5 14.25V8.25C1.5 7.8375 1.8375 7.5 2.25 7.5H9.75C10.1625 7.5 10.5 7.8375 10.5 8.25V14.25C10.5 14.6625 10.1625 15 9.75 15ZM6 12.75C6.825 12.75 7.5 12.075 7.5 11.25C7.5 10.425 6.825 9.75 6 9.75C5.175 9.75 4.5 10.425 4.5 11.25C4.5 12.075 5.175 12.75 6 12.75Z"
                              fill="white"
                              fillOpacity="0.2"
                            />
                          </svg>

                          <span className="opacity-70">
                            {days}D {hours}H {minutes}M
                          </span>
                        </Box>
                      )}
                    />
                  )}
                  {isDepositWindowOpen
                    ? approved
                      ? totalDepositAmount === 0
                        ? 'Insert an amount'
                        : isPurchasePowerEnough
                        ? 'Deposit'
                        : 'Insufficient balance'
                      : 'Approve'
                    : ''}
                </CustomButton>
              </Box>
            </Box>
          </Panel>
          <Panel>
            <Withdraw ssovProperties={ssovProperties} />
          </Panel>
          <Panel>
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
              isInDialog={false}
            />
          </Panel>
        </PanelList>
      </Tabs>
    </Box>
  );
};

export default ManageCard;
