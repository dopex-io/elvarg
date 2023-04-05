import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber, ethers } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Slide from '@mui/material/Slide';
import format from 'date-fns/format';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import AlarmIcon from 'svgs/icons/AlarmIcon';
import BigCrossIcon from 'svgs/icons/BigCrossIcon';
import CircleIcon from 'svgs/icons/CircleIcon';
import { useDebounce } from 'use-debounce';

import { SsovV3Data, SsovV3EpochData } from 'store/Vault/ssov';

import CustomButton from 'components/UI/Button';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import InputWithTokenSelector from 'components/common/InputWithTokenSelector';
import PnlChart from 'components/common/PnlChart';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import { getTokenDecimals } from 'utils/general';
import formatAmount from 'utils/general/formatAmount';
import get1inchQuote from 'utils/general/get1inchQuote';
import get1inchSwap from 'utils/general/get1inchSwap';
import isNativeToken from 'utils/general/isNativeToken';
import { getDelta } from 'utils/math/blackScholes/greeks';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { MAX_VALUE, OPTION_TOKEN_DECIMALS } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  ssovData: SsovV3Data;
  ssovEpochData: SsovV3EpochData;
}

const PurchaseDialog = ({
  open,
  handleClose,
  ssovData,
  ssovEpochData,
}: Props) => {
  const {
    accountAddress,
    provider,
    signer,
    contractAddresses,
    updateAssetBalances,
    ssovSigner,
    updateSsovV3UserData,
    updateSsovV3EpochData,
    chainId,
    getContractAddress,
  } = useBoundStore();

  const { tokenPrice, ssovContract, isPut, underlyingSymbol } = ssovData;
  const { ssovContractWithSigner } = ssovSigner;

  const { epochStrikes, availableCollateralForStrikes } = ssovEpochData;

  const [quoteDataLoading, setQuoteDataLoading] = useState(false);
  const [fromTokenSymbol, setFromTokenSymbol] = useState(
    ssovData.collateralSymbol ?? ''
  );
  const [state, setState] = useState({
    volatility: 0,
    optionPrice: BigNumber.from(0),
    fees: BigNumber.from(0),
    premium: BigNumber.from(0),
    expiry: 0,
    totalCost: BigNumber.from(0),
    greeks: {
      delta: 0,
    },
  });
  const [strikeIndex, setStrikeIndex] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [quote, setQuote] = useState({
    amountOut: BigNumber.from(0),
    swapData: '',
  });

  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] = useState(true);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const ssovTokenName = useMemo(() => underlyingSymbol, [underlyingSymbol]);

  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);

  const [debouncedQuote] = useDebounce(quote, 1000);

  const amountPayable = useMemo(() => {
    let _amountPayable = '0';
    if (!chainId) return _amountPayable;

    return formatAmount(
      getUserReadableAmount(
        fromTokenSymbol !== ssovData.collateralSymbol
          ? debouncedQuote.amountOut
          : state.totalCost,
        getTokenDecimals(fromTokenSymbol, chainId)
      ),
      5
    );
  }, [
    chainId,
    fromTokenSymbol,
    state.totalCost,
    debouncedQuote.amountOut,
    ssovData.collateralSymbol,
  ]);

  const routerMode = useMemo(() => {
    return fromTokenSymbol !== ssovData?.collateralSymbol;
  }, [fromTokenSymbol, ssovData]);

  const spender = useMemo(() => {
    return routerMode
      ? ssovSigner?.ssovRouterWithSigner?.address
      : ssovContractWithSigner?.address;
  }, [
    ssovContractWithSigner,
    routerMode,
    ssovSigner?.ssovRouterWithSigner?.address,
  ]);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const [rawOptionsAmount, setRawOptionsAmount] = useState<string>('1');
  const optionsAmount: number = useMemo(() => {
    return parseFloat(rawOptionsAmount) || 0;
  }, [rawOptionsAmount]);

  const debouncedIsChartVisible = useDebounce(isChartVisible, 200);

  const checkApproved = useCallback(async () => {
    if (!ssovData || !accountAddress || !spender) return;

    const finalAmount = state.totalCost;
    const _token = ERC20__factory.connect(
      getContractAddress(fromTokenSymbol),
      provider
    );

    const userAmount = await _token.balanceOf(accountAddress);

    setUserTokenBalance(userAmount);

    const allowance = await _token.allowance(accountAddress, spender);

    if (finalAmount.lte(allowance) || isNativeToken(fromTokenSymbol)) {
      setApproved(true);
    } else {
      setApproved(false);
    }
  }, [
    accountAddress,
    fromTokenSymbol,
    getContractAddress,
    provider,
    spender,
    ssovData,
    state.totalCost,
  ]);

  const updateQuote = useCallback(async () => {
    if (
      !contractAddresses ||
      !ssovData ||
      !ssovData?.collateralSymbol ||
      !routerMode
    )
      return;

    const fromTokenAddress = getContractAddress(fromTokenSymbol);

    const toTokenAddress = ssovData.isPut
      ? fromTokenSymbol === 'USDC'
        ? getContractAddress('USDT')
        : getContractAddress('USDC')
      : ssovData.collateralAddress;

    if (
      !chainId ||
      !accountAddress ||
      fromTokenAddress === toTokenAddress ||
      !ssovSigner ||
      !ssovSigner.ssovRouterWithSigner ||
      !ssovContractWithSigner ||
      !ssovData ||
      !ssovData.collateralSymbol ||
      state.totalCost.isZero()
    )
      return;

    setQuoteDataLoading(true);

    const {
      toTokenAmount,
      toToken: { decimals },
    } = await get1inchQuote(
      fromTokenAddress,
      toTokenAddress,
      getContractReadableAmount(
        1,
        getTokenDecimals(fromTokenSymbol, chainId)
      ).toString(),
      chainId,
      accountAddress,
      '3'
    );

    const collateralTokenDecimals = getTokenDecimals(
      ssovData.collateralSymbol,
      chainId
    );

    const fromTokenDecimals = getTokenDecimals(fromTokenSymbol, chainId);

    let multiplier = BigNumber.from(1);
    let divisor = BigNumber.from(1);

    if (decimals < collateralTokenDecimals) {
      multiplier = getContractReadableAmount(1, fromTokenDecimals);
      divisor = getContractReadableAmount(
        1,
        collateralTokenDecimals - decimals
      );
    } else {
      multiplier = getContractReadableAmount(1, fromTokenDecimals);
    }

    const fromTokenAmountRequired: BigNumber = state.totalCost
      .mul(multiplier)
      .div(toTokenAmount)
      .div(divisor);

    if (fromTokenAmountRequired.isZero()) return;

    await get1inchSwap({
      fromTokenAddress,
      toTokenAddress,
      amount: fromTokenAmountRequired,
      chainId,
      accountAddress: ssovSigner.ssovRouterWithSigner.address,
    })
      .then((res: any) => {
        setQuote({
          amountOut: fromTokenAmountRequired,
          swapData: res.tx.data,
        });
      })
      .then(() => setQuoteDataLoading(false));
  }, [
    routerMode,
    accountAddress,
    getContractAddress,
    chainId,
    contractAddresses,
    fromTokenSymbol,
    ssovData,
    ssovContractWithSigner,
    ssovSigner,
    state.totalCost,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRawOptionsAmount(e.target.value);
    },
    []
  );

  const collateralCTA = useMemo(() => {
    if (ssovData?.isPut) {
      return (
        <Box
          role="button"
          className="underline ml-auto mt-1"
          onClick={() => setFromTokenSymbol(ssovData.collateralSymbol!)}
        >
          <Typography variant="h6" className="text-stieglitz underline">
            Use 2CRV
          </Typography>
        </Box>
      );
    } else if (ssovData?.collateralSymbol === 'wstETH') {
      return (
        <a
          href="https://app.1inch.io/#/42161/unified/swap/ETH/wstETH"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mt-1"
        >
          <Box role="button" className="underline">
            <Typography variant="h6" className="text-stieglitz">
              Get wstETH
            </Typography>
          </Box>
        </a>
      );
    }
    return <React.Fragment />;
  }, [ssovData]);

  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  const handleApprove = useCallback(async () => {
    if (!spender || !signer) return;

    try {
      await sendTx(
        ERC20__factory.connect(getContractAddress(fromTokenSymbol)!, signer),
        'approve',
        [spender, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, fromTokenSymbol, getContractAddress]);

  const handlePurchase = useCallback(async () => {
    if (
      !ssovContractWithSigner ||
      !accountAddress ||
      !ssovSigner ||
      !(chainId === 137 || ssovSigner.ssovRouterWithSigner)
    )
      return;

    const _amount = getContractReadableAmount(
      optionsAmount,
      OPTION_TOKEN_DECIMALS
    );

    const contractWithSigner = routerMode
      ? ssovSigner.ssovRouterWithSigner
      : ssovContractWithSigner;

    const toTokenAddress = ssovData.isPut
      ? fromTokenSymbol === 'USDC'
        ? getContractAddress('USDT')
        : getContractAddress('USDC')
      : ssovData.collateralAddress;

    const params = routerMode
      ? [
          ssovContractWithSigner.address,
          getContractAddress(fromTokenSymbol),
          toTokenAddress,
          accountAddress,
          strikeIndex,
          routerMode ? debouncedQuote.amountOut : state.totalCost,
          '0',
          debouncedQuote.swapData,
        ]
      : [strikeIndex, _amount, accountAddress];

    isNativeToken(fromTokenSymbol) ? params.push({ value: _amount }) : 0;

    const method = routerMode ? 'swapAndPurchase' : ('purchase' as any);

    try {
      await sendTx(contractWithSigner!, method, params);
      setRawOptionsAmount('0');
      updateAssetBalances();
      updateSsovV3UserData();
      updateSsovV3EpochData();
    } catch (err) {
      console.log(err);
      setRawOptionsAmount('0');
    }
  }, [
    ssovData.collateralAddress,
    ssovData.isPut,
    accountAddress,
    optionsAmount,
    sendTx,
    ssovContractWithSigner,
    strikeIndex,
    updateAssetBalances,
    updateSsovV3UserData,
    updateSsovV3EpochData,
    fromTokenSymbol,
    getContractAddress,
    routerMode,
    ssovSigner,
    state.totalCost,
    debouncedQuote.amountOut,
    debouncedQuote.swapData,
  ]);

  // Calculate the Option Price & Fees
  useEffect(() => {
    if (
      !ssovContract ||
      strikeIndex === null ||
      optionsAmount === 0 ||
      optionsAmount.toString() === ''
    ) {
      setState((prev) => ({
        ...prev,
        volatility: 0,
        optionPrice: BigNumber.from(0),
        fees: BigNumber.from(0),
        premium: BigNumber.from(0),
        expiry: 0,
        totalCost: BigNumber.from(0),
      }));
      return;
    }

    async function updateOptionPrice() {
      if (!ssovContract || !ssovEpochData || !ssovData) return;

      const strike = epochStrikes[strikeIndex];

      const expiry = ssovEpochData.epochTimes[1]!.toNumber();

      const timeToExpirationInYears = getTimeToExpirationInYears(expiry);

      try {
        const [_volatility, _premium, _fees] = await Promise.all([
          ssovContract.getVolatility(strike!),
          ssovContract.calculatePremium(
            strike!,
            getContractReadableAmount(1, 18),
            expiry
          ),
          ssovContract.calculatePurchaseFees(
            strike!,
            getContractReadableAmount(String(optionsAmount), 18)
          ),
        ]);

        const volatility = _volatility.toNumber();

        const optionPrice = _premium
          .mul(ssovData.collateralPrice!)
          .div(oneEBigNumber(18));

        let premium = optionPrice
          .mul(getContractReadableAmount(optionsAmount, 18))
          .div(oneEBigNumber(18)); // avoid crashing when users buy <1 options

        let fees = _fees;

        let _totalCost;
        if (isPut) {
          _totalCost = premium.mul(oneEBigNumber(10)).add(fees);
        } else {
          _totalCost = premium
            .mul(oneEBigNumber(18))
            .add(fees.mul(ssovData.collateralPrice!));
        }

        const _greeks = {
          delta: getDelta(
            getUserReadableAmount(ssovData.underlyingPrice!, 8),
            getUserReadableAmount(strike!, 8),
            timeToExpirationInYears,
            volatility / 100,
            0,
            isPut ? 'put' : 'call'
          ),
        };

        setState({
          volatility,
          optionPrice,
          premium,
          fees,
          expiry,
          totalCost: isPut
            ? _totalCost
            : _totalCost.div(ssovData.collateralPrice!),
          greeks: _greeks,
        });

        setIsPurchaseStatsLoading(false);
      } catch (err) {
        console.log(err);
        setIsPurchaseStatsLoading(false);
      }
    }
    updateOptionPrice();
  }, [
    strikeIndex,
    epochStrikes,
    optionsAmount,
    ssovContract,
    provider,
    isPut,
    ssovData,
    ssovEpochData,
    ssovTokenName,
  ]);

  // Updates the approved and user balance state
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  const purchaseButtonProps = useMemo(() => {
    const totalCost = routerMode ? debouncedQuote.amountOut : state.totalCost;

    const disabled = Boolean(
      optionsAmount <= 0 ||
        isPurchaseStatsLoading ||
        (isPut
          ? availableCollateralForStrikes[strikeIndex]!.mul(oneEBigNumber(8))
              .div(getContractReadableAmount(strikes[strikeIndex]!, 8))
              .lt(getContractReadableAmount(optionsAmount, 18))
          : availableCollateralForStrikes[strikeIndex]!.lt(
              getContractReadableAmount(optionsAmount, 18)
            )) ||
        (isPut
          ? totalCost.gt(userTokenBalance)
          : totalCost
              .mul(1e8)
              .div(ssovData.collateralPrice!)
              .gt(userTokenBalance)) ||
        quoteDataLoading
    );

    let onClick = () => {};

    if (optionsAmount > 0) {
      if (approved) {
        onClick = handlePurchase;
      } else {
        onClick = handleApprove;
      }
    }

    let children = 'Enter an amount';

    if (isPurchaseStatsLoading) {
      children = 'Loading prices...';
    } else if (optionsAmount > 0) {
      if (
        isPut
          ? availableCollateralForStrikes[strikeIndex]!.mul(oneEBigNumber(8))
              .div(getContractReadableAmount(strikes[strikeIndex]!, 8))
              .lt(getContractReadableAmount(optionsAmount, 18))
          : availableCollateralForStrikes[strikeIndex]!.lt(
              getContractReadableAmount(optionsAmount, 18)
            )
      ) {
        children = 'Collateral not available';
      } else if (
        isPut
          ? totalCost.gt(userTokenBalance)
          : totalCost
              .mul(1e8)
              .div(ssovData.collateralPrice!)
              .gt(userTokenBalance)
      ) {
        children = 'Insufficient Balance';
      } else if (approved) {
        children = 'Purchase';
      } else {
        children = 'Approve';
      }
    } else {
      children = 'Enter an amount';
    }

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    quoteDataLoading,
    debouncedQuote.amountOut,
    routerMode,
    optionsAmount,
    isPurchaseStatsLoading,
    isPut,
    availableCollateralForStrikes,
    strikeIndex,
    strikes,
    state,
    userTokenBalance,
    ssovData,
    approved,
    handlePurchase,
    handleApprove,
  ]);

  // @todo
  const handleMax = useCallback(() => {}, []);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <>
        <Box className="flex flex-row items-center mb-4">
          <Box className="flex w-full justify-between">
            <Typography variant="h5">Buy Options</Typography>
            <Box className="flex mb-3 mr-3">{collateralCTA}</Box>
          </Box>
          <IconButton
            className={'p-0 pb-1 mr-0 mt-0.5 ml-auto'}
            onClick={handleClose}
            size="large"
          >
            <BigCrossIcon className="" />
          </IconButton>
        </Box>
        <Box className="bg-umbra rounded-2xl flex flex-col mb-4  pr-2">
          <Box className="flex flex-row justify-between">
            <InputWithTokenSelector
              topRightTag="Options Size"
              topLeftTag="Pay With"
              selectedTokenSymbol={fromTokenSymbol}
              setSelectedToken={setFromTokenSymbol}
              inputAmount={rawOptionsAmount}
              handleMax={handleMax}
              handleInputAmountChange={handleInputChange}
              overrides={{ setTokenSelectorOpen }}
            />
          </Box>
          <Box className="flex flex-row justify-between"></Box>
        </Box>
        {!tokenSelectorOpen && (
          <Box>
            {debouncedIsChartVisible[0] && (
              <Slide direction="left" in={isChartVisible}>
                <Box className="p-3 bg-cod-gray rounded-md border border-neutral-800">
                  <PnlChart
                    breakEven={
                      isPut
                        ? Number(strikes[strikeIndex]) -
                          getUserReadableAmount(state.optionPrice, 8)
                        : Number(strikes[strikeIndex]) +
                          getUserReadableAmount(state.optionPrice, 8)
                    }
                    optionPrice={getUserReadableAmount(state.optionPrice, 8)}
                    amount={optionsAmount}
                    isPut={isPut!}
                    price={getUserReadableAmount(tokenPrice!, 8)}
                    symbol={ssovTokenName!}
                  />
                </Box>
              </Slide>
            )}
            {!debouncedIsChartVisible[0] && (
              <Slide direction="left" in={!isChartVisible}>
                <Box className="h-full">
                  <Box className={'flex'}>
                    <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
                      <Box className={'w-5/6'}>
                        <Typography
                          variant="h5"
                          className="text-white pb-1 pr-2"
                        >
                          ${strikes[strikeIndex]}
                        </Typography>
                        <Typography
                          variant="h6"
                          className="text-stieglitz pb-1 pr-2"
                        >
                          Strike Price
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
                              className={
                                'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'
                              }
                            />
                          ) : (
                            <ArrowDropDownIcon
                              className={
                                'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'
                              }
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
                              ${strike}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    </Box>
                    <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
                      <Typography variant="h5" className="text-white pb-1 pr-2">
                        {state.expiry
                          ? format(new Date(state.expiry * 1000), 'd LLL yyyy')
                          : '-'}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz pb-1 pr-2"
                      >
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
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          $
                          {isPut
                            ? formatAmount(
                                Number(strikes[strikeIndex]) -
                                  getUserReadableAmount(state.optionPrice, 8),
                                5
                              )
                            : formatAmount(
                                Number(strikes[strikeIndex]) +
                                  getUserReadableAmount(state.optionPrice, 8),
                                5
                              )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={'flex mb-2'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Available
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          {formatAmount(
                            isPut
                              ? getUserReadableAmount(
                                  availableCollateralForStrikes[strikeIndex]!,
                                  18
                                ) / Number(strikes[strikeIndex])
                              : getUserReadableAmount(
                                  availableCollateralForStrikes[strikeIndex]!,
                                  18
                                ),
                            5
                          )}{' '}
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
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          ${ethers.utils.formatUnits(state.optionPrice, 8)}
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
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          {isPut ? 'PUT' : 'CALL'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={'flex mb-2'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        IV
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          {state.volatility}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={'flex'}>
                      <Typography
                        variant="h6"
                        className="text-stieglitz ml-0 mr-auto"
                      >
                        Delta
                      </Typography>
                      <Box className={'text-right'}>
                        <Typography
                          variant="h6"
                          className="text-white mr-auto ml-0"
                        >
                          {state.greeks.delta.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Slide>
            )}
          </Box>
        )}
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
                Option Size
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(optionsAmount, 5)}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Fees
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  $
                  {formatAmount(
                    isPut
                      ? getUserReadableAmount(
                          state.fees.mul(ssovData.lpPrice!),
                          36
                        )
                      : getUserReadableAmount(
                          state.fees.mul(ssovData.collateralPrice!),
                          26
                        ),
                    5
                  )}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Premium
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  ${formatAmount(getUserReadableAmount(state.premium, 8), 5)}{' '}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                You will pay
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {amountPayable} {fromTokenSymbol}
                </Typography>
              </Box>
            </Box>
          </Box>
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
      </>
    </Dialog>
  );
};

export default PurchaseDialog;
