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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

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
  activeContextSide: string;
  setActiveContextSide: Function;
  enabledSides: string[];
}

const ManageCard = ({
  activeContextSide,
  setActiveContextSide,
  enabledSides,
}: Props) => {
  const { accountAddress, chainId, provider, signer, contractAddresses } =
    useContext(WalletContext);
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const [leverage, setLeverage] = useState<number>(100);
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
  const [strikeDepositAmounts, setStrikeDepositAmounts] = useState<{
    [key: number]: number | string;
  }>({});
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const userEpochDeposits = BigNumber.from(0);

  const [approved, setApproved] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const ssovToken = '2CRV';

  const [token, setToken] = useState<ERC20 | any>('ETH');

  const [depositTokenName, setDepositTokenName] = useState<string>('2CRV');

  const [tokenName, setTokenName] = useState<string>('ETH');
  const ssovTokenName = 'ETH';

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'].toUpperCase() === tokenName.toUpperCase())
        price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

  const isVaultReady = false;

  const isDepositWindowOpen = useMemo(() => {
    if (isVaultReady) return false;
    return true;
  }, [isVaultReady]);

  const contractReadableStrikeDepositAmounts = useMemo(() => {
    const readable: {
      [key: number]: BigNumber;
    } = {};
    Object.keys(strikeDepositAmounts).map((key) => {
      readable[key] = getContractReadableAmount(strikeDepositAmounts[key], 18);
    });
    return readable;
  }, [strikeDepositAmounts]);

  const isZapActive: boolean = false;

  const [denominationTokenName, setDenominationTokenName] =
    useState<string>(ssovTokenName);

  const spender = '';

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

  const epochStrikes = [
    BigNumber.from('20000000000000000'),
    BigNumber.from('30000000000000000'),
    BigNumber.from('40000000000000000'),
  ];

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
    if (activeContextSide === 'PUT') return true;
    return (
      purchasePower >=
      (denominationTokenName.toLocaleUpperCase() === ssovTokenName
        ? totalDepositAmount
        : totalDepositAmount * quotePrice)
    );
  }, [
    activeContextSide,
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
            item !== '2CRV' &&
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

  const totalEpochDepositsAmount = getUserReadableAmount(
    1000000030303030300303,
    18
  ).toString();

  const userEpochDepositsAmount = getUserReadableAmount(
    300000030303030300303,
    18
  ).toString();

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
          activeContextSide === 'PUT'
            ? contractAddresses[depositTokenName]
            : token.address,
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
    activeContextSide,
    depositTokenName,
  ]);

  const handlePutDeposit = useCallback(async () => {
    try {
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
    strikeDepositAmounts,
    totalDepositAmount,
    updateAssetBalances,
    chainId,
  ]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedStrikeIndexes,
    ssovTokenName,
    tokenName,
    updateAssetBalances,
    contractReadableStrikeDepositAmounts,
    sendTx,
    accountAddress,
    totalDepositAmount,
    strikeDepositAmounts,
    aggregation1inchRouter,
    denominationTokenName,
    quotePrice,
    erc20SSOV1inchRouter,
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
    handleTokenChange();
  }, [handleTokenChange]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      const finalAmount: BigNumber = getContractReadableAmount(
        totalDepositAmount.toString(),
        getTokenDecimals(ssovTokenName, chainId)
      );
      if (activeContextSide === 'PUT') {
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
    approved,
    totalDepositAmount,
    contractAddresses,
    depositTokenName,
    activeContextSide,
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
      if (activeContextSide === 'PUT') {
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
    activeContextSide,
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
                activeContextSide === 'CALL'
                  ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                  : enabledSides.includes('CALL')
                  ? 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  : 'text-center w-1/2 pt-0.5 pb-1 group rounded hover:opacity-80 cursor-not-allowed'
              }
              onClick={() =>
                enabledSides.includes('CALL')
                  ? setActiveContextSide('CALL')
                  : null
              }
            >
              <Typography variant="h6" className="text-xs font-normal">
                Calls
              </Typography>
            </Box>
            <Box
              className={
                activeContextSide === 'PUT'
                  ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                  : enabledSides.includes('PUT')
                  ? 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  : 'text-center w-1/2 pt-0.5 pb-1 group rounded hover:opacity-80 cursor-not-allowed'
              }
              onClick={() =>
                enabledSides.includes('PUT')
                  ? setActiveContextSide('PUT')
                  : null
              }
            >
              <Typography variant="h6" className="text-xs font-normal">
                Puts
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
          toTokenSymbol={ssovTokenName}
          fromTokenSymbol={tokenName}
          setFromTokenSymbol={setTokenName}
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
                {activeContextSide === 'PUT'
                  ? depositTokenName
                  : denominationTokenName}
              </Typography>
              {isZapActive ? <ZapIcon className={'mt-1 ml-2'} id="4" /> : null}
            </Box>
            <Box className="mt-2 flex">
              <Box
                className={
                  activeContextSide === 'PUT' || isZapActive
                    ? 'w-3/4 mr-3'
                    : 'w-full'
                }
              >
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
                        Select Rates
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
                        ${formatAmount(strike, 4)}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {activeContextSide === 'PUT' ? (
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
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra mt-3.5">
            <Box className="flex">
              <Typography
                variant="h6"
                className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
              >
                Leverage
              </Typography>
              <Typography
                variant="h6"
                className="text-white ml-auto mr-0 text-[0.72rem]"
              >
                {leverage}x
              </Typography>
            </Box>
            <Box className="mt-2 flex">
              <Slider
                min={100}
                max={1000}
                value={leverage}
                onChange={(event, value) => setLeverage(Number(value))}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
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
                  <Tooltip title={'Notional'}>
                    <Typography
                      variant="h6"
                      className="text-stieglitz pb-1 pr-2"
                    >
                      Deposit
                    </Typography>
                  </Tooltip>
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
                    1
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
                    -
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
              fromTokenSymbol={tokenName}
              toTokenSymbol={'2CRV'}
              selectedTokenPrice={selectedTokenPrice}
              isZapInAvailable={
                activeContextSide === 'PUT' ? false : isZapInAvailable
              }
              chainId={chainId}
            />
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <LockerIcon />
              </Box>
              {!isDepositWindowOpen ? (
                <Typography variant="h6" className="text-stieglitz">
                  Deposits for Epoch 2 will open on
                  <br />
                  <span className="text-white">-</span>
                </Typography>
              ) : (
                <Typography variant="h6" className="text-stieglitz">
                  Withdrawals are locked until end of Epoch{' '}
                  <span className="text-white">-</span>
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
                  ? activeContextSide === 'PUT'
                    ? handlePutDeposit
                    : handleDeposit
                  : handleApprove
              }
            >
              {!isDepositWindowOpen && isVaultReady && (
                <Countdown
                  date={new Date()}
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
      )}
    </Box>
  );
};

export default ManageCard;
