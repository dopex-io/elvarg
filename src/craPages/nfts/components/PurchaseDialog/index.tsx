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
  DiamondPepeNFTs1inchRouter__factory,
  UniswapPair__factory,
  YieldMint,
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
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import Slide from '@material-ui/core/Slide';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';
import ZapIn from '../ZapIn';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
import ArrowRightIcon from '../../../../components/Icons/ArrowRightIcon';
import ZapInButton from '../../../../components/ZapInButton';
import ZapOutButton from '../../../../components/ZapOutButton';
import getContractReadableAmount from '../../../../utils/contracts/getContractReadableAmount';
import getDecimalsFromSymbol from '../../../../utils/general/getDecimalsFromSymbol';
import useBnbSsovConversion from '../../../../hooks/useBnbSsovConversion';
import { getValueInUsdFromSymbol } from 'utils/general/getValueInUsdFromSymbol';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { Data, UserData } from '../../diamondpepes/interfaces';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';

import useSendTx from 'hooks/useSendTx';
import { MAX_VALUE, SSOV_MAP } from 'constants/index';
import BigCrossIcon from '../../../../components/Icons/BigCrossIcon';
import CircleIcon from '../../../../components/Icons/CircleIcon';
import AlarmIcon from '../../../../components/Icons/AlarmIcon';
import { LoaderIcon } from 'react-hot-toast';
import ZapIcon from '../../../../components/Icons/ZapIcon';

export interface Props {
  open: boolean;
  handleClose: () => {};
  tab: string;
  data: Data;
  userData: UserData;
  timeRemaining: JSX.Element;
  yieldMint: YieldMint;
  updateData: () => {};
  updateUserData: () => {};
  provider: ethers.providers.Provider;
}

