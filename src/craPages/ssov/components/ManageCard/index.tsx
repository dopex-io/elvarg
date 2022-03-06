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
  Curve2PoolSsovPut1inchRouter__factory,
} from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import cx from 'classnames';
import format from 'date-fns/format';
import { isNaN } from 'formik';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';
import { AssetsContext, IS_NATIVE, CHAIN_ID_TO_NATIVE } from 'contexts/Assets';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';
import ZapInButton from 'components/ZapInButton';
import ZapIn from 'components/ZapIn';
import ZapOutButton from 'components/ZapOutButton';
import Curve2PoolDepositSelector from './Curve2PoolDepositSelector';
import Withdraw from './Withdraw';

import useSendTx from 'hooks/useSendTx';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import get1inchQuote from 'utils/general/get1inchQuote';

import { MAX_VALUE, SSOV_MAP } from 'constants/index';

import ZapIcon from 'components/Icons/ZapIcon';
import TransparentCrossIcon from 'components/Icons/TransparentCrossIcon';
import ArrowRightIcon from 'components/Icons/ArrowRightIcon';
import LockerIcon from 'components/Icons/LockerIcon';
import WhiteLockerIcon from 'components/Icons/WhiteLockerIcon';

import styles from './styles.module.scss';

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ManageCard = () => {
  const { accountAddress, chainId, provider, signer, contractAddresses } =
    useContext(WalletContext);
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const {
    updateSsovEpochData,
    updateSsovUserData,
    ssovData,
    ssovEpochData,
    ssovUserData,
    ssovSigner,
    selectedSsov,
  } = useContext(SsovContext);

  const sendTx = useSendTx();

  const isPut = useMemo(() => selectedSsov.type === 'PUT', [selectedSsov.type]);

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

  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(true);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);
  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);
  const [selectedStrikeIndexes, setSelectedStrikeIndexes] = useState<number[]>(
    []
  );
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: number | string;
  }>({});
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const ssovTokenSymbol = SSOV_MAP[ssovData.tokenName].tokenSymbol;
  const { ssovContractWithSigner, ssovRouter } = ssovSigner;
  const userEpochDeposits = ssovUserData
    ? ssovUserData.userEpochDeposits
    : BigNumber.from(0);
  const { epochTimes, isVaultReady, epochStrikes, totalEpochDeposits } =
    ssovEpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [activeTab, setActiveTab] = useState(0);
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const ssovToken =
    ssovSigner.token[0] ||
    (contractAddresses['2CRV']
      ? ERC20__factory.connect(contractAddresses['2CRV'], provider)
      : null);

  const [token, setToken] = useState<ERC20 | any>(
    IS_NATIVE(ssovData.tokenName) ? ssovData.tokenName : ssovToken
  );

  const [depositTokenName, setDepositTokenName] = useState<string>('2CRV');

  const [tokenName, setTokenName] = useState<string>(ssovTokenSymbol);
  const ssovTokenName = ssovData.tokenName;

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'].toUpperCase() === tokenName.toUpperCase())
        price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady) return false;
    return true;
  }, [isVaultReady]);

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      const fromTokenAddress: string = IS_NATIVE(token)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : token.address;
      const toTokenAddress = IS_NATIVE(ssovTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : ssovToken.address;

      if (fromTokenAddress === toTokenAddress) return;

      const amount = (10 ** getTokenDecimals(tokenName, chainId)).toString();

      const quote = await get1inchQuote({
        fromTokenAddress,
        toTokenAddress,
        amount,
        chainId,
        accountAddress,
      });

      setQuote(quote);
    }

    updateQuote();
  }, [
    accountAddress,
    chainId,
    contractAddresses,
    ssovToken,
    ssovTokenName,
    token,
    tokenName,
  ]);

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
    return (
      tokenName.toUpperCase() !== ssovTokenSymbol.toUpperCase() &&
      tokenName.toUpperCase() !== '2CRV'
    );
  }, [tokenName, ssovTokenSymbol]);

  const [denominationTokenName, setDenominationTokenName] =
    useState<string>(ssovTokenName);

  const spender = useMemo(() => {
    if (isPut) {
      if (depositTokenName === '2CRV') {
        return ssovData.ssovContract.address;
      } else {
        return '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564';
      }
    } else if (isZapActive) {
      if (IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB') {
        return nativeSSOV1inchRouter?.address;
      } else if (tokenName.toLocaleUpperCase() === 'VBNB') {
        return ssovContractWithSigner?.address;
      } else {
        return erc20SSOV1inchRouter?.address;
      }
    } else if (ssovTokenName === 'BNB') {
      return ssovRouter.address;
    } else {
      return ssovContractWithSigner?.address;
    }
  }, [
    depositTokenName,
    erc20SSOV1inchRouter,
    isPut,
    isZapActive,
    nativeSSOV1inchRouter,
    ssovContractWithSigner,
    ssovData,
    ssovRouter,
    ssovTokenName,
    tokenName,
  ]);

  const quotePrice: number = useMemo(() => {
    if (!quote['toTokenAmount']) return 0;
    return (
      getUserReadableAmount(
        quote['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        quote['fromTokenAmount'],
        quote['fromToken']['decimals']
      )
    );
  }, [quote]);

  const purchasePower =
    isZapActive &&
    quote['toToken'] &&
    (denominationTokenName === ssovTokenName || isZapInAvailable)
      ? getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(tokenName, chainId)
        ) * quotePrice
      : getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(tokenName, chainId)
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
    if (isPut) return true;
    return (
      purchasePower >=
      (denominationTokenName.toLocaleUpperCase() === ssovTokenName
        ? totalDepositAmount
        : totalDepositAmount * quotePrice)
    );
  }, [
    isPut,
    purchasePower,
    denominationTokenName,
    ssovTokenName,
    totalDepositAmount,
    quotePrice,
  ]);

  const getValueInUsd = (symbol) => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === symbol) {
        value =
          (record['price'] * parseInt(userAssetBalances[symbol])) /
          10 ** getTokenDecimals(symbol, chainId);
      }
    });
    return value;
  };

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = [CHAIN_ID_TO_NATIVE[chainId]]
        .concat(tokens)
        .filter(function (item) {
          return (
            item !== ssovTokenSymbol &&
            (Addresses[chainId][item] || CHAIN_ID_TO_NATIVE[chainId] === item)
          );
        })
        .sort((a, b) => {
          return getValueInUsd(b) - getValueInUsd(a);
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

  const handleTokenChange = useCallback(async () => {
    if (!token) return;
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    setDenominationTokenName(symbol);
  }, [token]);

  const totalEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(totalEpochDeposits, 8).toString()
      : getUserReadableAmount(totalEpochDeposits, 18).toString();

  const userEpochDepositsAmount =
    ssovTokenSymbol === 'BNB'
      ? getUserReadableAmount(userEpochDeposits, 8).toString()
      : getUserReadableAmount(userEpochDeposits, 18).toString();

  // Handles strikes & deposit amounts
  const handleSelectStrikes = useCallback((event) => {
    setSelectedStrikeIndexes((event.target.value as number[]).sort());
  }, []);

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

  const getPath = useCallback(async () => {
    if (!isZapActive || tokenName.toLocaleUpperCase() === 'VBNB') return;
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = IS_NATIVE(ssovTokenName)
      ? ssovTokenName === 'BNB'
        ? Addresses[chainId]['VBNB']
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : ssovToken.address;

    if (!quote['toToken']) {
      setIsFetchingPath(false);
      return;
    }

    let amount: number =
      (denominationTokenName === ssovTokenName
        ? totalDepositAmount / quotePrice
        : totalDepositAmount) *
      10 ** getTokenDecimals(tokenName, chainId);

    let attempts: number = 0;
    let bestPath: {} = {};
    let minAmount: number = Math.round(
      totalDepositAmount *
        quotePrice *
        10 ** getTokenDecimals(ssovTokenSymbol, chainId)
    );

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
        setIsFetchingPath(false);
        break;
      }
      attempts += 1;
      amount = Math.round(amount * 1.01);
    }

    setPath(bestPath);
    setIsFetchingPath(false);
    return bestPath;
  }, [
    chainId,
    isZapActive,
    quote,
    slippageTolerance,
    spender,
    ssovToken?.address,
    ssovTokenName,
    denominationTokenName,
    ssovTokenSymbol,
    totalDepositAmount,
    quotePrice,
    tokenName,
    token,
  ]);

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
        ERC20__factory.connect(
          isPut ? contractAddresses[depositTokenName] : token.address,
          signer
        ).approve(spender, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [
    token,
    sendTx,
    signer,
    spender,
    contractAddresses,
    isPut,
    depositTokenName,
  ]);

  const handlePutDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          contractReadableStrikeDepositAmounts[index] &&
          contractReadableStrikeDepositAmounts[index].gt('0')
      );
      if (depositTokenName === '2CRV') {
        await sendTx(
          ssovContractWithSigner.depositMultiple(
            strikeIndexes,
            strikeIndexes.map((index) =>
              getContractReadableAmount(
                strikeDepositAmounts[index],
                getTokenDecimals(depositTokenName, chainId)
              )
            ),
            accountAddress
          )
        );
      } else if (depositTokenName === 'USDT' || depositTokenName === 'USDC') {
        const curve2PoolSsovPut1inchRouter =
          Curve2PoolSsovPut1inchRouter__factory.connect(
            '0xCE2033d5081b21fC4Ba9C3B8b7A839bD352E7564',
            signer
          );

        await sendTx(
          curve2PoolSsovPut1inchRouter.swapAndDepositMultipleFromSingle(
            getContractReadableAmount(
              totalDepositAmount,
              getTokenDecimals(depositTokenName, chainId)
            ),
            contractAddresses[depositTokenName],
            strikeIndexes,
            strikeIndexes.map((index) =>
              ethers.utils
                .parseEther(strikeDepositAmounts[index].toString())
                .sub(
                  ethers.utils.parseEther(
                    (
                      parseInt(strikeDepositAmounts[index].toString()) * 0.01
                    ).toString()
                  )
                )
            ),
            accountAddress,
            ssovData.ssovContract.address
          )
        );
      }
      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateSsovUserData();
    } catch (err) {
      console.log(err);
    }
  }, [
    contractAddresses,
    accountAddress,
    contractReadableStrikeDepositAmounts,
    depositTokenName,
    selectedStrikeIndexes,
    sendTx,
    signer,
    ssovContractWithSigner,
    ssovData,
    strikeDepositAmounts,
    totalDepositAmount,
    updateAssetBalances,
    updateSsovUserData,
    chainId,
  ]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
      const strikeIndexes = selectedStrikeIndexes.filter(
        (index) =>
          contractReadableStrikeDepositAmounts[index] &&
          contractReadableStrikeDepositAmounts[index].gt('0')
      );

      if (ssovTokenName.toLocaleUpperCase() === tokenName.toLocaleUpperCase()) {
        if (ssovTokenName === 'BNB') {
          await sendTx(
            ssovRouter.depositMultiple(
              strikeIndexes,
              strikeIndexes.map(
                (index) => contractReadableStrikeDepositAmounts[index]
              ),
              accountAddress,
              {
                value: getContractReadableAmount(
                  totalDepositAmount,
                  getTokenDecimals(ssovTokenName, chainId)
                ),
              }
            )
          );
        } else if (IS_NATIVE(ssovTokenName)) {
          await sendTx(
            ssovContractWithSigner.depositMultiple(
              strikeIndexes,
              strikeIndexes.map(
                (index) => contractReadableStrikeDepositAmounts[index]
              ),
              accountAddress,
              {
                value: getContractReadableAmount(
                  totalDepositAmount,
                  getTokenDecimals(ssovTokenName, chainId)
                ),
              }
            )
          );
        } else {
          await sendTx(
            ssovContractWithSigner.depositMultiple(
              strikeIndexes,
              strikeIndexes.map(
                (index) => contractReadableStrikeDepositAmounts[index]
              ),
              accountAddress
            )
          );
        }
      } else if (tokenName.toLocaleUpperCase() === 'VBNB') {
        await sendTx(
          ssovContractWithSigner.depositMultiple(
            strikeIndexes,
            strikeIndexes.map((index) =>
              getContractReadableAmount(
                strikeDepositAmounts[index],
                getTokenDecimals(tokenName, chainId)
              )
            ),
            accountAddress
          )
        );
      } else {
        const bestPath = await getPath();

        const decoded = aggregation1inchRouter.interface.decodeFunctionData(
          'swap',
          bestPath['tx']['data']
        );

        const toTokenAmount: BigNumber = BigNumber.from(
          bestPath['toTokenAmount']
        );

        let total = BigNumber.from('0');
        let amounts = [];

        strikeIndexes.map((index) => {
          const amount = getContractReadableAmount(
            // @ts-ignore
            strikeDepositAmounts[index] *
              (denominationTokenName.toUpperCase() !==
              ssovTokenName.toUpperCase()
                ? quotePrice
                : 1),
            getTokenDecimals(ssovTokenName, chainId)
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
          await sendTx(
            erc20SSOV1inchRouter.swapNativeAndDepositMultiple(
              ssovData.ssovContract.address,
              ssovToken.address,
              decoded[0],
              decoded[1],
              decoded[2],
              strikeIndexes,
              amounts,
              accountAddress,
              {
                value: bestPath['fromTokenAmount'],
              }
            )
          );
        } else {
          if (IS_NATIVE(ssovTokenName) && ssovTokenName !== 'BNB') {
            await sendTx(
              nativeSSOV1inchRouter.swapAndDepositMultiple(
                decoded[0],
                decoded[1],
                decoded[2],
                strikeIndexes,
                amounts,
                accountAddress
              )
            );
          } else {
            await sendTx(
              erc20SSOV1inchRouter.swapAndDepositMultiple(
                ssovData.ssovContract.address,
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
      }

      setStrikeDepositAmounts(() => ({}));
      setSelectedStrikeIndexes(() => []);
      updateAssetBalances();
      updateSsovEpochData();
      updateSsovUserData();
      setIsFetchingPath(false);
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedStrikeIndexes,
    ssovTokenName,
    tokenName,
    updateAssetBalances,
    updateSsovEpochData,
    updateSsovUserData,
    contractReadableStrikeDepositAmounts,
    sendTx,
    ssovRouter,
    accountAddress,
    totalDepositAmount,
    ssovContractWithSigner,
    strikeDepositAmounts,
    getPath,
    aggregation1inchRouter,
    denominationTokenName,
    quotePrice,
    erc20SSOV1inchRouter,
    ssovData,
    ssovToken,
    nativeSSOV1inchRouter,
    chainId,
  ]);

  const checkDEXAggregatorStatus = useCallback(async () => {
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
  }, [chainId, erc20SSOV1inchRouter, nativeSSOV1inchRouter]);

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, [checkDEXAggregatorStatus]);

  useEffect(() => {
    getPath();
  }, [getPath]);

  useEffect(() => {
    handleTokenChange();
  }, [handleTokenChange]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount: BigNumber = getContractReadableAmount(
        totalDepositAmount.toString(),
        getTokenDecimals(ssovTokenName, chainId)
      );
      if (isPut) {
        const allowance: BigNumber = await ERC20__factory.connect(
          contractAddresses[depositTokenName],
          signer
        ).allowance(accountAddress, spender);
        setApproved(allowance.gte(finalAmount));
      } else if (IS_NATIVE(token)) {
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
    contractAddresses,
    depositTokenName,
    isPut,
    spender,
    signer,
    ssovTokenName,
    chainId,
  ]);

  // Updates user token balance
  useEffect(() => {
    if (!token || !accountAddress) return;
    (async function () {
      let userAmount = IS_NATIVE(token)
        ? BigNumber.from(userAssetBalances[token])
        : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);
    })();
  }, [accountAddress, token, userAssetBalances, ssovTokenName]);

  const userBalance = useMemo(() => {
    {
      if (isPut) {
        return ethers.utils.formatUnits(
          userAssetBalances[depositTokenName],
          getTokenDecimals(depositTokenName, chainId)
        );
      } else {
        return denominationTokenName.toLocaleUpperCase() !== ssovTokenName
          ? getUserReadableAmount(
              userAssetBalances[denominationTokenName.toLocaleUpperCase()],
              getTokenDecimals(denominationTokenName, chainId)
            )
          : purchasePower;
      }
    }
  }, [
    purchasePower,
    denominationTokenName,
    ssovTokenName,
    userAssetBalances,
    depositTokenName,
    isPut,
    chainId,
  ]);

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4',
        styles.cardWidth
      )}
    >
      <Box className={isZapInVisible ? 'hidden' : 'flex'}>
        <Box className={isZapActive ? 'w-2/3 mr-2' : 'w-full'}>
          <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
            <Box
              className={
                activeTab === 0
                  ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                  : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
              }
              onClick={() => setActiveTab(0)}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Deposit
              </Typography>
            </Box>
            <Box
              className={
                activeTab === 1
                  ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                  : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
              }
              onClick={() => setActiveTab(1)}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Withdraw
              </Typography>
            </Box>
          </Box>
        </Box>
        {isZapActive ? (
          <Box className="w-1/3">
            <ZapOutButton
              isZapActive={isZapActive}
              handleClick={() => {
                if (IS_NATIVE(ssovTokenName)) setToken(ssovTokenName);
                else setToken(ssovToken);
              }}
            />
          </Box>
        ) : null}
      </Box>
      {isZapInVisible ? (
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
          isInDialog={false}
          ssovToken={ssovToken}
        />
      ) : (
        <>
          <TabPanel value={activeTab} index={0}>
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
                    {userBalance}{' '}
                    {isPut ? depositTokenName : denominationTokenName}
                  </Typography>
                  {isZapActive ? (
                    <ZapIcon className={'mt-1 ml-2'} id="4" />
                  ) : null}
                </Box>
                <Box className="mt-2 flex">
                  <Box
                    className={isPut || isZapActive ? 'w-3/4 mr-3' : 'w-full'}
                  >
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
                        icon: 'absolute right-7 text-white',
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
                  {selectedSsov.type === 'PUT' ? (
                    <Curve2PoolDepositSelector
                      depositTokenName={depositTokenName}
                      setDepositTokenName={setDepositTokenName}
                    />
                  ) : isZapActive ? (
                    <Box className="w-1/4">
                      <Select
                        className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
                        fullWidth
                        displayEmpty
                        disableUnderline
                        value={[denominationTokenName]}
                        onChange={(e) => {
                          const symbol = e.target.value;
                          setDenominationTokenName(symbol.toString());
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
                  ) : null}
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
                        <TransparentCrossIcon className="ml-2" />
                      </Button>
                      <ArrowRightIcon className="ml-4 mt-2.5" />
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
                        {ssovData?.currentEpoch}
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
                </Box>
              </Box>
              <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-4">
                <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
                  <EstimatedGasCostButton gas={500000} chainId={chainId} />
                </Box>
                <ZapInButton
                  openZapIn={openZapIn}
                  isZapActive={isZapActive}
                  quote={quote}
                  path={path}
                  isFetchingPath={
                    isFetchingPath &&
                    Object.keys(strikeDepositAmounts).length > 0
                  }
                  tokenName={tokenName}
                  ssovTokenSymbol={ssovTokenSymbol}
                  selectedTokenPrice={selectedTokenPrice}
                  isZapInAvailable={isPut ? false : isZapInAvailable}
                  chainId={chainId}
                />
                <Box className="flex">
                  <Box className="flex text-center p-2 mr-2 mt-1">
                    <LockerIcon />
                  </Box>
                  {!isDepositWindowOpen ? (
                    <Typography variant="h6" className="text-stieglitz">
                      Deposits for Epoch {ssovData.currentEpoch + 1} will open
                      on
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
                      {ssovData.currentEpoch + 1} {'   '}
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
                    totalDepositAmount <= 0 ||
                    path['error']
                  }
                  onClick={
                    approved
                      ? isPut
                        ? handlePutDeposit
                        : handleDeposit
                      : handleApprove
                  }
                >
                  {!isDepositWindowOpen && isVaultReady && (
                    <Countdown
                      date={new Date(epochTimes[1] * 1000)}
                      renderer={({ days, hours, minutes }) => (
                        <Box className="text-stieglitz flex">
                          <WhiteLockerIcon className="mr-2" />
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
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {ssovUserData ? <Withdraw /> : null}
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default ManageCard;
