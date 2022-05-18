// @ts-nocheck TODO: FIX
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import cx from 'classnames';
import Head from 'next/head';
import {
  Addresses,
  Tzwap1inchRouter__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { LoaderIcon } from 'react-hot-toast';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';

import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import useSendTx from 'hooks/useSendTx';

import Kill from 'components/tzwap/Dialogs/Kill';
import Orders from 'components/tzwap/Orders';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import AppBar from 'components/common/AppBar';
import TokenSelector from 'components/common/TokenSelector';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import get1inchQuote from 'utils/general/get1inchQuote';
import displayAddress from 'utils/general/displayAddress';

import RedTriangleIcon from 'svgs/icons/RedTriangleIcon';

import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import { CURRENCIES_MAP, MAX_VALUE } from 'constants/index';

import { Order } from '../../types/tzwap';

import styles from './styles.module.scss';

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

const Tzwap = () => {
  const sendTx = useSendTx();
  const { chainId, signer, accountAddress, provider, contractAddresses } =
    useContext(WalletContext);
  const { userAssetBalances, tokenPrices, updateAssetBalances } =
    useContext(AssetsContext);
  const [isFetchingOrders, setIsFetchingOrders] = useState<boolean>(false);
  const [openOrder, setOpenOrder] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fromTokenName, setFromTokenName] = useState<string>('USDT');
  const [toTokenName, setToTokenName] = useState<string>('ETH');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [rawIntervalAmount, setRawIntervalAmount] = useState<string>('1');
  const [approved, setApproved] = useState<boolean>(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [isFromTokenSelectorVisible, setIsFromTokenSelectorVisible] =
    useState<boolean>(false);
  const [isToTokenSelectorVisible, setIsToTokenSelectorVisible] =
    useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [selectedTickSize, setSelectedTickSize] = useState<number>(3);
  const [selectedInterval, setSelectedInterval] = useState<string>('Min');
  const [quote, setQuote] = useState<object>({});
  const [orders, setOrders] = useState<Order[]>([]);

  const tzwapRouter = useMemo(
    () =>
      Tzwap1inchRouter__factory.connect(
        chainId === 1
          ? '0x0989fBCfBDFA3C54B2893fE16AD1E7A8D30C4458'
          : '0x7037cFcbc7807A652aEd2f8B5aB30546E7eF350d',
        signer
      ),
    [chainId, signer]
  );

  const ADDRESS_TO_TOKEN = useMemo(() => {
    const map = {};
    Object.keys(contractAddresses).map((tokenName) => {
      if (typeof contractAddresses[tokenName] === 'string') {
        try {
          const decimals = getTokenDecimals(tokenName, chainId);
          map[contractAddresses[tokenName].toLocaleUpperCase()] = {
            name: tokenName.toLowerCase(),
            decimals: decimals,
          };
        } catch (err) {
          //
        }
      }
    });
    return map;
  }, [contractAddresses, chainId]);

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const intervalAmount: number = useMemo(() => {
    return parseFloat(rawIntervalAmount) || 0;
  }, [rawIntervalAmount]);

  const handleSelectTickSize = useCallback((event: any) => {
    setSelectedTickSize(event.target.value as number);
  }, []);

  const handleSelectInterval = useCallback((event: any) => {
    setSelectedInterval(event.target.value as string);
  }, []);

  const updateOrders = useCallback(async () => {
    if (!tzwapRouter || !provider || Object.keys(ADDRESS_TO_TOKEN).length === 0)
      return;

    setIsFetchingOrders(true);
    const ordersCount = (await tzwapRouter.orderCount()).toNumber();
    const ids = Array.from(Array(ordersCount).keys());
    const promises = await Promise.all(ids.map((i) => tzwapRouter.orders(i)));
    const _orders: Order[] = [];
    promises.map(async (promise, i) => {
      const srcTokenName =
        ADDRESS_TO_TOKEN[promise['srcToken'].toLocaleUpperCase()]['name'] ||
        'unknown';
      const dstTokenName =
        ADDRESS_TO_TOKEN[promise['dstToken'].toLocaleUpperCase()]['name'] ||
        'unknown';
      const srcTokenDecimals =
        ADDRESS_TO_TOKEN[promise['srcToken'].toLocaleUpperCase()]['decimals'] ||
        'unknown';
      const dstTokenDecimals =
        ADDRESS_TO_TOKEN[promise['dstToken'].toLocaleUpperCase()]['decimals'] ||
        'unknown';
      if (promise['creator'] === accountAddress) {
        _orders.push({
          id: i,
          minFees: promise['minFees'],
          maxFees: promise['maxFees'],
          killed: promise['killed'],
          creator: promise['creator'],
          created: promise['created'].toNumber(),
          srcToken: promise['srcToken'],
          srcTokenDecimals: srcTokenDecimals,
          srcTokenName: srcTokenName,
          dstToken: promise['dstToken'],
          dstTokenName: dstTokenName,
          dstTokenDecimals: dstTokenDecimals,
          interval: promise['interval'],
          tickSize: promise['tickSize'],
          total: promise['total'],
          srcTokensSwapped: getUserReadableAmount(
            await tzwapRouter.getSrcTokensSwappedForOrder(i),
            srcTokenDecimals
          ),
          dstTokensSwapped: getUserReadableAmount(
            await tzwapRouter.getDstTokensReceivedForOrder(i),
            dstTokenDecimals
          ),
        });
      }
    });
    setOrders(_orders);
    setIsFetchingOrders(false);
  }, [ADDRESS_TO_TOKEN, accountAddress, provider, setOrders, tzwapRouter]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(
          contractAddresses[fromTokenName],
          signer
        ).approve(tzwapRouter.address, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, contractAddresses, fromTokenName, signer, tzwapRouter.address]);

  const handleKill = useCallback(async () => {
    try {
      await sendTx(tzwapRouter.connect(signer).killOrder(openOrder));
      setOpenOrder(null);
      updateOrders();
      updateAssetBalances();
    } catch (err) {
      console.log(err);
    }
  }, [
    signer,
    updateAssetBalances,
    sendTx,
    openOrder,
    updateOrders,
    tzwapRouter,
  ]);

  const fromTokenValueInUsd = useMemo(() => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === fromTokenName) {
        value =
          (record['price'] * parseInt(userAssetBalances[fromTokenName])) /
          10 ** getTokenDecimals(fromTokenName, chainId);
      }
    });
    return value;
  }, [tokenPrices, userAssetBalances, chainId, fromTokenName]);

  const amountInUsd: number = useMemo(() => {
    return (
      (amount * fromTokenValueInUsd) /
      getUserReadableAmount(
        userTokenBalance,
        getTokenDecimals(fromTokenName, chainId)
      )
    );
  }, [amount, fromTokenValueInUsd, userTokenBalance, chainId, fromTokenName]);

  const tickInUsd: number = useMemo(() => {
    return (amountInUsd * selectedTickSize) / 100;
  }, [amountInUsd, selectedTickSize]);

  const minFees: number = useMemo(() => {
    if (tickInUsd === 0) return 0;
    else if (chainId === 42161) return (100 * 9) / tickInUsd;
    else return (100 * 75) / tickInUsd;
  }, [tickInUsd, chainId]);

  const maxFees: number = useMemo(() => {
    return minFees * 5;
  }, [minFees]);

  const minFeesInUsd: number = useMemo(() => {
    return (tickInUsd * minFees) / 100;
  }, [tickInUsd, minFees]);

  const estEndDate: Date = useMemo(() => {
    const now = new Date(
      new Date().getTime() +
        (intervalAmount *
          (selectedInterval === 'Min' ? 60 : 60 * 60) *
          1000 *
          100) /
          selectedTickSize
    );
    return now;
  }, [intervalAmount, selectedInterval, selectedTickSize]);

  const tokensToExclude: string[] = useMemo(() => {
    let _tokens: string[] = [];

    if (chainId === 42161) {
      if (isFromTokenSelectorVisible) _tokens = ['MAGIC', '2CRV'];
      else _tokens = ['ETH', 'MAGIC', '2CRV'];
    } else if (chainId === 1) {
      _tokens = ['RDPX', 'DPX', 'GOHM'];
    }

    return _tokens;
  }, [chainId, isFromTokenSelectorVisible]);

  const handleCreate = useCallback(async () => {
    try {
      const seconds =
        intervalAmount * (selectedInterval === 'Min' ? 60 : 60 * 60);

      let precision = 10 ** 12;
      let tickSize = amount * precision * (selectedTickSize / 100);
      let total = Math.round((amount * precision) / tickSize) * tickSize;

      await sendTx(
        tzwapRouter.connect(signer).newOrder(
          {
            creator: accountAddress,
            srcToken:
              fromTokenName === 'ETH'
                ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                : contractAddresses[fromTokenName],
            dstToken:
              toTokenName === 'ETH'
                ? Addresses[chainId]['WETH']
                : contractAddresses[toTokenName],
            interval: seconds,
            tickSize: getContractReadableAmount(
              Math.round(tickSize) / precision,
              getTokenDecimals(fromTokenName, chainId)
            ),
            total: getContractReadableAmount(
              Math.round(total) / precision,
              getTokenDecimals(fromTokenName, chainId)
            ),
            minFees: Math.round(minFees * 10 ** 3),
            maxFees: Math.round(maxFees * 10 ** 3),
            created: Math.round(new Date().getTime() / 1000),
            killed: false,
          },
          {
            value:
              fromTokenName === 'ETH'
                ? getContractReadableAmount(
                    Math.round(total) / precision,
                    getTokenDecimals(fromTokenName, chainId)
                  )
                : 0,
            gasLimit: chainId === 1 ? 700000 : 1700000,
          }
        )
      );
      updateOrders();
      updateAssetBalances();
    } catch (err) {
      console.log(err);
    }
  }, [
    intervalAmount,
    selectedInterval,
    amount,
    selectedTickSize,
    sendTx,
    tzwapRouter,
    signer,
    accountAddress,
    fromTokenName,
    contractAddresses,
    toTokenName,
    chainId,
    minFees,
    maxFees,
    updateOrders,
    updateAssetBalances,
  ]);

  const submitButtonProps = useMemo(() => {
    const disabled = Boolean(
      fromTokenName === toTokenName ||
        minFees > 200 ||
        !amount ||
        tickInUsd < 50 ||
        amount >=
          getUserReadableAmount(
            userTokenBalance,
            getTokenDecimals(fromTokenName, chainId)
          )
    );

    let onClick = () => {};

    if (!approved && !disabled) onClick = handleApprove;
    else if (approved && !disabled) onClick = handleCreate;

    let children = 'Create order';

    if (
      amount >=
      getUserReadableAmount(
        userTokenBalance,
        getTokenDecimals(fromTokenName, chainId)
      )
    )
      children = 'Insufficient balance';
    else if (tickInUsd < 50) children = 'Batch size is too small (<$50)';
    else if (!approved) children = 'Approve';
    else if (fromTokenName === toTokenName)
      children = 'Tokens must be different';
    else if (amount === 0) children = 'Enter an amount';
    else if (minFees > 200)
      children = 'Your order is too small to sustain fees';
    else if (tickInUsd >= 50000) children = 'Proceed anyway';

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    fromTokenName,
    toTokenName,
    minFees,
    amount,
    tickInUsd,
    userTokenBalance,
    chainId,
    approved,
    handleApprove,
    handleCreate,
  ]);

  useEffect(() => {
    updateOrders();
  }, [updateOrders]);

  useEffect(() => {
    const timer = setInterval(() => {
      updateOrders();
      updateAssetBalances();
    }, 30000);
    return () => clearTimeout(timer);
  }, [updateOrders, updateAssetBalances]);

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      setIsFetchingQuote(true);
      const fromTokenAddress: string = IS_NATIVE(fromTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[fromTokenName];
      const toTokenAddress: string = IS_NATIVE(toTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[toTokenName];

      if (fromTokenAddress === toTokenAddress) return;

      const amount: number = 10 ** getTokenDecimals(fromTokenName, chainId);

      const quote = await get1inchQuote({
        fromTokenAddress,
        toTokenAddress,
        amount,
        chainId,
        accountAddress,
      });

      setQuote(quote);
      setIsFetchingQuote(false);
    }

    updateQuote();
  }, [accountAddress, chainId, contractAddresses, fromTokenName, toTokenName]);

  useEffect(() => {
    (async function () {
      if (!tzwapRouter || !fromTokenName) return;

      const userAmount = IS_NATIVE(fromTokenName)
        ? BigNumber.from(userAssetBalances[CURRENCIES_MAP[chainId.toString()]])
        : await ERC20__factory.connect(
            contractAddresses[fromTokenName],
            signer
          ).balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(fromTokenName)
        ? BigNumber.from(0)
        : await ERC20__factory.connect(
            contractAddresses[fromTokenName],
            signer
          ).allowance(accountAddress, tzwapRouter.address);

      if (!allowance.eq(0)) {
        setApproved(true);
      } else {
        if (IS_NATIVE(fromTokenName)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    fromTokenName,
    userAssetBalances,
    chainId,
    provider,
    tzwapRouter,
    contractAddresses,
    signer,
  ]);

  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Tzwap | Dopex</title>
      </Head>
      <AppBar />
      <Kill
        openOrder={openOrder}
        setOpenOrder={setOpenOrder}
        handleKill={handleKill}
      />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className={'mb-5 mt-32 lg:w-max ml-auto mr-auto'}>
          <Box
            className={
              'bg-cod-gray text-center p-2 pl-4 pr-4 rounded-xl ml-auto mr-auto'
            }
          >
            <Typography
              variant="h6"
              component="div"
              className="text-white font-mono"
            >
              Tzwap is currently in open beta. Exercise caution and review
              contracts before opening tzwap orders.
            </Typography>

            <Box className={'text-center mt-2'}>
              <Typography
                variant="h6"
                component="div"
                className="text-white font-mono mr-auto ml-10"
              >
                <a
                  href={`https://${
                    chainId === 1 ? 'etherscan' : 'arbiscan'
                  }.io/address/${
                    chainId === 1
                      ? '0x0989fBCfBDFA3C54B2893fE16AD1E7A8D30C4458'
                      : '0x7037cFcbc7807A652aEd2f8B5aB30546E7eF350d'
                  }#code`}
                  rel="noreferrer"
                  className={'text-wave-blue'}
                >
                  {displayAddress(
                    chainId === 1
                      ? '0x0989fBCfBDFA3C54B2893fE16AD1E7A8D30C4458'
                      : '0x7037cFcbc7807A652aEd2f8B5aB30546E7eF350d',
                    null
                  )}
                </a>{' '}
              </Typography>
            </Box>
          </Box>
          <Box
            className={
              'bg-cod-gray text-center p-2 pl-4 pr-4 rounded-xl ml-auto mr-auto mt-5'
            }
          >
            <Typography
              variant="h6"
              component="div"
              className="text-white font-mono"
            >
              Do not see your orders? If you were using the previous version of
              Tzwap go on
            </Typography>

            <Box className={'text-center mt-2'}>
              <Typography
                variant="h6"
                component="div"
                className="text-white font-mono mr-auto ml-10"
              >
                <a
                  href={'https://tzwap-v1.dopex.io/tzwap'}
                  rel="noreferrer"
                  className={'text-wave-blue'}
                >
                  tzwap-v1.dopex.io/tzwap
                </a>
                {' or '}
                <a
                  href={'https://tzwap-v2.dopex.io/tzwap'}
                  rel="noreferrer"
                  className={'text-wave-blue'}
                >
                  tzwap-v2.dopex.io/tzwap
                </a>{' '}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="flex mx-auto max-w-xl mb-8 mt-8">
          <Box
            className={cx(
              'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 ml-auto mr-auto',
              styles.cardWidth
            )}
          >
            {!(isFromTokenSelectorVisible || isToTokenSelectorVisible) ? (
              <Box className={''}>
                <Box className={'w-full'}>
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
                        Create new
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
                        Active orders
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <TabPanel value={activeTab} index={0}>
                  <Box className={'flex'}>
                    <Box className={'w-full'}>
                      <Box className="bg-umbra rounded-2xl flex flex-col mb-[3px] p-3 pr-2">
                        <Box className="flex flex-row justify-between">
                          <Box
                            className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                            onClick={() => setIsFromTokenSelectorVisible(true)}
                          >
                            <Box className="flex flex-row h-9 w-9 mr-1.5">
                              {fromTokenName !== '' ? (
                                <img
                                  src={
                                    '/images/tokens/' +
                                    fromTokenName.toLowerCase().split('.e')[0] +
                                    '.svg'
                                  }
                                  alt={fromTokenName}
                                />
                              ) : (
                                <LoaderIcon className="mt-3.5 ml-3.5" />
                              )}
                            </Box>
                            <Typography
                              variant="h5"
                              className="text-white pb-1 pr-1.5"
                            >
                              {fromTokenName}
                            </Typography>
                            <IconButton className="opacity-40 p-0 group-hover:opacity-70">
                              <ArrowDropDownIcon
                                className={'fill-gray-100 mr-2'}
                              />
                            </IconButton>
                          </Box>
                          <Input
                            disableUnderline
                            id="optionsAmount"
                            name="optionsAmount"
                            placeholder="0"
                            type="number"
                            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                            value={rawAmount}
                            onChange={(e) => setRawAmount(e.target.value)}
                            classes={{ input: 'text-right' }}
                          />
                        </Box>
                        <Box className="flex flex-row justify-between">
                          <Box className="flex">
                            <Typography
                              variant="h6"
                              className="text-stieglitz text-sm pl-1 pt-2"
                            >
                              ~ $
                              {amountInUsd > 0
                                ? formatAmount(amountInUsd, 2)
                                : 0}
                            </Typography>
                          </Box>
                          <Box className="ml-auto mr-0">
                            <Typography
                              variant="h6"
                              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
                            >
                              Balance:{' '}
                              <span className={'text-white'}>
                                {formatAmount(
                                  getUserReadableAmount(
                                    userTokenBalance,
                                    getTokenDecimals(fromTokenName, chainId)
                                  ),
                                  7
                                )}
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box className="bg-umbra rounded-2xl flex flex-col mb-3.5 p-3 pr-2 relative">
                        <Box
                          className={
                            'absolute top-[-0.7rem] left-[50%] border border-cod-gray rounded-full p-1 bg-umbra'
                          }
                        >
                          <img
                            src={'/assets/arrowdown.svg'}
                            className={'w-3 h-3'}
                            alt={'Arrow down'}
                          />
                        </Box>
                        <Box className="flex flex-row justify-between">
                          <Box
                            className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group mt-0.5"
                            onClick={() => setIsToTokenSelectorVisible(true)}
                          >
                            <Box className="flex flex-row h-9 w-9 mr-1.5">
                              {toTokenName !== '' ? (
                                <img
                                  src={
                                    '/images/tokens/' +
                                    toTokenName.toLowerCase().split('.e')[0] +
                                    '.svg'
                                  }
                                  alt={toTokenName}
                                />
                              ) : (
                                <LoaderIcon className="mt-3.5 ml-3.5" />
                              )}
                            </Box>
                            <Typography
                              variant="h5"
                              className="text-white pb-1 pr-1.5"
                            >
                              {toTokenName}
                            </Typography>
                            <IconButton className="opacity-40 p-0 group-hover:opacity-70">
                              <ArrowDropDownIcon
                                className={'fill-gray-100 mr-2'}
                              />
                            </IconButton>
                          </Box>
                          <Typography
                            className={
                              'text-2xl text-white ml-2 mr-3 font-mono mt-1'
                            }
                            variant={'h6'}
                          >
                            -
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="rounded-lg p-3 pb-0 border border-neutral-800 mb-3.5 w-full bg-umbra">
                        <Box className="flex pb-3">
                          <Box className={'w-1/2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
                            >
                              Batch Size
                            </Typography>
                            <Select
                              className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 mt-1 text-white"
                              fullWidth
                              displayEmpty
                              disableUnderline
                              value={selectedTickSize}
                              onChange={handleSelectTickSize}
                              input={<Input />}
                              variant="outlined"
                              renderValue={() => {
                                return (
                                  <Typography
                                    variant="h6"
                                    className="text-white text-center w-full relative"
                                  >
                                    {selectedTickSize}%
                                  </Typography>
                                );
                              }}
                              MenuProps={SelectMenuProps}
                              classes={{
                                icon: 'absolute right-12 text-white',
                                select: 'overflow-hidden',
                              }}
                              label="strikes"
                            >
                              {[
                                0.1, 0.2, 0.3, 0.4, 0.5, 1, 1.5, 2, 3, 4, 5, 6,
                                7, 8, 9, 10, 25,
                              ].map((tickSize, index) => (
                                <MenuItem
                                  key={index}
                                  value={tickSize}
                                  className="pb-2 pt-2"
                                >
                                  <Checkbox
                                    className={
                                      selectedTickSize === tickSize
                                        ? 'p-0 text-white'
                                        : 'p-0 text-white border'
                                    }
                                    checked={selectedTickSize === tickSize}
                                  />
                                  <Typography
                                    variant="h5"
                                    className="text-white text-left w-full relative ml-3"
                                  >
                                    {tickSize}%
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                          <Box className={'w-1/4 ml-2 mr-1'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
                            >
                              Interval
                            </Typography>
                            <Select
                              className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 mt-1 text-white"
                              fullWidth
                              displayEmpty
                              disableUnderline
                              value={selectedInterval}
                              onChange={handleSelectInterval}
                              input={<Input />}
                              variant="outlined"
                              renderValue={() => {
                                return (
                                  <Typography
                                    variant="h6"
                                    className="text-white text-center w-full relative"
                                  >
                                    {selectedInterval}
                                  </Typography>
                                );
                              }}
                              MenuProps={SelectMenuProps}
                              classes={{
                                icon: 'absolute right-1 text-white',
                                select: 'overflow-hidden',
                              }}
                              label="strikes"
                            >
                              {['Min', 'Hrs'].map((interval, index) => (
                                <MenuItem
                                  key={index}
                                  value={interval}
                                  className="pb-2 pt-2"
                                >
                                  <Checkbox
                                    className={
                                      selectedInterval === interval
                                        ? 'p-0 text-white'
                                        : 'p-0 text-white border'
                                    }
                                    checked={selectedInterval === interval}
                                  />
                                  <Typography
                                    variant="h5"
                                    className="text-white text-left w-full relative ml-3"
                                  >
                                    {interval}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                          <Box className={'w-1/4 ml-1'}>
                            <Input
                              disableUnderline={true}
                              name="intervalAmount"
                              className="w-full mt-6 border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] pt-0.5 pb-0.5 rounded-md pl-2 pr-2"
                              classes={{
                                input: 'text-white text-xs text-right',
                              }}
                              value={intervalAmount}
                              placeholder="-"
                              onChange={(e) =>
                                setRawIntervalAmount(e.target.value)
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
                        <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              <Tooltip
                                title={
                                  'Batch Size is the amount you would like to purchase per interval. If your total amount is 2 ETH and your batch size is 10% you will buy 0.2 ETH each time.'
                                }
                              >
                                <span>Batch size</span>
                              </Tooltip>
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                ~{' '}
                                {amountInUsd > 0
                                  ? '$' + formatAmount(tickInUsd, 2)
                                  : null}{' '}
                                <span className="text-stieglitz">
                                  ({selectedTickSize}%)
                                </span>
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Interval
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {intervalAmount} {selectedInterval}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              {' '}
                              Fees{' '}
                            </Typography>

                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                ~{' '}
                                {minFeesInUsd > 0
                                  ? '$' + formatAmount(minFeesInUsd, 2)
                                  : null}{' '}
                                <span className="text-stieglitz">
                                  ({minFees > 0 ? formatAmount(minFees, 2) : 0}
                                  %)
                                </span>
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Est Completion
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                <Countdown
                                  date={estEndDate}
                                  renderer={({ days, hours, minutes }) => {
                                    return (
                                      <Box className="flex items-center w-full cursor-default">
                                        <Typography
                                          className="text-sm font-mono text-wave-blue"
                                          variant="h6"
                                          component="div"
                                        >
                                          {days > 0 ? days + ' days' : null}{' '}
                                          {hours}h {minutes}m
                                        </Typography>
                                      </Box>
                                    );
                                  }}
                                />
                              </Typography>
                            </Box>
                          </Box>
                          {provider ? (
                            <EstimatedGasCostButton
                              gas={700000}
                              chainId={chainId}
                            />
                          ) : null}
                        </Box>
                        <Box className="rounded-md mb-4 p-2 pl-3 pr-3 border border-neutral-800 w-full bg-neutral-800">
                          {isFetchingQuote ? (
                            <Box className="flex">
                              <CircularProgress
                                className="text-stieglitz mt-0.5 mr-2"
                                size={15}
                              />
                              <Typography
                                variant="h6"
                                className="text-white ml-2"
                              >
                                Fetching price...
                              </Typography>
                            </Box>
                          ) : (
                            <Box className="flex">
                              <img
                                src={'/images/exchanges/1inch.svg'}
                                className={'w-5 h-5'}
                                alt={'1inch'}
                              />
                              <Typography
                                variant="h6"
                                className="text-white ml-2"
                              >
                                {quote['fromToken']
                                  ? `1 ${
                                      quote['fromToken']['symbol']
                                    } = ${formatAmount(
                                      getUserReadableAmount(
                                        quote['toTokenAmount'],
                                        quote['toToken']['decimals']
                                      ),
                                      2
                                    )} 
                              ${quote['toToken']['symbol']}`
                                  : 'Router via 1inch'}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {tickInUsd >= 50000 && chainId === 1 ? (
                          <Box className="flex">
                            <Box className="flex text-center p-2 mr-2 mt-1">
                              <RedTriangleIcon className={''} />
                            </Box>
                            <Typography variant="h6" className="text-red-500">
                              If your tick size is too high in proportion to the
                              liquidity of the pools you could be victim of a{' '}
                              <a
                                href={
                                  'https://trustwallet.com/blog/how-to-protect-yourself-from-sandwich-attacks'
                                }
                                rel="noopener noreferrer"
                              >
                                sandwich attack
                              </a>
                              . We suggest to reduce it.
                            </Typography>
                          </Box>
                        ) : (
                          <Box className="flex">
                            <Box className="flex text-center p-2 mr-2 mt-1">
                              <img
                                src={'/assets/timer.svg'}
                                className={'w-6 h-4'}
                                alt={'Timer'}
                              />
                            </Box>
                            <Typography variant="h6" className="text-stieglitz">
                              Tokens will periodically appear in your wallet.
                              You can kill the order anytime.
                            </Typography>
                          </Box>
                        )}
                        <CustomButton
                          size="medium"
                          className="w-full mt-4 !rounded-md"
                          color={submitButtonProps.color}
                          disabled={submitButtonProps.disabled}
                          onClick={submitButtonProps.onClick}
                        >
                          {submitButtonProps.children}
                        </CustomButton>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                  <Orders
                    orders={orders}
                    setOpenOrder={setOpenOrder}
                    isFetchingOrders={isFetchingOrders}
                  />
                </TabPanel>
              </Box>
            ) : (
              <Box className={'h-[38.8rem]'}>
                <TokenSelector
                  open={isFromTokenSelectorVisible || isToTokenSelectorVisible}
                  setOpen={
                    isFromTokenSelectorVisible
                      ? setIsFromTokenSelectorVisible
                      : setIsToTokenSelectorVisible
                  }
                  setFromTokenSymbol={
                    isFromTokenSelectorVisible
                      ? setFromTokenName
                      : setToTokenName
                  }
                  isInDialog={false}
                  tokensToExclude={tokensToExclude}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          className={cx(
            'flex mx-auto max-w-xl mb-8 mt-32 text-center',
            styles.cardWidth
          )}
        >
          <Typography variant="h5" className="z-1 text-stieglitz">
            <span className={'text-white'}>TZWAP</span> allows anyone to create
            an on-chain TWAP order split by intervals and ticksizes that can be
            filled by bots for a fee.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Tzwap;
