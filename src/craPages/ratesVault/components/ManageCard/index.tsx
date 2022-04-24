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
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { WalletContext } from 'contexts/Wallet';
import { RateVaultContext } from 'contexts/RateVault';
import { AssetsContext, IS_NATIVE, CHAIN_ID_TO_NATIVE } from 'contexts/Assets';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';
import ZapInButton from 'components/ZapInButton';
import ZapIn from 'components/ZapIn';
import ZapOutButton from 'components/ZapOutButton';
import Curve2PoolDepositSelector from './Curve2PoolDepositSelector';

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

export interface Props {
  activeVaultContextSide: string;
  setActiveVaultContextSide: Function;
}

const ManageCard = ({
  activeVaultContextSide,
  setActiveVaultContextSide,
}: Props) => {
  const { accountAddress, chainId, provider, signer, contractAddresses } =
    useContext(WalletContext);
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const rateVaultContext = useContext(RateVaultContext);
  const { selectedEpoch } = rateVaultContext;

  const sendTx = useSendTx();

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
  const [selectedCallLeverages, setSelectedCallLeverages] = useState<{
    [key: number]: number | string;
  }>({});
  const [selectedPutLeverages, setSelectedPutLeverages] = useState<{
    [key: number]: number | string;
  }>({});
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: number | string;
  }>({});
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const userEpochDeposits = BigNumber.from(0);

  const { epochTimes, isVaultReady, epochStrikes } =
    rateVaultContext.rateVaultEpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const ssovTokenName = '2CRV';
  const [depositTokenName, setDepositTokenName] = useState<string>('2CRV');

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'].toUpperCase() === depositTokenName.toUpperCase())
        price = record['price'];
    });
    return price;
  }, [tokenPrices, depositTokenName]);

  const allowedLeverageValues = useMemo(() => {
    const leverages = [];

    if (!rateVaultContext.rateVaultEpochData) return leverages;

    rateVaultContext.rateVaultEpochData.callsLeverages.map((leverage) =>
      leverages.push(leverage.toNumber())
    );

    return leverages;
  }, [rateVaultContext, activeVaultContextSide]);

  const isLeverageOk: boolean = useMemo(() => {
    for (let i in selectedCallLeverages)
      if (selectedPutLeverages[i] === 0 && selectedCallLeverages[i] === 0)
        return false;

    return true;
  }, [selectedCallLeverages, selectedPutLeverages]);

  const selectedCallLeveragesIndexes = useMemo(() => {
    const indexes: number[] = [];
    for (let i in selectedCallLeverages) {
      for (let j in allowedLeverageValues) {
        if (allowedLeverageValues[j] === selectedCallLeverages[i])
          indexes.push(Number(j));
      }
    }
    return indexes;
  }, [selectedCallLeverages, allowedLeverageValues]);

  const selectedPutLeveragesIndexes = useMemo(() => {
    const indexes: number[] = [];
    for (let i in selectedPutLeverages) {
      for (let j in allowedLeverageValues) {
        if (allowedLeverageValues[j] === selectedPutLeverages[i])
          indexes.push(Number(j));
      }
    }
    return indexes;
  }, [selectedPutLeverages, allowedLeverageValues]);

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      const fromTokenAddress: string = IS_NATIVE(depositTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[depositTokenName];
      const toTokenAddress = IS_NATIVE(ssovTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[ssovTokenName];

      if (fromTokenAddress === toTokenAddress) return;

      const amount = (
        10 ** getTokenDecimals(depositTokenName, chainId)
      ).toString();

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
    ssovTokenName,
    depositTokenName,
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
      depositTokenName.toUpperCase() !== ssovTokenName.toUpperCase() &&
      depositTokenName.toUpperCase() !== '2CRV'
    );
  }, [depositTokenName, ssovTokenName]);

  const [denominationTokenName, setDenominationTokenName] =
    useState<string>(ssovTokenName);

  const spender = useMemo(() => {
    return '0x5E540CA541e155F07Cd321fD0254d7A4cF136b05';
  }, [depositTokenName]);

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
          getTokenDecimals(depositTokenName, chainId)
        ) * quotePrice
      : getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(depositTokenName, chainId)
        );

  const strikes = useMemo(() => {
    if (!epochStrikes) return [];
    return epochStrikes.map((strike) =>
      getUserReadableAmount(strike, 8).toString()
    );
  }, [epochStrikes]);

  const totalDepositAmount = useMemo(() => {
    let total = 0;
    Object.keys(strikeDepositAmounts).map((strike) => {
      total += parseFloat(strikeDepositAmounts[strike]);
    });
    return total;
  }, [strikeDepositAmounts]);

  const isPurchasePowerEnough = useMemo(() => {
    if (activeVaultContextSide === 'PUT') return true;
    return (
      purchasePower >=
      (denominationTokenName.toLocaleUpperCase() === ssovTokenName
        ? totalDepositAmount
        : totalDepositAmount * quotePrice)
    );
  }, [
    activeVaultContextSide,
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
            item !== ssovTokenName &&
            (Addresses[chainId][item] || CHAIN_ID_TO_NATIVE[chainId] === item)
          );
        })
        .sort((a, b) => {
          return getValueInUsd(b) - getValueInUsd(a);
        });

      setDenominationTokenName(filteredTokens[0]);
      setIsZapInVisible(true);
    }
  };

  const totalEpochDepositsAmount: number = useMemo(() => {
    return (
      getUserReadableAmount(
        rateVaultContext.rateVaultEpochData.totalCallsDeposits?.add(
          rateVaultContext.rateVaultEpochData.totalPutsDeposits
        ),
        18
      ) || 0
    );
  }, [rateVaultContext]);

  const handleSelectStrikes = useCallback((event) => {
    setSelectedStrikeIndexes(event.target.value as number[]);
  }, []);

  const handleSelectCallLeverages = (index, value) => {
    let _selectedCallLeverages = Object.assign({}, selectedCallLeverages);
    _selectedCallLeverages[index] = value;
    setSelectedCallLeverages(_selectedCallLeverages);
  };

  const handleSelectPutLeverages = (index, value) => {
    let _selectedPutLeverages = Object.assign({}, selectedPutLeverages);
    _selectedPutLeverages[index] = value;
    setSelectedPutLeverages(_selectedPutLeverages);
  };

  const vaultShare: number = useMemo(() => {
    return totalDepositAmount > 0
      ? (100 * totalDepositAmount) / totalEpochDepositsAmount
      : 0;
  }, [totalDepositAmount, totalEpochDepositsAmount]);

  const unselectStrike = (index) => {
    setSelectedStrikeIndexes(
      selectedStrikeIndexes.filter(function (item) {
        return item !== index;
      })
    );
  };

  const getPath = useCallback(async () => {}, [
    chainId,
    isZapActive,
    quote,
    slippageTolerance,
    spender,
    ssovTokenName,
    denominationTokenName,
    totalDepositAmount,
    quotePrice,
    depositTokenName,
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
          contractAddresses[depositTokenName],
          signer
        ).approve(spender, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [
    depositTokenName,
    sendTx,
    signer,
    spender,
    contractAddresses,
    activeVaultContextSide,
    depositTokenName,
  ]);

  const handlePutDeposit = useCallback(async () => {}, [
    contractAddresses,
    accountAddress,
    contractReadableStrikeDepositAmounts,
    depositTokenName,
    selectedStrikeIndexes,
    sendTx,
    signer,
    strikeDepositAmounts,
    totalDepositAmount,
    updateAssetBalances,
    chainId,
  ]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    if (depositTokenName === '2CRV') {
      rateVaultContext.rateVaultData.rateVaultContract
        .connect(signer)
        .deposit(
          selectedStrikeIndexes[0],
          selectedCallLeveragesIndexes[0] || 0,
          selectedPutLeveragesIndexes[0] || 0,
          getContractReadableAmount(strikeDepositAmounts[0], 18),
          accountAddress
        );
    }
    setStrikeDepositAmounts(() => ({}));
    setSelectedStrikeIndexes(() => []);
    setSelectedCallLeverages(() => []);
    setSelectedPutLeverages(() => []);
    setSelectedStrikeIndexes(() => []);
    updateAssetBalances();
    rateVaultContext.updateRateVaultEpochData();
    rateVaultContext.updateRateVaultUserData();
  }, [
    signer,
    updateAssetBalances,
    selectedStrikeIndexes,
    selectedCallLeverages,
    selectedPutLeverages,
    strikeDepositAmounts,
    accountAddress,
    depositTokenName,
    rateVaultContext,
    chainId,
    depositTokenName,
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

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount: BigNumber = getContractReadableAmount(
        totalDepositAmount.toString(),
        getTokenDecimals(ssovTokenName, chainId)
      );
      if (IS_NATIVE(depositTokenName)) {
        setApproved(true);
      } else if (contractAddresses[depositTokenName]) {
        const allowance: BigNumber = await ERC20__factory.connect(
          contractAddresses[depositTokenName],
          signer
        ).allowance(accountAddress, spender);

        console.log(allowance);

        setApproved(allowance.gte(finalAmount));
      }
    })();
  }, [
    depositTokenName,
    accountAddress,
    approved,
    totalDepositAmount,
    contractAddresses,
    activeVaultContextSide,
    spender,
    signer,
    ssovTokenName,
    chainId,
  ]);

  // Updates user token balance
  useEffect(() => {
    if (!depositTokenName || !accountAddress) return;
    (async function () {
      let userAmount = IS_NATIVE(depositTokenName)
        ? BigNumber.from(userAssetBalances[depositTokenName])
        : await ERC20__factory.connect(
            contractAddresses[depositTokenName],
            provider
          ).balanceOf(accountAddress);

      setUserTokenBalance(userAmount);
    })();
  }, [
    accountAddress,
    depositTokenName,
    userAssetBalances,
    ssovTokenName,
    provider,
  ]);

  const userBalance = useMemo(() => {
    {
      return ethers.utils.formatUnits(
        userAssetBalances[depositTokenName],
        getTokenDecimals(depositTokenName, chainId)
      );
    }
  }, [
    purchasePower,
    denominationTokenName,
    ssovTokenName,
    userAssetBalances,
    depositTokenName,
    activeVaultContextSide,
    chainId,
  ]);

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 lg:mt-0 mt-4',
        styles.cardWidth
      )}
    >
      <Box className={isZapInVisible ? 'hidden' : 'flex'}>
        <Box className={isZapActive ? 'w-2/3 mr-2' : 'w-full'}>
          <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
            <Box
              className={
                'text-center w-full pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
              }
            >
              <Typography variant="h6" className="text-xs font-normal">
                Deposit
              </Typography>
            </Box>
          </Box>
        </Box>
        {isZapActive ? (
          <Box className="w-1/3">
            <ZapOutButton
              isZapActive={isZapActive}
              handleClick={() => {
                setDenominationTokenName(ssovTokenName);
              }}
            />
          </Box>
        ) : null}
      </Box>
      {isZapInVisible ? (
        <ZapIn
          setOpen={setIsZapInVisible}
          toTokenSymbol={ssovTokenName}
          fromTokenSymbol={depositTokenName}
          setFromTokenSymbol={setDepositTokenName}
          userTokenBalance={userTokenBalance}
          quote={quote}
          setSlippageTolerance={setSlippageTolerance}
          slippageTolerance={slippageTolerance}
          purchasePower={purchasePower}
          selectedTokenPrice={selectedTokenPrice}
          isInDialog={false}
        />
      ) : (
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
                {activeVaultContextSide === 'PUT'
                  ? depositTokenName
                  : denominationTokenName}
              </Typography>
              {isZapActive ? <ZapIcon className={'mt-1 ml-2'} id="4" /> : null}
            </Box>
            <Box className="mt-2 flex">
              <Box className={'w-3/4 mr-3'}>
                <Select
                  className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
                  fullWidth
                  multiple
                  displayEmpty
                  value={selectedStrikeIndexes}
                  onChange={handleSelectStrikes}
                  input={<Input />}
                  disableUnderline={true}
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
                        {formatAmount(strike, 4)}%
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Curve2PoolDepositSelector
                depositTokenName={depositTokenName}
                setDepositTokenName={setDepositTokenName}
              />
            </Box>
            <Box className="mt-3">
              {selectedStrikeIndexes.length > 0 ? (
                <Box className="flex mb-1">
                  <Box className="ml-0 mr-1 w-[4.9rem]">
                    <Typography
                      variant="h6"
                      className="text-stieglitz text-[0.72rem]"
                    >
                      Strike
                    </Typography>
                  </Box>
                  <Box className="ml-2 mr-1">
                    <Typography
                      variant="h6"
                      className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
                    >
                      Amount
                    </Typography>
                  </Box>
                  <Box className="ml-auto mr-1">
                    <Typography
                      variant="h6"
                      className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
                    >
                      Call Lev.
                    </Typography>
                  </Box>
                  <Box className="ml-auto mr-1">
                    <Typography
                      variant="h6"
                      className="text-stieglitz mr-1 text-[0.72rem]"
                    >
                      Put Lev.
                    </Typography>
                  </Box>
                </Box>
              ) : null}
              {selectedStrikeIndexes.map((index) => (
                <Box className="flex mb-3 group" key={index}>
                  <Button
                    className="p-2 pl-4 pr-4 bg-mineshaft text-white hover:bg-mineshaft hover:opacity-80 font-normal cursor-pointer w-[4.9rem]"
                    disableRipple
                    onClick={() => unselectStrike(index)}
                  >
                    {formatAmount(strikes[index], 4)}%
                    <TransparentCrossIcon className="ml-2" />
                  </Button>
                  <Box className="ml-auto mr-1">
                    <Input
                      disableUnderline={true}
                      type="number"
                      className="w-[4.3rem] lg:w-[3.3rem] border-[#545454] pt-[1.7px] pb-[1.7px] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                      classes={{ input: 'text-white text-xs text-right' }}
                      value={strikeDepositAmounts[index]}
                      placeholder="0"
                      onChange={(e) => inputStrikeDepositAmount(index, e)}
                    />
                  </Box>
                  <Box className="ml-auto mr-0">
                    <Select
                      className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white w-[4.3rem] lg:w-[3.3rem] "
                      fullWidth
                      displayEmpty
                      value={selectedCallLeverages[index]}
                      onChange={(e) =>
                        handleSelectCallLeverages(index, Number(e.target.value))
                      }
                      input={<Input />}
                      disableUnderline={true}
                      variant="outlined"
                      renderValue={() => {
                        return (
                          <Typography
                            variant="h6"
                            className="text-white text-center w-full relative"
                          >
                            {selectedCallLeverages[index] || 0}
                          </Typography>
                        );
                      }}
                      MenuProps={SelectMenuProps}
                      classes={{
                        icon: 'absolute right-0 text-white scale-75',
                        select: 'overflow-hidden',
                      }}
                      label="strikes"
                    >
                      {allowedLeverageValues.map((leverage, i) => (
                        <MenuItem
                          key={i}
                          value={leverage}
                          className="pb-2 pt-2"
                        >
                          <Checkbox
                            className={
                              selectedCallLeverages[index] === leverage
                                ? 'p-0 text-white'
                                : 'p-0 text-white border'
                            }
                            checked={selectedCallLeverages[index] === leverage}
                          />
                          <Typography
                            variant="h5"
                            className="text-white text-left w-full relative ml-3"
                          >
                            {leverage}x
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box className="ml-auto mr-0">
                    <Select
                      className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white w-[4.3rem] lg:w-[3.3rem] "
                      fullWidth
                      displayEmpty
                      value={selectedPutLeverages[index]}
                      onChange={(e) =>
                        handleSelectPutLeverages(index, Number(e.target.value))
                      }
                      input={<Input />}
                      disableUnderline={true}
                      variant="outlined"
                      renderValue={() => {
                        return (
                          <Typography
                            variant="h6"
                            className="text-white text-center w-full relative"
                          >
                            {selectedPutLeverages[index] || 0}
                          </Typography>
                        );
                      }}
                      MenuProps={SelectMenuProps}
                      classes={{
                        icon: 'absolute right-0 text-white scale-75',
                        select: 'overflow-hidden',
                      }}
                      label="strikes"
                    >
                      {allowedLeverageValues.map((leverage, i) => (
                        <MenuItem
                          key={i}
                          value={leverage}
                          className="pb-2 pt-2"
                        >
                          <Checkbox
                            className={
                              selectedPutLeverages[index] === leverage
                                ? 'p-0 text-white'
                                : 'p-0 text-white border'
                            }
                            checked={selectedPutLeverages[index] === leverage}
                          />
                          <Typography
                            variant="h5"
                            className="text-white text-left w-full relative ml-3"
                          >
                            {leverage}x
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
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
                    {totalDepositAmount} {depositTokenName}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                    Deposit
                  </Typography>
                </Box>
              </Box>
              <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                <Typography variant="h5" className="text-white pb-1 pr-2">
                  {vaultShare > 0 ? formatAmount(vaultShare, 4) + '%' : '-'}
                </Typography>
                <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {Math.max(selectedEpoch, 1)}
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {epochTimes[1].gt(0)
                      ? format(
                          new Date(epochTimes[1].toNumber() * 1000),
                          'd LLL yyyy'
                        )
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
                isFetchingPath && Object.keys(strikeDepositAmounts).length > 0
              }
              fromTokenSymbol={depositTokenName}
              toTokenSymbol={ssovTokenName}
              selectedTokenPrice={selectedTokenPrice}
              isZapInAvailable={false}
              chainId={chainId}
            />
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <LockerIcon />
              </Box>
              {isVaultReady ? (
                <Typography variant="h6" className="text-stieglitz">
                  Deposits for Epoch {selectedEpoch + 1} will open on
                  <br />
                  <span className="text-white">
                    {epochTimes[1]
                      ? format(
                          new Date(epochTimes[1].toNumber() * 1000),
                          'd LLLL yyyy'
                        )
                      : '-'}
                  </span>
                </Typography>
              ) : (
                <Typography variant="h6" className="text-stieglitz">
                  Withdrawals are locked until end of Epoch {selectedEpoch + 1}{' '}
                  {'   '}
                  <span className="text-white">
                    {epochTimes[1]
                      ? format(
                          new Date(epochTimes[1].toNumber() * 1000),
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
                !isVaultReady &&
                isLeverageOk &&
                totalDepositAmount > 0
                  ? 'primary'
                  : 'mineshaft'
              }
              disabled={
                !isPurchasePowerEnough ||
                !isVaultReady ||
                totalDepositAmount <= 0 ||
                path['error'] ||
                !isLeverageOk
              }
              onClick={
                approved
                  ? activeVaultContextSide === 'PUT'
                    ? handlePutDeposit
                    : handleDeposit
                  : handleApprove
              }
            >
              {isVaultReady && (
                <Countdown
                  date={new Date(epochTimes[1].toNumber() * 1000)}
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
              {!isVaultReady
                ? approved
                  ? totalDepositAmount === 0
                    ? 'Insert an amount'
                    : isPurchasePowerEnough
                    ? isLeverageOk
                      ? 'Deposit'
                      : 'Set leverages'
                    : 'Insufficient balance'
                  : 'Approve'
                : ''}
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ManageCard;
