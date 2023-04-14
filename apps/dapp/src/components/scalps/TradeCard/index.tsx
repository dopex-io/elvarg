import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { MINIMUM_MARGIN } from 'utils/contracts/option-scalps';

import { MAX_VALUE } from 'constants/index';

const TradeCard = () => {
  const {
    chainId,
    accountAddress,
    signer,
    contractAddresses,
    selectedPoolName,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
    uniWethPrice,
    uniArbPrice,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('30m');

  const [hoursToExpiry, setHoursToExpiry] = useState<string>('24h');

  const [premium, setPremium] = useState<BigNumber>(BigNumber.from(0));

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('10');

  const [leverage, setLeverage] = useState<number>(20);

  const [isShort, setIsShort] = useState<boolean>(false);

  const [showAsQuote, setShowAsQuote] = useState<boolean>(false);

  const [orderType, setOrderType] = useState<string>('Market');

  const markPrice = useMemo(() => {
    if (selectedPoolName === 'ETH') return uniWethPrice;
    else if (selectedPoolName === 'ARB') return uniArbPrice;
    return BigNumber.from('0');
  }, [uniWethPrice, uniArbPrice, selectedPoolName]);

  const isShortAfterAdjustments = useMemo(() => {
    if (optionScalpData?.inverted) return !isShort;
    return isShort;
  }, [isShort, optionScalpData]);

  const positionDetails = useMemo(() => {
    let _positionDetails = {
      sizeInQuote: 0,
      marginInQuote: 0,
    };

    if (!optionScalpData) return _positionDetails;

    const { quoteDecimals } = optionScalpData;
    if (!markPrice) return _positionDetails;
    let _markPrice = showAsQuote
      ? 1
      : Number(markPrice) / 10 ** quoteDecimals.toNumber();

    _positionDetails = {
      marginInQuote: ((parseFloat(rawAmount) ?? 0) * _markPrice) / leverage,
      sizeInQuote: parseFloat(rawAmount) ?? 0 * _markPrice,
    };

    return _positionDetails;
  }, [leverage, optionScalpData, rawAmount, showAsQuote, markPrice]);

  const handleLeverageChange = (event: any) => {
    setLeverage(event.target.value);
  };

  const posSize = useMemo(() => {
    if (!optionScalpData || positionDetails.marginInQuote === 0)
      return BigNumber.from('0');
    return getContractReadableAmount(
      (positionDetails.marginInQuote * leverage).toFixed(5),
      optionScalpData?.quoteDecimals!.toNumber()!
    );
  }, [positionDetails.marginInQuote, leverage, optionScalpData]);

  const calcPremium = useCallback(async () => {
    if (!optionScalpData) return;

    const seconds: { [key: string]: number } = {
      '1m': 1 * 60,
      '5m': 5 * 60,
      '15m': 15 * 60,
      '30m': 30 * 60,
      '60m': 60 * 60,
    };

    try {
      const estimatedPremium =
        await optionScalpData.optionScalpContract.calcPremium(
          optionScalpData?.markPrice!,
          posSize,
          seconds[selectedTimeWindow]
        );
      setPremium(estimatedPremium);
    } catch (e) {
      console.log(e);
    }
  }, [posSize, optionScalpData, selectedTimeWindow]);

  useEffect(() => {
    calcPremium();
  }, [calcPremium]);

  const handleInputChange = useCallback((e: any) => {
    if (parseFloat(e.target.value) < 0) return;
    setRawAmount(e.target.value === '' ? '0' : e.target.value);
  }, []);

  const tradeButtonProps = useMemo(() => {
    let _props = {
      text: 'Open Position',
      disabled: false,
    };

    if (!optionScalpData) return _props;

    const minMargin = MINIMUM_MARGIN[selectedPoolName];
    if (!minMargin) return _props;

    if (!approved) _props.text = 'Approve';
    else if (positionDetails.marginInQuote === 0) {
      _props.disabled = true;
      _props.text = 'Insert an Amount';
    } else if (positionDetails.marginInQuote < minMargin) {
      _props.disabled = true;
      _props.text =
        'Minium Margin ' + minMargin + ' ' + optionScalpData?.quoteSymbol;
    } else if (
      positionDetails.marginInQuote >
      getUserReadableAmount(
        userTokenBalance,
        optionScalpData.quoteDecimals.toNumber()
      )
    ) {
      _props.disabled = true;
      _props.text = 'Insufficient balance';
    }

    return _props;
  }, [
    approved,
    positionDetails.marginInQuote,
    userTokenBalance,
    optionScalpData,
    selectedPoolName,
  ]);

  const liquidationPrice: number = useMemo(() => {
    let _liquidationPrice = 0;
    const price = getUserReadableAmount(
      optionScalpData?.markPrice!,
      optionScalpData?.quoteDecimals!.toNumber()!
    );
    const size = getUserReadableAmount(
      posSize,
      optionScalpData?.quoteDecimals!.toNumber()!
    );

    const positions = size / price;

    if (positions || positionDetails.marginInQuote) {
      const minAbsThreshold = getUserReadableAmount(
        optionScalpData?.minimumAbsoluteLiquidationThreshold!,
        optionScalpData?.quoteDecimals!.toNumber()
      );

      const variation =
        (positionDetails.marginInQuote - minAbsThreshold * size) / positions;

      if (isShortAfterAdjustments) {
        _liquidationPrice = price + variation;
      } else {
        _liquidationPrice = price - variation;
      }
    }

    if (optionScalpData?.inverted) return 1 / _liquidationPrice;

    return _liquidationPrice;
  }, [isShortAfterAdjustments, positionDetails, posSize, optionScalpData]);

  const timeframeIndex = useMemo(() => {
    const indexes: { [key: string]: number } = {
      '1m': 0,
      '5m': 1,
      '15m': 2,
      '30m': 3,
      '60m': 4,
    };

    return indexes[selectedTimeWindow];
  }, [selectedTimeWindow]);

  const handleApprove = useCallback(async () => {
    if (!optionScalpData?.optionScalpContract || !signer || !contractAddresses)
      return;

    try {
      await sendTx(
        ERC20__factory.connect(
          contractAddresses[optionScalpData.quoteSymbol!],
          signer
        ),
        'approve',
        [optionScalpData?.optionScalpContract?.address, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, optionScalpData, contractAddresses]);

  // Handle trade
  const handleTrade = useCallback(async () => {
    if (
      !optionScalpData?.optionScalpContract ||
      !accountAddress ||
      !signer ||
      !updateOptionScalp ||
      !updateOptionScalpUserData
    )
      return;

    const entryLimit = isShortAfterAdjustments
      ? optionScalpData
          .markPrice!.mul(BigNumber.from(995))
          .div(BigNumber.from(1000))
      : optionScalpData
          .markPrice!.mul(BigNumber.from(1005))
          .div(BigNumber.from(1000));

    try {
      await sendTx(
        optionScalpData.optionScalpContract.connect(signer),
        'openPosition',
        [
          isShortAfterAdjustments,
          posSize,
          timeframeIndex,
          getContractReadableAmount(
            positionDetails.marginInQuote.toFixed(5),
            optionScalpData?.quoteDecimals!.toNumber()
          ),
          entryLimit,
        ]
      ).then(() => updateOptionScalp().then(() => updateOptionScalpUserData()));
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    optionScalpData,
    signer,
    posSize,
    updateOptionScalp,
    updateOptionScalpUserData,
    sendTx,
    timeframeIndex,
    positionDetails.marginInQuote,
    isShortAfterAdjustments,
  ]);

  const handleMax = useCallback(() => {}, []);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !optionScalpData?.optionScalpContract)
        return;
      if (positionDetails.marginInQuote === 0) return;

      const finalAmount: BigNumber = getContractReadableAmount(
        positionDetails.marginInQuote.toFixed(5),
        optionScalpData?.quoteDecimals!.toNumber()!
      );
      const token = ERC20__factory.connect(
        contractAddresses[optionScalpData.quoteSymbol!],
        signer
      );
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    positionDetails.marginInQuote,
    signer,
    chainId,
    optionScalpData,
  ]);

  const handleCheckbox = useCallback((event: any) => {
    setShowAsQuote(event.target.checked);
  }, []);

  const setSelectedMargin = useCallback(
    async (option: number) => {
      if (!optionScalpData) return;
      const { markPrice, quoteDecimals } = optionScalpData;
      if (!markPrice || !quoteDecimals) return;

      if (option == 100) option = 98;

      const fee =
        getUserReadableAmount(
          posSize,
          optionScalpData?.quoteDecimals!.toNumber()
        ) * getUserReadableAmount(optionScalpData?.feeOpenPosition!, 10);

      let _premium: number = 0;
      await calcPremium().then(
        () =>
          (_premium = getUserReadableAmount(premium, quoteDecimals.toNumber()))
      );

      const balance = getUserReadableAmount(
        userTokenBalance,
        quoteDecimals.toNumber()
      );

      const price = showAsQuote ? 1 : Number(markPrice) / 1e6;

      if (userTokenBalance.isZero()) return;

      setRawAmount(
        (
          (((balance - _premium - fee) / price) * leverage * option) /
          100
        ).toFixed(5)
      );
    },
    [
      optionScalpData,
      showAsQuote,
      userTokenBalance,
      leverage,
      premium,
      posSize,
      calcPremium,
    ]
  );

  return (
    <Box className="px-4 pb-4 pt-5 min-w-[24.5rem]">
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="w-full flex items-center justify-center px-3">
          <p className="text-xs text-stieglitz mr-2 ml-auto">
            Show as {optionScalpData?.quoteSymbol}
          </p>
          <Checkbox
            // @ts-ignore
            size="xs"
            className={showAsQuote ? 'p-0 text-white' : 'p-0 text-white border'}
            checked={showAsQuote}
            onChange={handleCheckbox}
          />
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="bg-cod-gray rounded-full pl-1 pr-1 flex pb-2 flex-row items-center">
            <Box className="flex flex-row w-auto p-1 pl-3 pr-2">
              <p
                className={cx(
                  'text-[0.8rem] mt-1 cursor-pointer hover:opacity-50',
                  !isShort ? 'text-green-300' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(false)}
              >
                Long
              </p>
            </Box>
            <Box className="flex flex-row w-auto p-1 pr-3 pl-2">
              <p
                className={cx(
                  'text-[0.8rem] mt-1 cursor-pointer hover:opacity-50',
                  isShort ? 'text-red-400' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(true)}
              >
                Short
              </p>
            </Box>
          </Box>
          <Box className="flex items-center">
            <Input
              disableUnderline
              placeholder="0"
              type="number"
              className="text-md text-white font-mono"
              value={rawAmount}
              onChange={handleInputChange}
              classes={{ input: 'text-right' }}
            />
            <Typography variant="h6" className="text-stieglitz mr-3 ml-1 mb-1">
              {showAsQuote ? optionScalpData?.quoteSymbol : selectedPoolName}
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between items-center mt-2">
          <Box className=" flex mr-2 border border-mineshaft rounded-md ">
            {[10, 25, 50, 75, 100].map((option, i) => (
              <Box
                key={i}
                className={`text-center w-auto cursor-pointer group hover:bg-mineshaft hover:opacity-80`}
                onClick={() => setSelectedMargin(option)}
              >
                <Typography
                  variant="h6"
                  className="text-xs font-light py-2 px-2"
                >
                  {option}%
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="ml-auto mr-0 flex">
            <Typography
              variant="h6"
              onClick={handleMax}
              className="text-stieglitz text-xs font-light pl-1 pr-3 text-[12px]"
            >
              {formatAmount(
                getUserReadableAmount(
                  userTokenBalance,
                  optionScalpData?.quoteDecimals!.toNumber()
                ),
                8
              )}{' '}
              {optionScalpData?.quoteSymbol}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex mb-4">
        {['1m', '5m', '15m', '30m', '60m'].map((time, i) => (
          <Box
            key={i}
            className={
              (i === 0
                ? 'ml-auto mr-1.5'
                : i === 4
                ? 'mr-auto ml-1.5'
                : 'mx-1.5') +
              (time === selectedTimeWindow ? ' bg-mineshaft' : ' bg-umbra') +
              ` text-center w-auto p-2 border-[1px] border-[#1E1E1E] rounded-md cursor-pointer group hover:bg-mineshaft hover:opacity-80`
            }
            onClick={() => setSelectedTimeWindow(time)}
          >
            <Typography variant="h6" className="text-xs font-normal">
              {time}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box>
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]"
            >
              Leverage
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]"
            >
              {leverage}x
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between mt-2 pl-2 pr-3">
          <Slider
            aria-label="Leverage"
            defaultValue={20}
            step={1}
            min={1.1}
            max={110}
            valueLabelDisplay="auto"
            onChange={handleLeverageChange}
          />
        </Box>
      </Box>
      <Box className="bg-umbra rounded-2xl">
        <Box className="flex flex-col mb-4 p-4 w-full">
          <Box className={'flex mb-2'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.8rem]"
            >
              Available Liquidity
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                {formatAmount(
                  getUserReadableAmount(
                    isShort
                      ? optionScalpData?.totalBaseAvailable ?? BigNumber.from(0)
                      : optionScalpData?.totalQuoteAvailable ??
                          BigNumber.from(0)
                            .mul(1e6)
                            .div(markPrice.isZero() ? 1 : markPrice),
                    isShort
                      ? optionScalpData?.baseDecimals!.toNumber()!
                      : optionScalpData?.quoteDecimals!.toNumber()!
                  ),
                  2
                )}{' '}
                {isShort
                  ? optionScalpData?.baseSymbol!
                  : optionScalpData?.quoteSymbol!}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.8rem]"
            >
              Margin
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                {formatAmount(positionDetails.marginInQuote, 3)}{' '}
                {optionScalpData?.quoteSymbol}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Premium
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                {formatAmount(
                  getUserReadableAmount(
                    premium,
                    optionScalpData?.quoteDecimals!.toNumber()
                  ),
                  2
                )}{' '}
                {optionScalpData?.quoteSymbol}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.8rem]"
            >
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                {formatAmount(
                  getUserReadableAmount(
                    posSize,
                    optionScalpData?.quoteDecimals!.toNumber()
                  ) *
                    getUserReadableAmount(
                      optionScalpData?.feeOpenPosition!,
                      10
                    ),
                  2
                )}{' '}
                {optionScalpData?.quoteSymbol}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.8rem]"
            >
              Liquidation Price
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                {formatAmount(liquidationPrice, 4)}{' '}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-1'}>
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.8rem]"
            >
              Max. Slippage
            </Typography>
            <Box className={'text-right'}>
              <Typography
                variant="h6"
                className="text-white mr-auto ml-0 text-[0.8rem]"
              >
                0.5%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="rounded-md  mb-2.5 p-4 pt-4 pb-3.5 border border-neutral-800 w-full bg-neutral-800">
        <p className="text-xs text-stieglitz">Order type</p>

        <Box className="flex mt-2">
          <Box
            key={'Market'}
            className={
              (orderType === 'Market' ? ' bg-mineshaft' : ' bg-umbra') +
              ` mr-1.5 text-center w-auto p-2 border-[1px] border-[#1E1E1E] rounded-md cursor-pointer group hover:bg-mineshaft hover:opacity-80`
            }
            onClick={() => setOrderType('Market')}
          >
            <Typography variant="h6" className="text-xs font-normal">
              Market
            </Typography>
          </Box>

          <Box
            key={'Limit'}
            className={
              (orderType === 'Limit' ? ' bg-mineshaft' : ' bg-umbra') +
              ` text-center w-auto p-2 border-[1px] border-[#1E1E1E] rounded-md cursor-pointer group hover:bg-mineshaft hover:opacity-80`
            }
            onClick={() => setOrderType('Limit')}
          >
            <Typography variant="h6" className="text-xs font-normal">
              Limit
            </Typography>
          </Box>
        </Box>

        {orderType === 'Limit' ? (
          <Box className="mt-3">
            <p className="text-xs text-stieglitz">Limit price</p>
            <Input
              disableUnderline
              placeholder={'34'}
              onChange={() => {}}
              type="number"
              className={`mt-2 border border-mineshaft rounded-md px-2 bg-umbra w-full !w-auto`}
              classes={{ input: 'text-white text-xs text-left py-2' }}
            />
          </Box>
        ) : null}
        {orderType === 'Limit' ? (
          <Box className="mt-3">
            <p className="text-xs text-stieglitz">Expiry</p>
            <Box className="flex mt-2">
              {['1h', '5h', '12h', '24h', '48h'].map((time, i) => (
                <Box
                  key={i}
                  className={
                    (i === 0
                      ? 'mr-1.5'
                      : i === 4
                      ? 'mr-auto ml-1.5'
                      : 'mx-1.5') +
                    (time === hoursToExpiry ? ' bg-mineshaft' : ' bg-umbra') +
                    ` text-center w-auto p-2 border-[1px] border-[#1E1E1E] rounded-md cursor-pointer group hover:bg-mineshaft hover:opacity-80`
                  }
                  onClick={() => setHoursToExpiry(time)}
                >
                  <Typography variant="h6" className="text-xs font-normal">
                    {time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <CustomButton
            size="small"
            className="w-full !rounded-md"
            color={!tradeButtonProps.disabled ? 'primary' : 'mineshaft'}
            disabled={tradeButtonProps.disabled}
            onClick={approved ? handleTrade : handleApprove}
          >
            <p className="text-[0.8rem]">{tradeButtonProps.text}</p>
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeCard;
