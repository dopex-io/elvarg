import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import cx from 'classnames';
import Head from 'next/head';
import {
  ERC20,
  Addresses,
  Tzwap1inchRouter__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { LoaderIcon } from 'react-hot-toast';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';

import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import useSendTx from 'hooks/useSendTx';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import AppBar from 'components/AppBar';
import TokenSelector from 'components/TokenSelector';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';

import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import get1inchQuote from 'utils/general/get1inchQuote';

import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import { CURRENCIES_MAP, MAX_VALUE } from 'constants/index';

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

interface Order {
  id: number;
  minFees: BigNumber;
  maxFees: BigNumber;
  killed: boolean;
  creator: string;
  srcToken: string;
  srcTokenName: string;
  srcTokenDecimals: number;
  dstToken: string;
  dstTokenName: string;
  dstTokenDecimals: number;
  interval: BigNumber;
  tickSize: BigNumber;
  total: BigNumber;
  created: number;
  srcTokensSwapped: BigNumber;
  dstTokensSwapped: BigNumber;
}

const MIN_FEE_PERCENTAGE = 15; // 0.15%
const MAX_FEE_PERCENTAGE = 200; // 2%

const Tzwap = () => {
  const sendTx = useSendTx();
  const { chainId, signer, accountAddress, provider, contractAddresses } =
    useContext(WalletContext);
  const { userAssetBalances, tokenPrices } = useContext(AssetsContext);
  const tzwapRouter = Tzwap1inchRouter__factory.connect(
    Addresses[chainId]['Tzwap1inchRouter'],
    signer
  );

  const [openOrder, setOpenOrder] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fromToken, setFromToken] = useState<ERC20 | any>('ETH');
  const [fromTokenName, setFromTokenName] = useState<string>('ETH');
  const [toToken, setToToken] = useState<ERC20 | any>(
    ERC20__factory.connect(Addresses[chainId]['DPX'], provider)
  );
  const [toTokenName, setToTokenName] = useState<string>('DPX');
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
  const [selectedTickSize, setSelectedTickSize] = useState<number>(0.1);
  const [selectedInterval, setSelectedInterval] = useState<string>('Min');
  const [quote, setQuote] = useState<object>({});
  const [orders, setOrders] = useState<Order[]>([]);

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

  const handleFromTokenChange = useCallback(async () => {
    if (!fromToken || !provider) return;
    const symbol = IS_NATIVE(fromToken)
      ? fromToken
      : await fromToken.connect(provider).symbol();
    setFromTokenName(symbol);
  }, [fromToken, provider]);

  const handleToTokenChange = useCallback(async () => {
    if (!toToken || !provider) return;
    const symbol = IS_NATIVE(toToken)
      ? toToken
      : await toToken.connect(provider).symbol();
    setToTokenName(symbol);
  }, [toToken, provider]);

  const handleSelectTickSize = useCallback((event: any) => {
    setSelectedTickSize(event.target.value as number);
  }, []);

  const handleSelectInterval = useCallback((event: any) => {
    setSelectedInterval(event.target.value as string);
  }, []);

  const updateOrders = useCallback(async () => {
    if (!tzwapRouter || !provider || Object.keys(ADDRESS_TO_TOKEN).length === 0)
      return;

    const ordersCount = await tzwapRouter.orderCount();
    const ids = Array.from(Array(ordersCount).keys());
    const promises = await Promise.all(ids.map((i) => tzwapRouter.orders(i)));
    const _orders: Order[] = [];
    promises.map((promise, i) => {
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
      if (promise['creator'] == accountAddress) {
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
          srcTokensSwapped: BigNumber.from('0'),
          dstTokensSwapped: BigNumber.from('0'),
        });
      }
    });
    _orders.map(async (order) => {
      order.srcTokensSwapped = await tzwapRouter.getSrcTokensSwappedForOrder(
        order['id']
      );
      order.dstTokensSwapped = await tzwapRouter.getDstTokensReceivedForOrder(
        order['id']
      );
    });
    setOrders(_orders);
  }, [tzwapRouter, provider, accountAddress, ADDRESS_TO_TOKEN]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(fromToken.address, signer).approve(
          tzwapRouter.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, fromToken, signer, tzwapRouter]);

  const handleCreate = useCallback(async () => {
    try {
      const seconds =
        intervalAmount * (selectedInterval === 'Min' ? 60 : 60 * 60);

      await sendTx(
        tzwapRouter.connect(signer).newOrder(
          {
            creator: accountAddress,
            srcToken:
              fromTokenName === 'ETH'
                ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                : fromToken.address,
            dstToken:
              toTokenName === 'ETH'
                ? Addresses[chainId]['WETH']
                : toToken.address,
            interval: seconds,
            tickSize: getContractReadableAmount(
              ((amount * selectedTickSize) / 100).toFixed(18),
              getTokenDecimals(fromToken, chainId)
            ),
            total: getContractReadableAmount(
              amount,
              getTokenDecimals(fromToken, chainId)
            ),
            minFees: MIN_FEE_PERCENTAGE,
            maxFees: MAX_FEE_PERCENTAGE,
            created: Math.round(new Date().getTime() / 1000),
            killed: false,
          },
          {
            value:
              fromTokenName === 'ETH'
                ? getContractReadableAmount(
                    amount,
                    getTokenDecimals(fromToken, chainId)
                  )
                : 0,
          }
        )
      );
      updateOrders();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    signer,
    tzwapRouter,
    chainId,
    sendTx,
    selectedInterval,
    intervalAmount,
    updateOrders,
  ]);

  const handleKill = useCallback(async () => {
    try {
      await sendTx(tzwapRouter.connect(signer).killOrder(openOrder));
      updateOrders();
    } catch (err) {
      console.log(err);
    }
  }, [signer, tzwapRouter, sendTx, openOrder, updateOrders]);

  const submitButtonProps = useMemo(() => {
    const disabled = Boolean(
      fromTokenName === toTokenName ||
        !amount ||
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
    else if (!approved) children = 'Approve';
    else if (fromTokenName === toTokenName)
      children = 'Tokens must be different';
    else if (amount === 0) children = 'Enter an amount';

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [approved, handleApprove, handleCreate]);

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
  }, [tokenPrices, userAssetBalances, fromTokenName]);

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
  }, [fromTokenValueInUsd, intervalAmount, selectedInterval, selectedTickSize]);

  useEffect(() => {
    updateOrders();
  }, [updateOrders]);

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      setIsFetchingQuote(true);
      const fromTokenAddress: string = IS_NATIVE(fromToken)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : fromToken?.address;
      const toTokenAddress: string = IS_NATIVE(toToken)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : toToken?.address;

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
  }, [accountAddress, chainId, fromTokenName, fromToken, toTokenName, toToken]);

  useEffect(() => {
    handleFromTokenChange();
  }, [handleFromTokenChange]);

  useEffect(() => {
    handleToTokenChange();
  }, [handleToTokenChange]);

  useEffect(() => {
    (async function () {
      if (!tzwapRouter || !fromToken) return;

      const userAmount = IS_NATIVE(fromToken)
        ? BigNumber.from(userAssetBalances[CURRENCIES_MAP[chainId.toString()]])
        : await fromToken.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(fromToken)
        ? BigNumber.from(0)
        : await fromToken.allowance(accountAddress, tzwapRouter.address);

      if (!allowance.eq(0)) {
        setApproved(true);
      } else {
        if (IS_NATIVE(fromToken)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [accountAddress, fromToken, userAssetBalances, chainId, provider]);

  return (
    <Box className="bg-[url('/assets/vaultsbg.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Tzwap | Dopex</title>
      </Head>
      <AppBar />
      <Dialog
        open={openOrder !== null}
        classes={{
          paper: 'bg-cod-gray p-2 rounded-xl w-[25rem]',
        }}
      >
        <Box>
          <Box className={'flex p-3'}>
            <Typography variant="h4" className="mb-4 ml-2">
              Kill Tzwap
            </Typography>

            <img
              src={'/assets/dark-cross.svg'}
              className={
                'ml-auto w-4 h-4 mt-2 mr-2 hover:opacity-90 cursor-pointer'
              }
              onClick={() => setOpenOrder(null)}
            />
          </Box>
          <Box className="text-justify pl-5 pr-5">
            <Typography variant="h5" component="p" className={'text-stieglitz'}>
              Killing a Tzwap means that your order will stop being filled by
              bots and that you’ll get your initial collateral back minus what
              has already been filled by bots.
            </Typography>
          </Box>

          <Box className={'pl-6 pr-6 mb-4 mt-3'}>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-md"
              color={'primary'}
              onClick={() => handleKill()}
            >
              <img src={'/assets/killpepe.svg'} className={'w-3 h-3 mr-2'} />
              Kill Tzwap
            </CustomButton>
          </Box>
        </Box>
      </Dialog>
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="flex mx-auto max-w-xl mb-8 mt-32">
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
                                    '/assets/' +
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
                              ~ ${formatAmount(fromTokenValueInUsd, 2)}
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
                                  4
                                )}
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box className="bg-umbra rounded-2xl flex flex-col mb-3.5 p-3 pr-2 relative">
                        <Box
                          className={
                            'absolute top-[-0.7rem] left-[50%] border border-cod-gray rounded-full p-1 bg-umbra cursor-pointer opacity-70'
                          }
                          onClick={() => {
                            const _fromToken = fromToken;
                            setFromToken(toToken);
                            setToToken(_fromToken);
                          }}
                        >
                          <img
                            src={'/assets/arrowdown.svg'}
                            className={'w-3 h-3'}
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
                                    '/assets/' +
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
                              'text-2xl text-white mt-2.5 ml-2 mr-3 font-mono mt-1'
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
                              Tick size
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
                                7, 8, 9, 10,
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
                              Tick Size
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {selectedTickSize}%
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
                                {' '}
                                {MIN_FEE_PERCENTAGE / 100}%
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
                                  renderer={({
                                    days,
                                    hours,
                                    minutes,
                                    seconds,
                                  }) => {
                                    return (
                                      <Box className="flex items-center w-full cursor-default">
                                        <Typography
                                          className="text-sm font-mono text-wave-blue"
                                          variant="h6"
                                          component="div"
                                        >
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
                                src={'/assets/1inch.svg'}
                                className={'w-5 h-5'}
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

                        <Box className="flex">
                          <Box className="flex text-center p-2 mr-2 mt-1">
                            <img
                              src={'/assets/timer.svg'}
                              className={'w-6 h-4'}
                            />
                          </Box>
                          <Typography variant="h6" className="text-stieglitz">
                            Tokens will periodically appear in your wallet. You
                            can kill the order anytime.
                          </Typography>
                        </Box>
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
                  <Box className="h-[40.5rem] overflow-y-auto overflow-x-hidden">
                    {orders.map((order) => (
                      <Box
                        key={order.id}
                        className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra"
                      >
                        <Box className={'flex h-[2.75rem]'}>
                          <Box className={'relative'}>
                            <img
                              src={'/assets/' + order.srcTokenName + '.svg'}
                              className={
                                'inherit w-6 h-6 z-15 border-[0.2px] border-gray-800 rounded-full'
                              }
                            />
                            <img
                              src={'/assets/' + order.dstTokenName + '.svg'}
                              className={
                                'inherit w-6 h-6 border-[0.2px] border-gray-800 rounded-full ml-[1rem] mt-[-1rem] z-1'
                              }
                            />
                          </Box>
                          <Box className="mt-1 ml-4 flex w-full">
                            <Typography
                              variant="h6"
                              className="text-xs font-normal mr-3"
                            >
                              {order.srcTokenName.toLocaleUpperCase()}
                            </Typography>
                            <img
                              src={'/assets/longarrowright.svg'}
                              alt="Arrow right"
                              className={'mr-1 w-4 h-2.5 mt-1.5'}
                            />
                            <Typography
                              variant="h6"
                              className="text-xs font-normal ml-2 mr-2"
                            >
                              {order.dstTokenName.toLocaleUpperCase()}
                            </Typography>
                            {order.killed ? (
                              <CustomButton
                                size="small"
                                className="ml-auto !rounded-md bg-[#2D2D2D] mt-[-0.3rem]"
                                color="mineshaft"
                                disabled
                              >
                                Killed
                                <img
                                  src="/assets/killpepe.svg"
                                  className="ml-2 mr-1.5"
                                  alt={'Pepe Kill'}
                                />
                              </CustomButton>
                            ) : (
                              <CustomButton
                                size="small"
                                className="ml-auto !rounded-md bg-[#2D2D2D] mt-[-0.3rem]"
                                color="mineshaft"
                                onClick={() => setOpenOrder(order.id)}
                              >
                                <CircularProgress
                                  className="text-stieglitz mt-0.5 mr-2"
                                  size={10}
                                />
                                Open
                                <img
                                  src="/assets/cross.svg"
                                  className="ml-2 mr-1.5"
                                  alt={'Cancel'}
                                />
                              </CustomButton>
                            )}
                          </Box>
                        </Box>
                        <Box className="rounded-md flex flex-col p-4 border border-neutral-800 w-full bg-neutral-800">
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
                              Total
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {getUserReadableAmount(
                                  order.total,
                                  order.srcTokenDecimals
                                )}{' '}
                                {order.srcTokenName.toLocaleUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Tick Size
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {getUserReadableAmount(
                                  order.tickSize,
                                  order.srcTokenDecimals
                                )}{' '}
                                {order.srcTokenName.toLocaleUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Start
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {
                                  new Date(order.created * 1000)
                                    .toLocaleString()
                                    .split(',')[0]
                                }
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Fees
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {getUserReadableAmount(order.minFees, 2)}%
                              </Typography>
                            </Box>
                          </Box>
                          <Box className={'flex mb-2'}>
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Swapped
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {getUserReadableAmount(
                                  order.srcTokensSwapped,
                                  order.srcTokenDecimals
                                )}{' '}
                                {order.srcTokenName.toLocaleUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            className={
                              order.srcTokensSwapped.gt(0)
                                ? 'flex mb-2'
                                : 'flex mb-0'
                            }
                          >
                            <Typography
                              variant="h6"
                              className="text-stieglitz ml-0 mr-auto"
                            >
                              Obtained
                            </Typography>
                            <Box className={'text-right'}>
                              <Typography
                                variant="h6"
                                className="text-white mr-auto ml-0"
                              >
                                {getUserReadableAmount(
                                  order.dstTokensSwapped,
                                  order.dstTokenDecimals
                                )}{' '}
                                {order.dstTokenName.toLocaleUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                          {order.srcTokensSwapped.gt(0) ? (
                            <LinearProgress
                              variant="determinate"
                              className={'mt-3 rounded-sm mb-4'}
                              value={
                                (100 *
                                  getUserReadableAmount(
                                    order.srcTokensSwapped,
                                    order.srcTokenDecimals
                                  )) /
                                getUserReadableAmount(
                                  order.total,
                                  order.dstTokenDecimals
                                )
                              }
                            />
                          ) : null}
                          {order.srcTokensSwapped.gt(0) ? (
                            <Box className={'flex'}>
                              <Typography
                                variant="h6"
                                className="text-stieglitz ml-0 mr-auto"
                              >
                                Current price
                              </Typography>
                              <Box className={'text-right'}>
                                <Typography
                                  variant="h6"
                                  className="text-white mr-auto ml-0"
                                >
                                  1 {order.srcTokenName.toLocaleUpperCase()} ={' '}
                                  {getUserReadableAmount(
                                    order.dstTokensSwapped,
                                    order.dstTokenDecimals
                                  ) /
                                    getUserReadableAmount(
                                      order.srcTokensSwapped,
                                      order.srcTokenDecimals
                                    )}{' '}
                                  {order.dstTokenName.toLocaleUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    ))}
                    {orders.length === 0 ? (
                      <Box className={'text-center mt-3'}>
                        <Typography
                          variant="h6"
                          className="mb-3 text-stieglitz"
                        >
                          No orders have been created yet
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
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
                  setToken={
                    isFromTokenSelectorVisible ? setFromToken : setToToken
                  }
                  isInDialog={false}
                  tokensToExclude={[]}
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
