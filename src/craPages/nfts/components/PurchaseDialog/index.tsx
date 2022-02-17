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
} from '@dopex-io/sdk';

import { useFormik } from 'formik';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import * as yup from 'yup';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';
import { Tabs, PanelList, Panel } from 'react-swipeable-tab';
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
import ZapIn from '../ZapIn';
import EstimatedGasCostButton from '../../../../components/EstimatedGasCostButton';
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
  data: Data;
  userData: UserData;
  timeRemaining: JSX.Element;
}

const PurchaseDialog = ({
  open,
  handleClose,
  data,
  userData,
  timeRemaining,
}: Props) => {
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
  const diamondPepeNfts1inchRouter =
    DiamondPepeNFTs1inchRouter__factory.connect(
      Addresses[chainId]['1inchRouter'],
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

  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);

  const spender: string = isZapActive ? 'router' : 'normal contract';

  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.3);

  const purchasePower: number = useMemo(() => {
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
  }, [isZapActive, quote, path, slippageTolerance, userTokenBalance]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    await getQuote();
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

  const zapInPurchasePower: number = useMemo(() => {
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
    return purchasePower / price;
  }, [purchasePower, path]);

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
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

    try {
      const { data } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${BigInt(
          userTokenBalance.toString()
        )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
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
            !['RDPX', 'ETH', 'DPX'].includes(item.toUpperCase()) &&
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
      if (baseTokenName === tokenName) {
      } else {
      }

      setRawAmount('0');
      updateAssetBalances();
    } catch (err) {
      console.log(err);
    }
  }, [updateAssetBalances, accountAddress, tokenName, isZapActive]);

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
  }, [isZapInVisible, token, isZapActive]);

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
  }, [token, accountAddress, spender, approved, purchasePower]);

  const setMaxAmount = async () => {
    setRawAmount((purchasePower * 0.99).toFixed(3));
  };

  useEffect(() => {
    handleTokenChange();
  }, [token]);

  // Handles isApproved
  useEffect(() => {
    if (!token) return;
    (async function () {
      const userAmount = IS_NATIVE(token)
        ? BigNumber.from(userAssetBalances.ETH)
        : await token.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(token)
        ? BigNumber.from(0)
        : await token.allowance(
            accountAddress,
            diamondPepeNfts1inchRouter.address
          );

      if (!allowance.eq(0)) {
        setApproved(true);
      } else {
        if (IS_NATIVE(token)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [accountAddress, token, userAssetBalances]);

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

      <Tabs activeIndex={activeIndex} panelIscroll={false}>
        {['deposit', 'withdraw', 'mint'].includes(activeTab) && (
          <Box className={isZapInVisible ? 'hidden' : 'flex'}>
            <Box className={'w-full'}>
              <Box className="flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md">
                <Box
                  className={
                    activeTab === 'deposit'
                      ? 'text-center w-1/3 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                      : 'text-center w-1/3 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
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
                    activeTab === 'withdraw'
                      ? 'text-center w-1/3 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                      : 'text-center w-1/3 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  }
                  onClick={() => setActiveTab('withdraw')}
                >
                  <Typography
                    variant="h6"
                    className={
                      activeTab === 'withdraw'
                        ? 'text-xs font-normal'
                        : 'text-[#78859E] text-xs font-normal'
                    }
                  >
                    Withdraw
                  </Typography>
                </Box>
                <Box
                  className={
                    activeTab === 'mint'
                      ? 'text-center w-1/3 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                      : 'text-center w-1/3 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
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
        <PanelList style={{ height: 39 + extraHeight + 'rem' }}>
          <Panel>
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
                  className="bg-[#43609A] hover:opacity-90 flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
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
                      {formatAmount(purchasePower, 2)}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="h-[12.88rem]">
              <Box className={'flex'}>
                <Box className="rounded-tl-xl flex p-3 border border-[#232935] w-full">
                  <Box className={'w-5/6'}>
                    <Typography variant="h5" className="text-white pb-1 pr-2">
                      {formatAmount(
                        getUserReadableAmount(userData.deposits, 18),
                        2
                      )}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-[#78859E] pb-1 pr-2"
                    >
                      Your deposit
                    </Typography>
                  </Box>
                </Box>
                <Box className="rounded-tr-xl flex flex-col p-3 border border-[#232935] w-full">
                  <Typography variant="h5" className="text-white pb-1 pr-2">
                    {formatAmount(
                      (100 * getUserReadableAmount(userData.deposits, 18)) /
                        getUserReadableAmount(data.totalDeposits, 18),
                      2
                    )}
                    %
                  </Typography>
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
                      LP <span className="opacity-50">/ 2500 LP</span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] mt-12">
              <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
                <EstimatedGasCostButton gas={2000000} />
              </Box>

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

              <Box className="flex mb-2">
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
                disabled={amount <= 0 || isFetchingPath}
                onClick={
                  amount ? (approved ? null : handlePurchase) : handleApprove
                }
              >
                <Typography variant="h5" className={styles.pepeButtonText}>
                  Purchase
                </Typography>
              </CustomButton>
            </Box>
          </Panel>
        </PanelList>
      </Tabs>
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
