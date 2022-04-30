import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Addresses,
  ERC20__factory,
  Aggregation1inchRouterV4__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Slide from '@mui/material/Slide';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';
import format from 'date-fns/format';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import cx from 'classnames';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import PnlChart from 'components/PnlChart';
import ZapIn from 'components/ZapIn';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';
import ZapInButton from 'components/ZapInButton';
import ZapOutButton from 'components/ZapOutButton';
import BigCrossIcon from 'components/Icons/BigCrossIcon';
import CircleIcon from 'components/Icons/CircleIcon';
import AlarmIcon from 'components/Icons/AlarmIcon';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import get1inchQuote from 'utils/general/get1inchQuote';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import { RateVaultContext } from 'contexts/RateVault';

import { MAX_VALUE } from 'constants/index';

import styles from './styles.module.scss';
import Curve2PoolSelector from './components/Curve2PoolSelector';

export interface Props {
  activeVaultContextSide: string;
  strikeIndex: number;
  setStrikeIndex: Function;
}

const PurchaseCard = ({
  activeVaultContextSide,
  strikeIndex,
  setStrikeIndex,
}: Props) => {
  const rateVaultContext = useContext(RateVaultContext);
  const { updateRateVaultEpochData, rateVaultData, rateVaultEpochData } =
    rateVaultContext;
  const { lpPrice } = rateVaultEpochData;

  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, provider, chainId, signer, contractAddresses } =
    useContext(WalletContext);

  const { epochTimes } = rateVaultContext.rateVaultEpochData;

  const epochEndTime: Date = useMemo(() => {
    return new Date(epochTimes[1].toNumber() * 1000);
  }, [epochTimes, activeVaultContextSide]);

  const { aggregation1inchRouter } = useMemo(() => {
    return {
      aggregation1inchRouter: contractAddresses['1inchRouter']
        ? Aggregation1inchRouterV4__factory.connect(
            contractAddresses['1inchRouter'],
            signer
          )
        : null,
    };
  }, [contractAddresses, signer]);

  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);

  const { epochStrikes } = rateVaultEpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);

  const userEpochStrikePurchasableAmount: number = useMemo(() => {
    let available, deposits;

    if (activeVaultContextSide === 'CALL') {
      deposits = rateVaultContext.rateVaultEpochData.callsDeposits[strikeIndex];
      available = deposits.sub(
        rateVaultContext.rateVaultEpochData.totalCallsPurchased
      );
    } else if (activeVaultContextSide === 'PUT') {
      deposits = rateVaultContext.rateVaultEpochData.callsDeposits[strikeIndex];
      available = deposits.sub(
        rateVaultContext.rateVaultEpochData.totalPutsPurchased
      );
    }

    return getUserReadableAmount(available, 18);
  }, [rateVaultEpochData, strikeIndex]);

  const [rawNotionalSize, setRawNotionalSize] = useState<string>('1');

  const notionalSize: number = useMemo(() => {
    return parseFloat(rawNotionalSize) || 0;
  }, [rawNotionalSize]);

  const optionPrice: BigNumber = useMemo(() => {
    const _price =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsCosts[strikeIndex]
        : rateVaultEpochData.putsCosts[strikeIndex];
    return _price;
  }, [rateVaultEpochData, strikeIndex]);

  const optionsAmount: number = useMemo(() => {
    return notionalSize / getUserReadableAmount(optionPrice, 18);
  }, [notionalSize, optionPrice]);

  const totalCost: BigNumber = useMemo(() => {
    return optionPrice.mul(BigNumber.from(Math.round(optionsAmount)));
  }, [optionPrice, optionsAmount]);

  const fees: BigNumber = useMemo(() => {
    const _fees =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsFees[strikeIndex]
        : rateVaultEpochData.putsFees[strikeIndex];

    return _fees.mul(BigNumber.from(Math.round(optionsAmount)));
  }, [rateVaultEpochData, strikeIndex, optionsAmount]);

  const premium: BigNumber = useMemo(() => {
    const _premium =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsPremiumCosts[strikeIndex]
        : rateVaultEpochData.putsPremiumCosts[strikeIndex];

    return _premium.mul(BigNumber.from(Math.round(optionsAmount)));
  }, [rateVaultEpochData, strikeIndex, optionsAmount]);

  const volatility: BigNumber = useMemo(() => {
    return rateVaultEpochData.volatilities[strikeIndex];
  }, [rateVaultEpochData, strikeIndex]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [purchaseTokenName, setPurchaseTokenName] = useState<string>('2CRV');

  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});

  const isZapActive: boolean = useMemo(() => {
    if (activeVaultContextSide === 'PUT')
      return !['2CRV', 'USDC', 'USDT'].includes(
        purchaseTokenName.toUpperCase()
      );
    return purchaseTokenName.toUpperCase() !== '2CRV'.toUpperCase();
  }, [purchaseTokenName, activeVaultContextSide]);

  const spender = useMemo(() => {
    return '0xB3888562628B0C056a8b7619cE6d5bc5480Eb38a';
  }, [activeVaultContextSide, isZapActive, purchaseTokenName]);

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
          userAssetBalances[purchaseTokenName],
          getTokenDecimals(purchaseTokenName, chainId)
        )
      );
    } else {
      return parseFloat(
        getUserReadableAmount(
          userTokenBalance,
          getTokenDecimals(purchaseTokenName, chainId)
        ).toString()
      );
    }
  }, [
    isZapActive,
    path,
    quote,
    userAssetBalances,
    purchaseTokenName,
    userTokenBalance,
    chainId,
  ]);

  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  // Updates the 1inch quote
  useEffect(() => {
    async function updateQuote() {
      if (purchaseTokenName === '2CRV') return;

      const fromTokenAddress: string = IS_NATIVE(purchaseTokenName)
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : contractAddresses[purchaseTokenName];
      const toTokenAddress: string = Addresses[chainId]['USDC'];

      if (fromTokenAddress === toTokenAddress) return;
      if (
        activeVaultContextSide === 'PUT' &&
        fromTokenAddress === contractAddresses['2CRV']
      )
        return;

      const amount: number =
        100 * 10 ** getTokenDecimals(purchaseTokenName, chainId);

      try {
        const quote = await get1inchQuote({
          fromTokenAddress,
          toTokenAddress,
          amount,
          chainId,
          accountAddress,
        });

        setQuote(quote);
      } catch (err) {
        console.log(err);
      }
    }

    updateQuote();
  }, [
    accountAddress,
    contractAddresses,
    purchaseTokenName,
    chainId,
    activeVaultContextSide,
  ]);

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
      getUserReadableAmount(totalCost, getTokenDecimals('2CRV', chainId)) /
      price
    );
  }, [path, quote, totalCost, chainId]);

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
  }, [path, quote, purchasePower]);

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'] === purchaseTokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, purchaseTokenName]);

  const isLiquidityEnough = notionalSize < userEpochStrikePurchasableAmount;
  const isPurchasePowerEnough =
    activeVaultContextSide === 'CALL'
      ? purchasePower >= getUserReadableAmount(totalCost, 18)
      : true;

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const getPath = useCallback(async () => {}, [
    chainId,
    isZapActive,
    quote,
    slippageTolerance,
    spender,
    totalCost,
    contractAddresses,
    purchaseTokenName,
    activeVaultContextSide,
  ]);

  const openZapIn = () => setIsZapInVisible(true);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        ERC20__factory.connect(
          contractAddresses[purchaseTokenName],
          signer
        ).approve(spender, MAX_VALUE)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, contractAddresses, purchaseTokenName]);

  const handlePurchase = useCallback(async () => {
    await sendTx(
      rateVaultContext.rateVaultData.rateVaultContract
        .connect(signer)
        .purchase(
          strikeIndex,
          activeVaultContextSide === 'PUT',
          getContractReadableAmount(notionalSize, 18),
          accountAddress
        )
    );

    updateAssetBalances();
    rateVaultContext.updateRateVaultEpochData();
    rateVaultContext.updateRateVaultUserData();
  }, [
    accountAddress,
    rateVaultContext,
    activeVaultContextSide,
    notionalSize,
    sendTx,
    strikeIndex,
    updateAssetBalances,
  ]);

  const checkDEXAggregatorStatus = useCallback(async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(!!(status === 200));
    } catch (err) {
      setIsZapInAvailable(false);
    }
  }, [chainId]);

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, [checkDEXAggregatorStatus]);

  useEffect(() => {
    getPath();
  }, [getPath]);

  const setMaxAmount = useCallback(async () => {}, [
    epochStrikes,
    isPurchaseStatsLoading,
    purchasePower,
    optionPrice,
    strikeIndex,
  ]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      const finalAmount: BigNumber = getContractReadableAmount(
        notionalSize,
        18
      );
      const token = ERC20__factory.connect(
        contractAddresses[purchaseTokenName],
        provider
      );
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        spender
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    purchaseTokenName,
    accountAddress,
    approved,
    notionalSize,
    contractAddresses,
    spender,
    signer,
    chainId,
  ]);

  useEffect(() => {
    getPath();
  }, [getPath]);

  const purchaseButtonProps = useMemo(() => {
    const disabled = Boolean(
      notionalSize <= 0 ||
        isFetchingPath ||
        !isPurchasePowerEnough ||
        isPurchaseStatsLoading ||
        getUserReadableAmount(totalCost, 18) > purchasePower ||
        !isLiquidityEnough
    );

    let onClick = () => {};

    if (notionalSize > 0 && isPurchasePowerEnough) {
      if (approved) {
        if (isPurchasePowerEnough) {
          onClick = handlePurchase;
        }
      } else {
        onClick = handleApprove;
      }
    }

    let children = 'Enter an amount';

    if (isLiquidityEnough) {
      if (isPurchaseStatsLoading) {
        children = 'Loading prices...';
      } else if (notionalSize > 0) {
        if (isFetchingPath) {
          children = 'Loading Swap Path....';
        } else if (getUserReadableAmount(totalCost, 18) > purchasePower) {
          children = 'Insufficient Balance';
        } else if (approved) {
          children = 'Purchase';
        } else {
          children = 'Approve';
        }
      } else {
        children = 'Enter an amount';
      }
    } else {
      children = 'Not enough liquidity';
    }

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    approved,
    handleApprove,
    handlePurchase,
    isFetchingPath,
    isLiquidityEnough,
    isPurchasePowerEnough,
    isPurchaseStatsLoading,
    notionalSize,
    purchasePower,
    totalCost,
    userEpochStrikePurchasableAmount,
  ]);

  const handleZapOut = () => {
    setPurchaseTokenName('2CRV');
  };

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl lg:pt-4 text-center',
        styles.cardWidth
      )}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Buy Options</Typography>
        <ZapOutButton isZapActive={isZapActive} handleClick={handleZapOut} />
        <IconButton
          className={
            isZapActive
              ? 'p-0 pb-1 mr-0 mt-0.5 ml-4'
              : 'p-0 pb-1 mr-0 mt-0.5 ml-auto'
          }
          size="large"
        >
          <BigCrossIcon className="" />
        </IconButton>
      </Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-10">
              <img src={'/assets/2crv.svg'} alt={'2CRV'} />
            </Box>
          </Box>
          {false ? (
            <Box
              className="bg-mineshaft hover:bg-neutral-700 flex-row ml-4 mt-2 mb-2 rounded-md items-center hidden lg:flex cursor-pointer"
              onClick={setMaxAmount}
            >
              <Typography variant="caption" component="div">
                <span className="text-stieglitz pl-2.5 pr-2.5">MAX</span>
              </Typography>
            </Box>
          ) : (
            ''
          )}
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawNotionalSize}
            onChange={(e) => setRawNotionalSize(e.target.value)}
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
              Notional size ($)
            </Typography>
          </Box>
        </Box>
      </Box>
      <Curve2PoolSelector
        className="mb-4 ml-1"
        token={purchaseTokenName}
        setToken={setPurchaseTokenName}
        isPurchasing={true}
      />
      <Box>
        {isChartVisible ? (
          <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
            <PnlChart
              breakEven={
                activeVaultContextSide === 'PUT'
                  ? Number(strikes[strikeIndex]) -
                    getUserReadableAmount(optionPrice, 8)
                  : Number(strikes[strikeIndex]) +
                    getUserReadableAmount(optionPrice, 8)
              }
              optionPrice={getUserReadableAmount(optionPrice, 8)}
              amount={notionalSize}
              isPut={activeVaultContextSide === 'PUT'}
              price={getUserReadableAmount(lpPrice, 8)}
              symbol={'2CRV'}
            />
          </Box>
        ) : (
          <Box className="h-[12.88rem]">
            <Box className={'flex'}>
              <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                <Box className={'w-5/6'}>
                  <Typography variant="h5" className="text-white pb-1 pr-2">
                    {strikes[strikeIndex]}%
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                    Strike
                  </Typography>
                </Box>
                <Box className="bg-mineshaft hover:bg-neutral-700 rounded-md items-center w-1/6 h-fit clickable">
                  <IconButton
                    className="p-0"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    size="large"
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
                        className="capitalize text-white hover:bg-mineshaft cursor-pointer"
                        onClick={() => {
                          setStrikeIndex(strikeIndex);
                          setAnchorEl(null);
                        }}
                      >
                        {strike}%
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Box>
              <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                <Typography variant="h5" className="text-white pb-1 pr-2">
                  {format(epochEndTime, 'd LLL yyyy')}
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {activeVaultContextSide === 'CALL' ? '+' : '-'}
                    {formatAmount(
                      (getUserReadableAmount(optionPrice, 18) * 52) / (1 / 100),
                      2
                    )}
                    %
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    ${formatAmount(getUserReadableAmount(optionPrice, 18), 6)}
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {activeVaultContextSide}
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
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {getUserReadableAmount(volatility, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
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
              Purchasing with
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(fees, 18), 2)} {'2CRV'}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Premium
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(premium, 18), 2)}{' '}
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          {activeVaultContextSide === 'CALL' ? (
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
                  {purchaseTokenName}
                </Typography>
              </Box>
            </Box>
          ) : null}
          {isZapActive ? (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(zapInTotalCost, 5)} {purchaseTokenName}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                You will pay
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(getUserReadableAmount(totalCost, 18), 2)}{' '}
                  {purchaseTokenName}
                </Typography>
              </Box>
            </Box>
          )}
          <EstimatedGasCostButton gas={700000} chainId={chainId} />
        </Box>
        <ZapInButton
          openZapIn={openZapIn}
          isZapActive={isZapActive}
          quote={quote}
          path={path}
          isFetchingPath={isFetchingPath}
          fromTokenSymbol={purchaseTokenName}
          toTokenSymbol={'USDC'}
          selectedTokenPrice={selectedTokenPrice}
          isZapInAvailable={false}
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
          color={purchaseButtonProps.color}
          disabled={purchaseButtonProps.disabled}
          onClick={purchaseButtonProps.onClick}
        >
          {purchaseButtonProps.children}
        </CustomButton>
      </Box>
      <Slide direction="left" in={isZapInVisible} mountOnEnter unmountOnExit>
        <Box className={styles.zapIn}>
          <ZapIn
            setOpen={setIsZapInVisible}
            fromTokenSymbol={'DPX'}
            toTokenSymbol={'USDC'}
            userTokenBalance={userTokenBalance}
            setFromTokenSymbol={setPurchaseTokenName}
            quote={quote}
            setSlippageTolerance={setSlippageTolerance}
            slippageTolerance={slippageTolerance}
            purchasePower={purchasePower}
            selectedTokenPrice={selectedTokenPrice}
            isInDialog={true}
            isPut={activeVaultContextSide === 'PUT'}
            tokensToExclude={
              activeVaultContextSide === 'PUT' ? ['USDC', 'USDT', '2CRV'] : []
            }
            lpPrice={getUserReadableAmount(lpPrice, 8)}
          />
        </Box>
      </Slide>
    </Box>
  );
};

export default PurchaseCard;