const PurchaseDialog = ({
  open,
  handleClose,
  data,
  tab,
  userData,
  timeRemaining,
  yieldMint,
  updateData,
  updateUserData,
  provider, // required to initialize token
}: Props) => {
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, chainId, signer } = useContext(WalletContext);
  const aggregation1inchRouter = Addresses[chainId]['1inchRouter']
    ? Aggregation1inchRouterV4__factory.connect(
        Addresses[chainId]['1inchRouter'],
        signer
      )
    : null;
  const diamondPepeNfts1inchRouter =
    DiamondPepeNFTs1inchRouter__factory.connect(
      Addresses[chainId]['DiamondPepesNFT1inchRouter'],
      signer
    );
  const baseTokenName: string = 'SLP';
  const baseToken: ERC20 = ERC20__factory.connect(
    Addresses[chainId]['RDPX-WETH'],
    provider
  );
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(baseToken);
  const [tokenName, setTokenName] = useState<string>(baseTokenName);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [rawAmount, setRawAmount] = useState<string>('');
  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const isZapActive: boolean = useMemo(() => {
    return (
      tokenName !== 'RDPX-WETH' &&
      tokenName != 'SLP' &&
      tokenName.toUpperCase() !== baseTokenName.toUpperCase()
    );
  }, [tokenName, baseTokenName, path]);

  const pepeReserved: number = useMemo(() => {
    return data.mintPrice.gt(0)
      ? Math.floor(Number(userData.deposits.div(data.mintPrice).toString()))
      : 0;
  }, [data, userData]);

  const spender: string = useMemo(
    () =>
      isZapActive && tokenName !== 'ETH'
        ? diamondPepeNfts1inchRouter.address
        : yieldMint.address,
    [isZapActive]
  );

  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);

  const obtainableLP: number = useMemo(() => {
    if (amount <= 0 || isNaN(amount)) return 0;
    else if (tokenName === baseTokenName) {
      return amount;
    } else if (!path['toTokenAmount'] && tokenName !== 'ETH') return 0;
    else {
      const wethAmount =
        tokenName === 'ETH'
          ? userTokenBalance.toString()
          : path['toTokenAmount'];
      const wethForLPToken =
        parseInt(data.lpSupply.toString()) /
        10 ** 18 /
        (parseInt(data.lpReserves[1].mul(BigNumber.from(2)).toString()) /
          10 ** 18);
      const LPTokenForWeth = 1 / wethForLPToken;
      return getUserReadableAmount(wethAmount / LPTokenForWeth, 18);
    }
  }, [amount, path, userTokenBalance]);

  const purchasePower: number = useMemo(() => {
    if (tokenName === 'ETH')
      return getUserReadableAmount(userAssetBalances.ETH, 18);
    if (isZapActive) {
      let price: number;
      if (path['toToken'] && quote['toToken'])
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
  }, [
    isZapActive,
    quote,
    path,
    slippageTolerance,
    userTokenBalance,
    tokenName,
  ]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token)
      ? token
      : await token.connect(signer).symbol();
    setTokenName(symbol);
  };

  const zapInTotalCost: number = useMemo(() => {
    if (!path['toTokenAmount'] || !quote['toTokenAmount']) return 0;
    const price =
      getUserReadableAmount(
        path['toTokenAmount'],
        quote['toToken']['decimals']
      ) /
      getUserReadableAmount(
        path['fromTokenAmount'],
        path['fromToken']['decimals']
      );
    return 0;
  }, [path]);

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'] === tokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, tokenName]);

  const getQuote = async () => {
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

    if (fromTokenAddress === baseToken.address) return;
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
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

    if (fromTokenAddress === baseToken.address) return;
    if (fromTokenAddress === toTokenAddress) return;

    setIsFetchingPath(true);

    try {
      const { data } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${getContractReadableAmount(
          amount,
          getDecimalsFromSymbol(tokenName, chainId)
        )}&fromAddress=${spender}&slippage=0.1&disableEstimate=true`
      );

      setPath(data);
    } catch (err) {
      console.log(err);
    }

    setIsFetchingPath(false);
  };

  const openZapIn = () => {
    if (isZapActive) {
      setIsZapInVisible(true);
    } else {
      const filteredTokens = ['ETH']
        .concat(tokens)
        .filter(function (item) {
          return (
            item !== baseTokenName &&
            !['RDPX', 'DPX', '2CRV'].includes(item.toUpperCase()) &&
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

  const [activeTab, setActiveTab] = useState<string>('deposit');

  useEffect(() => {
    if (['mint', 'withdraw'].includes(tab)) setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    getQuote();
  }, [tokenName]);

  const activeIndex: number = useMemo(() => {
    if (isZapInVisible) return 2;
    else {
      if (activeTab === 'deposit') return 0;
      else return 1;
    }
  }, [activeTab, isZapInVisible]);

  const extraHeight: number = useMemo(() => {
    if (isZapInVisible) return 10;
    else return 0;
  }, [activeTab, isZapInVisible]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(token.connect(signer).approve(spender, MAX_VALUE));
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [token, signer, sendTx, spender]);

  const handleMint = useCallback(async () => {
    try {
      await sendTx(yieldMint.connect(signer).claimMint());
      await updateData();
      await updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [accountAddress]);

  const handlePurchase = useCallback(async () => {
    try {
      if (baseTokenName === tokenName) {
        await sendTx(
          yieldMint
            .connect(signer)
            .depositLP(getContractReadableAmount(amount, 18), accountAddress)
        );
      } else if (IS_NATIVE(token)) {
        await sendTx(
          yieldMint.connect(signer).depositWeth(accountAddress, {
            value: getContractReadableAmount(amount, 18),
          })
        );
      } else {
        const decoded = aggregation1inchRouter.interface.decodeFunctionData(
          'swap',
          path['tx']['data']
        );
        console.log(decoded);
        await sendTx(
          diamondPepeNfts1inchRouter
            .connect(signer)
            .swapAndDeposit(decoded[0], decoded[1], decoded[2])
        );
      }

      setRawAmount('0');
      updateAssetBalances();
      await updateData();
      await updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [updateAssetBalances, accountAddress, tokenName, isZapActive, path]);

  const checkDEXAggregatorStatus = async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(!!(status === 200 && diamondPepeNfts1inchRouter));
    } catch (err) {
      setIsZapInAvailable(false);
    }
  };

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, []);

  useEffect(() => {
    getPath();
  }, [isZapInVisible, token, isZapActive, amount, spender]);

  const setMaxAmount = async () => {
    const amount = getUserReadableAmount(
      userTokenBalance,
      getDecimalsFromSymbol(tokenName, chainId)
    );
    setRawAmount((IS_NATIVE(token) ? amount * 0.99 : amount).toFixed(3));
  };

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  // Handles isApproved
  useEffect(() => {
    if (!token?.provider) return;
    (async function () {
      const userAmount = IS_NATIVE(token)
        ? BigNumber.from(userAssetBalances.ETH)
        : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(token)
        ? BigNumber.from(0)
        : await token.allowance(accountAddress, spender);

      if (IS_NATIVE(token)) {
        setApproved(true);
      } else {
        if (allowance.gt(0)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    token,
    userAssetBalances,
    provider,
    isZapActive,
    spender,
  ]);

  useEffect(() => {
    if (
      !isZapInVisible &&
      amount >
        getUserReadableAmount(
          userTokenBalance,
          getDecimalsFromSymbol(tokenName, chainId)
        )
    ) {
      setTokenName(baseTokenName);
    }
  }, [isZapInVisible]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      background={'bg-[#181C24]'}
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Diamond Pepes</Typography>

        <ZapOutButton
          isZapActive={isZapActive}
          handleClick={() => {
            setToken(baseToken);
          }}
          background={'bg-[#343C4D]'}
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

      {['deposit', 'mint'].includes(activeTab) && (
        <Box className={isZapInVisible ? 'hidden' : 'flex'}>
          <Box className={'w-full'}>
            <Box className="flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md">
              <Box
                className={
                  activeTab === 'deposit'
                    ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80 hover:opacity-80'
                    : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                }
                onClick={() => setActiveTab('deposit')}
              >
                <Typography
                  variant="h6"
                  className={
                    activeTab === 'deposit'
                      ? 'text-xs font-normal'
                      : 'text-[#78859E] text-xs font-normal'
                  }
                >
                  Deposit
                </Typography>
              </Box>

              <Box
                className={
                  activeTab === 'mint'
                    ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80 hover:opacity-80'
                    : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                }
                onClick={() => setActiveTab('mint')}
              >
                <Typography
                  variant="h6"
                  className={
                    activeTab === 'mint'
                      ? 'text-xs font-normal'
                      : 'text-[#78859E] text-xs font-normal'
                  }
                >
                  Mint
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box style={{ height: 39 + extraHeight + 'rem' }}>
        {activeTab === 'deposit' ? (
          <Box>
            <Box className="bg-[#232935] rounded-2xl flex flex-col mb-4 p-3 pr-2">
              <Box className="flex flex-row justify-between">
                <Box
                  className={`h-11 ${
                    isZapActive ? 'w-[15rem]' : 'w-[25rem]'
                  } bg-[#181C24] rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group`}
                  onClick={() => setIsTokenSelectorVisible(true)}
                >
                  <Box
                    className={`flex flex-row h-9 ${
                      isZapActive ? '' : 'w-[3rem]'
                    } mr-1`}
                  >
                    {tokenName !== '' ? (
                      <img
                        src={
                          isZapActive
                            ? `/assets/${tokenName.toLowerCase()}.svg`
                            : '/assets/rdpx_lp.png'
                        }
                        alt={tokenName}
                        className={isZapActive ? '' : 'ml-1'}
                      />
                    ) : (
                      <LoaderIcon className="mt-3.5 ml-3.5" />
                    )}
                  </Box>
                  <Typography variant="h5" className="text-white pb-1 pr-1.5">
                    {isZapActive ? (
                      <span className={'ml-1'}>{tokenName}</span>
                    ) : (
                      'rDPX LP'
                    )}
                  </Typography>
                </Box>
                <Box
                  className="bg-[#43609A] hover:opacity-90 flex-row ml-3 mt-1 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
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
                  value={rawAmount}
                  onChange={(e) => setRawAmount(e.target.value)}
                  classes={{ input: 'text-right' }}
                />
              </Box>
              <Box className="flex flex-row justify-between">
                <Box className="flex">
                  <Typography
                    variant="h6"
                    className="text-[#78859E] text-sm pl-1 pt-2"
                  >
                    {isZapActive ? (
                      <div className={'flex'}>
                        <ZapIcon id={'6'} className={'mt-0.5 mr-1.5'} />
                        Zap is active
                      </div>
                    ) : (
                      'LP Token'
                    )}
                  </Typography>
                </Box>
                <Box className="ml-auto mr-0">
                  <Typography
                    variant="h6"
                    className="text-[#78859E] text-sm pl-1 pt-2 pr-3"
                  >
                    Balance:{' '}
                    <span className="text-white">
                      {formatAmount(
                        getUserReadableAmount(
                          userTokenBalance,
                          getDecimalsFromSymbol(tokenName, chainId)
                        ),
                        2
                      )}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="h-[12.88rem]">
              <Box className={'flex'}>
                <Box className="rounded-tl-xl flex p-3 border border-[#232935] w-full">
                  <Box className={'w-5/6'}>
                    {obtainableLP === 0 ? (
                      <Typography variant="h5" className="text-white pb-1 pr-2">
                        {formatAmount(
                          getUserReadableAmount(userData.deposits, 18),
                          2
                        )}
                      </Typography>
                    ) : (
                      <Box className="flex">
                        <ArrowRightIcon
                          className={'mt-2 mr-2'}
                          fill={'#22E1FF'}
                        />
                        <Typography
                          variant="h5"
                          className="text-[#22E1FF] pb-1 pr-2"
                        >
                          {formatAmount(
                            obtainableLP +
                              getUserReadableAmount(userData.deposits, 18),
                            2
                          )}{' '}
                          LP
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="h6"
                      className="text-[#78859E] pb-1 pr-2"
                    >
                      Your deposit
                    </Typography>
                  </Box>
                </Box>
                <Box className="rounded-tr-xl flex flex-col p-3 border border-[#232935] w-full">
                  {obtainableLP === 0 ? (
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      {data.totalDeposits.gt(0)
                        ? formatAmount(
                            (100 *
                              getUserReadableAmount(userData.deposits, 18)) /
                              getUserReadableAmount(data.totalDeposits, 18),
                            2
                          )
                        : 0}
                      %
                    </Typography>
                  ) : (
                    <Box className="flex">
                      <ArrowRightIcon
                        className={'mt-2 mr-2'}
                        fill={'#22E1FF'}
                      />
                      <Typography
                        variant="h5"
                        className="text-[#22E1FF] pb-1 pr-2"
                      >
                        {userData.deposits.gt(0)
                          ? formatAmount(
                              (100 *
                                (getUserReadableAmount(userData.deposits, 18) +
                                  obtainableLP)) /
                                getUserReadableAmount(data.totalDeposits, 18),
                              2
                            )
                          : '0'}
                        %
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="h6" className="text-[#78859E] pb-1 pr-2">
                    Pool share
                  </Typography>
                </Box>
              </Box>

              <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-[#232935] w-full">
                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-[#78859E] ml-0 mr-auto"
                  >
                    Mint Price
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(data.mintPrice, 18),
                        8
                      )}{' '}
                      LP
                    </Typography>
                  </Box>
                </Box>

                <Box className={'flex mb-2'}>
                  <Typography
                    variant="h6"
                    className="text-[#78859E] ml-0 mr-auto"
                  >
                    Time remaining
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {timeRemaining}
                    </Typography>
                  </Box>
                </Box>

                <Box className={'flex'}>
                  <Typography
                    variant="h6"
                    className="text-[#78859E] ml-0 mr-auto"
                  >
                    Deposit limit
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(data.totalDeposits, 18),
                        0
                      ).replace('.', '')}{' '}
                      LP{' '}
                      <span className="opacity-50">
                        / {getUserReadableAmount(data.maxLpDeposits, 18)} LP
                      </span>
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  className={'mt-3 rounded-sm'}
                  value={
                    (100 * getUserReadableAmount(data.totalDeposits, 18)) /
                    getUserReadableAmount(data.maxLpDeposits, 18)
                  }
                />
              </Box>
            </Box>

            <Box
              className={`rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] ${
                tokenName === 'ETH' ? 'mt-[6.7rem]' : 'mt-12'
              }`}
            >
              <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
                <EstimatedGasCostButton gas={2000000} chainId={chainId} />
              </Box>

              {tokenName !== 'ETH' ? (
                <ZapInButton
                  openZapIn={openZapIn}
                  isZapActive={isZapActive}
                  quote={quote}
                  path={path}
                  isFetchingPath={isZapActive ? isFetchingPath : false}
                  tokenName={tokenName}
                  ssovTokenSymbol={'ETH'}
                  selectedTokenPrice={selectedTokenPrice}
                  isZapInAvailable={isZapInAvailable}
                  chainId={chainId}
                  background={'bg-[#43609A]'}
                />
              ) : null}

              <Box className={'flex mb-2'}>
                <Box className="flex text-center p-2 mr-2">
                  <img src="/assets/pepelock.svg" className="w-4 h-5" />
                </Box>
                <Typography variant="h6" className="text-[#78859E]">
                  This will lock your rDPX LP tokens for two weeks.
                </Typography>
              </Box>
              <CustomButton
                size="medium"
                className={styles.pepeButton}
                disabled={
                  amount <= 0 || isFetchingPath || !data.isDepositPeriod
                }
                onClick={approved ? handlePurchase : handleApprove}
              >
                <Typography variant="h5" className={styles.pepeButtonText}>
                  {data.isDepositPeriod
                    ? approved
                      ? 'PURCHASE'
                      : 'APPROVE'
                    : 'DEPOSITS ARE CLOSED'}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        ) : null}
        {activeTab === 'mint' ? (
          <Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
              <Box className="flex flex-row justify-between mb-2">
                <Typography variant="h6" className="text-[#78859E] ml-2 mt-1.5">
                  {userData.minted ? 'Minted:' : 'Reserved:'}{' '}
                  <span className="text-white">{pepeReserved}</span>
                </Typography>
              </Box>
              <Box className="h-[17rem] overflow-y-auto overflow-x-hidden">
                {Array.from({ length: pepeReserved }, (_, i) => (
                  <Box
                    className="mt-2 ml-2 mr-2 border border-[#343C4D] flex rounded-md"
                    key={i}
                  >
                    <img
                      src={'/assets/diamondpepe.png'}
                      className={'w-[4rem] m-2 rounded-md'}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        className="text-white ml-2 mt-4 font-bold"
                      >
                        Diamond Pepe
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-white ml-2 mt-1 font-bold"
                      >
                        # ?
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {pepeReserved === 0 ? (
                  <Box className={'flex text-center h-[16rem]'}>
                    <Typography
                      variant="h6"
                      className="text-[#78859E] ml-auto mr-auto mt-auto mb-auto"
                    >
                      Your pepes will appear here
                      <br />
                      ...
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>

            <Box className="rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] mt-12">
              <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
                <Box className={'flex mb-3'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    To receive
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {userData.minted ? 0 : pepeReserved}
                    </Typography>
                  </Box>
                </Box>
                <EstimatedGasCostButton gas={2000000} chainId={chainId} />
              </Box>

              <Box className="flex mb-2">
                <Box className="flex text-center p-2 mr-2">
                  <img src="/assets/alarm.svg" className="w-7 h-5" />
                </Box>
                <Typography variant="h6" className="text-[#78859E]">
                  Check the full reveal on Tofunft after the deposit period on
                  24/2/2022
                </Typography>
              </Box>
              <CustomButton
                size="medium"
                className={styles.pepeButton}
                disabled={!data.isFarmingPeriod || userData.minted}
                onClick={handleMint}
              >
                <Typography variant="h5" className={styles.pepeButtonText}>
                  {data.isFarmingPeriod
                    ? userData.minted
                      ? 'Already minted'
                      : 'Mint'
                    : 'Not ready yet'}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        ) : null}
      </Box>
      <Slide direction="left" in={isZapInVisible} mountOnEnter unmountOnExit>
        <Box className={styles.zapIn}>
          <ZapIn
            setOpen={setIsZapInVisible}
            ssovTokenName={baseTokenName}
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
            ssovToken={baseToken}
            background={[
              'bg-[#181C24]',
              'bg-[#232935]',
              'bg-[#232935]',
              'bg-[#181C24]',
              'bg-[#232935]',
            ]}
          />
        </Box>
      </Slide>
    </Dialog>
  );
};

export default PurchaseDialog;
