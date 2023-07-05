import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

import { ERC20__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import cx from 'classnames';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { MINIMUM_MARGIN } from 'utils/contracts/option-scalps';
import formatAmount from 'utils/general/formatAmount';

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

  const [premium, setPremium] = useState<BigNumber>(BigNumber.from(0));

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('10');

  const [rawLimitPrice, setRawLimitPrice] = useState<string>('10');

  const [leverage, setLeverage] = useState<number>(20);

  const [isShort, setIsShort] = useState<boolean>(false);

  const [showAsQuote, setShowAsQuote] = useState<boolean>(false);

  const [orderType, setOrderType] = useState<string>('Market');

  const markPrice = useMemo(() => {
    if (uniWethPrice.eq(0) || uniArbPrice.eq(0))
      return optionScalpData?.markPrice || BigNumber.from('0');
    if (selectedPoolName === 'ETH') return uniWethPrice;
    else if (selectedPoolName === 'ARB') return uniArbPrice;
    return BigNumber.from('0');
  }, [uniWethPrice, uniArbPrice, selectedPoolName, optionScalpData]);

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

    if (isNaN(_positionDetails['marginInQuote']))
      _positionDetails['marginInQuote'] = 0;

    return _positionDetails;
  }, [leverage, optionScalpData, rawAmount, showAsQuote, markPrice]);

  const handleLeverageChange = (event: any) => {
    setLeverage(event.target.value);
  };

  const posSize = useMemo(() => {
    if (!optionScalpData || positionDetails.marginInQuote === 0)
      return BigNumber.from('0');
    return utils.parseUnits(
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
      '2h': 2 * 60 * 60,
      '4h': 4 * 60 * 60,
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

  const maximumTick = useMemo(() => {
    if (!optionScalpData?.markPrice!) return '0';

    const _markPrice = Number(
      utils.formatUnits(
        optionScalpData?.markPrice!,
        optionScalpData?.quoteDecimals!.toNumber()!
      )
    );

    let tick = Math.round(Math.log(_markPrice) / Math.log(1.0001) / 10) * 10;

    tick += isShort ? 10 : -10;

    return (1.0001 ** tick).toFixed(4);
  }, [optionScalpData, isShort]);

  const setMaximumTick = useCallback(() => {
    setRawLimitPrice(maximumTick);
  }, [maximumTick, setRawLimitPrice]);

  const roundedLimitPrice = useMemo(() => {
    if (isNaN(Number(rawLimitPrice)) || !optionScalpData) return;

    const limitPrice =
      Number(rawLimitPrice) *
      10 **
        (optionScalpData?.quoteDecimals!.toNumber() -
          optionScalpData?.baseDecimals!.toNumber());

    let tick0;
    let tick1;
    const spacing = 0;

    if (isShort) {
      tick0 = Math.round(Math.log(limitPrice) / Math.log(1.0001) / 10) * 10;
      tick1 = tick0 + spacing;
    } else {
      tick1 = Math.round(Math.log(limitPrice) / Math.log(1.0001) / 10) * 10;
      tick0 = tick1 - spacing;
    }

    return (1.0001 ** ((tick0 + tick1) / 2) * 10 ** 12).toFixed(4);
  }, [rawLimitPrice, isShort, optionScalpData]);

  useEffect(() => {
    calcPremium();
  }, [calcPremium]);

  useEffect(() => {
    setRawLimitPrice('');
    setRawAmount('');
  }, [selectedPoolName, setRawLimitPrice, setRawAmount]);

  const handleInputChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      if (parseFloat(String(e.target.value)) < 0) return;
      setRawAmount(
        String(e.target.value) === '' ? '0' : String(e.target.value)
      );
    },
    []
  );

  const limitError = useMemo(() => {
    if (!optionScalpData || orderType === 'Market') return null;

    const _markPrice = Number(
      utils.formatUnits(
        optionScalpData?.markPrice!,
        optionScalpData?.quoteDecimals!.toNumber()!
      )
    );

    const _limitPrice = Number(rawLimitPrice);

    if (isShort) {
      return _limitPrice < _markPrice * 1.0001
        ? `Short entry limit price is below the current price, please set limit price higher than ${_markPrice}`
        : null;
    } else {
      return _limitPrice > _markPrice * 0.9999
        ? `Long entry limit price is above the current price, please set limit price lower than ${_markPrice}`
        : null;
    }
  }, [isShort, rawLimitPrice, optionScalpData, orderType]);

  const tradeButtonProps = useMemo(() => {
    let _props = {
      text: 'Open Position',
      disabled: false,
    };

    if (!optionScalpData) return _props;

    const minMargin = MINIMUM_MARGIN[selectedPoolName];
    if (!minMargin) return _props;

    const _quoteSymbol =
      optionScalpData?.quoteSymbol === 'USDC'
        ? 'USDC.e'
        : optionScalpData?.quoteSymbol;

    const _maxSize = Number(
      utils.formatUnits(
        optionScalpData?.maxSize!,
        optionScalpData?.quoteDecimals!.toNumber()!
      )
    );

    if (!approved) _props.text = 'Approve';
    else if (positionDetails.marginInQuote === 0) {
      _props.disabled = true;
      _props.text = 'Insert an Amount';
    } else if (positionDetails.marginInQuote < minMargin) {
      _props.disabled = true;
      _props.text = 'Minimum Margin ' + minMargin + ' ' + _quoteSymbol;
    } else if (positionDetails.sizeInQuote >= _maxSize) {
      _props.disabled = true;
      _props.text =
        'Max. position size is ' +
        formatAmount(_maxSize, 0) +
        ' ' +
        _quoteSymbol;
    } else if (
      positionDetails.marginInQuote >
      Number(
        utils.formatUnits(
          userTokenBalance,
          optionScalpData?.quoteDecimals!.toNumber()!
        )
      )
    ) {
      _props.disabled = true;
      _props.text = 'Insufficient balance';
    } else if (limitError) {
      _props.disabled = true;
      _props.text = limitError;
    } else if (
      utils
        .parseUnits(
          String(positionDetails.sizeInQuote),
          optionScalpData?.quoteDecimals!.toNumber()
        )
        .gt(
          isShort
            ? optionScalpData
                ?.totalBaseAvailable!.mul(markPrice)
                .div(10 ** optionScalpData?.quoteDecimals!.toNumber())
            : optionScalpData?.totalQuoteAvailable!
        )
    ) {
      _props.disabled = true;
      _props.text = 'Insufficient Liquidity';
    }

    return _props;
  }, [
    isShort,
    markPrice,
    approved,
    positionDetails,
    userTokenBalance,
    optionScalpData,
    selectedPoolName,
    limitError,
  ]);

  const liquidationPrice: number = useMemo(() => {
    if (!optionScalpData?.markPrice) return 0;

    let _liquidationPrice = 0;
    const price = Number(
      utils.formatUnits(
        optionScalpData?.markPrice!,
        optionScalpData?.quoteDecimals!.toNumber()!
      )
    );
    const size = Number(
      utils.formatUnits(posSize!, optionScalpData?.quoteDecimals!.toNumber()!)
    );

    const positions = size / price;

    if (positions || positionDetails.marginInQuote) {
      const minAbsThreshold = Number(
        utils.formatUnits(
          optionScalpData?.minimumAbsoluteLiquidationThreshold!,
          optionScalpData?.quoteDecimals!.toNumber()!
        )
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
      '2h': 5,
      '4h': 6,
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
        [
          orderType === 'Limit'
            ? optionScalpData?.limitOrdersContract?.address
            : optionScalpData?.optionScalpContract?.address,
          MAX_VALUE,
        ]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, optionScalpData, contractAddresses, orderType]);

  // Handle trade
  const handleTrade = useCallback(async () => {
    if (
      !optionScalpData?.optionScalpContract ||
      !optionScalpData?.limitOrdersContract ||
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

    if (orderType === 'Market') {
      try {
        await sendTx(
          optionScalpData.optionScalpContract.connect(signer),
          'openPosition',
          [
            isShortAfterAdjustments,
            posSize,
            timeframeIndex,
            utils.parseUnits(
              positionDetails.marginInQuote.toFixed(5),
              optionScalpData?.quoteDecimals!.toNumber()
            ),
            entryLimit,
          ]
        ).then(() =>
          updateOptionScalp().then(() => updateOptionScalpUserData())
        );
      } catch (err) {
        console.log(err);
      }
    } else if (orderType === 'Limit') {
      try {
        const limitPrice =
          Number(rawLimitPrice) *
          10 **
            (optionScalpData?.quoteDecimals!.toNumber() -
              optionScalpData?.baseDecimals!.toNumber());

        const spacing = 10;

        let tick0;
        let tick1;

        if (isShort) {
          tick0 = Math.round(Math.log(limitPrice) / Math.log(1.0001) / 10) * 10;
          tick1 = tick0 + spacing;
        } else {
          tick1 = Math.round(Math.log(limitPrice) / Math.log(1.0001) / 10) * 10;
          tick0 = tick1 - spacing;
        }

        await sendTx(
          optionScalpData.limitOrdersContract.connect(signer),
          'createOpenOrder',
          [
            isShort,
            posSize,
            timeframeIndex,
            utils.parseUnits(
              positionDetails.marginInQuote.toFixed(5),
              optionScalpData?.quoteDecimals!.toNumber()
            ), // margin + fees + premium
            tick0,
            tick1,
          ]
        ).then(() =>
          updateOptionScalp().then(() => updateOptionScalpUserData())
        );
      } catch (err) {
        console.log(err);
      }
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
    orderType,
    rawLimitPrice,
    isShort,
  ]);

  const handleMax = useCallback(() => {}, []);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !optionScalpData?.optionScalpContract)
        return;

      if (positionDetails.marginInQuote === 0) {
        setApproved(true);
        return;
      }

      const finalAmount: BigNumber = utils.parseUnits(
        positionDetails.marginInQuote.toFixed(5),
        optionScalpData?.quoteDecimals!.toNumber()!
      );
      const token = ERC20__factory.connect(
        contractAddresses[optionScalpData.quoteSymbol!],
        signer
      );
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        orderType === 'Limit'
          ? optionScalpData?.limitOrdersContract?.address
          : optionScalpData?.optionScalpContract?.address
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
    orderType,
  ]);

  const handleOrderTypeToggle = useCallback(() => {
    setOrderType(orderType === 'Market' ? 'Limit' : 'Market');
  }, [orderType]);

  const setSelectedMargin = useCallback(
    async (option: number) => {
      if (!optionScalpData) return;
      const { markPrice, quoteDecimals } = optionScalpData;
      if (!markPrice || !quoteDecimals) return;

      if (option == 100) option = 98;

      const fee =
        Number(
          utils.formatUnits(
            posSize,
            optionScalpData?.quoteDecimals!.toNumber()!
          )
        ) * Number(utils.formatUnits(optionScalpData?.feeOpenPosition!, 10));

      let _premium: number = 0;
      await calcPremium().then(
        () =>
          (_premium = Number(
            utils.formatUnits(
              premium,
              optionScalpData?.quoteDecimals!.toNumber()!
            )
          ))
      );

      const balance = Number(
        utils.formatUnits(
          userTokenBalance,
          optionScalpData?.quoteDecimals!.toNumber()!
        )
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
    <div className="px-4 pb-4 pt-5 min-w-[24.5rem]">
      <div className="w-full flex items-center justify-center px-3 mb-4">
        <p className="text-xs text-stieglitz mr-2 ml-auto">
          Open with a limit order
        </p>
        <Checkbox
          // @ts-ignore
          size="xs"
          className={
            orderType === 'Limit' ? 'p-0 text-white' : 'p-0 text-white border'
          }
          checked={orderType === 'Limit'}
          onChange={handleOrderTypeToggle}
        />
      </div>
      <div className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <div className="flex flex-row justify-between mt-0.5">
          <div className="bg-cod-gray rounded-full pl-1 pr-1 flex pb-2 flex-row items-center">
            <div className="flex flex-row w-auto p-1 pl-3 pr-2">
              <p
                className={cx(
                  'text-[0.8rem] mt-1 cursor-pointer hover:opacity-50',
                  !isShort ? 'text-green-300' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(false)}
              >
                Long
              </p>
            </div>
            <div className="flex flex-row w-auto p-1 pr-3 pl-2">
              <p
                className={cx(
                  'text-[0.8rem] mt-1 cursor-pointer hover:opacity-50',
                  isShort ? 'text-red-400' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(true)}
              >
                Short
              </p>
            </div>
          </div>
          <div className="flex items-center ml-6">
            <Input
              color="cod-gray"
              variant="small"
              placeholder="0"
              type="number"
              value={rawAmount}
              handleChange={handleInputChange}
            />
            <h6 className="text-stieglitz mr-3 ml-1">
              {showAsQuote ? optionScalpData?.quoteSymbol : selectedPoolName}
            </h6>
          </div>
        </div>
        {orderType === 'Limit' ? (
          <div className="mt-3">
            <p
              className="text-xs text-stieglitz cursor-pointer mb-1"
              onClick={setMaximumTick}
            >
              Limit price -{' '}
              <u>
                {!isShort ? 'Min. $' : 'Max. $'}
                {maximumTick}
              </u>
            </p>
            <Input
              color="cod-gray"
              placeholder={String(
                Number(
                  utils.formatUnits(
                    markPrice,
                    optionScalpData?.quoteDecimals!.toNumber()!
                  )
                )
              )}
              value={rawLimitPrice}
              handleChange={(e: {
                target: { value: React.SetStateAction<string | number> };
              }) => setRawLimitPrice(String(e.target.value))}
              type="number"
              variant="small"
            />
            <p className="text-xs text-stieglitz mt-2.5">
              Your price will be rounded to {roundedLimitPrice}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex mb-4">
        {['1m', '5m', '15m', '30m', '60m', '2h', '4h'].map((time, i) => (
          <div
            key={i}
            className={
              (i === 0
                ? 'ml-auto mr-1.5'
                : i === 6
                ? 'mr-auto ml-1.5'
                : 'mx-1.5') +
              (time === selectedTimeWindow ? ' bg-mineshaft' : ' bg-umbra') +
              ` text-center w-auto p-2 border-[1px] border-[#1E1E1E] rounded-md cursor-pointer group hover:bg-mineshaft hover:opacity-80`
            }
            onClick={() => setSelectedTimeWindow(time)}
          >
            <h6 className="text-xs font-normal">{time}</h6>
          </div>
        ))}
      </div>
      <div className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <div className="flex flex-row justify-between">
          <div>
            <h6 className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]">
              Leverage
            </h6>
          </div>
          <div className="ml-auto mr-0">
            <h6 className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]">
              {leverage}x
            </h6>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-2 pl-2 pr-3">
          <Slider
            aria-label="Leverage"
            defaultValue={20}
            step={1}
            min={1.1}
            max={110}
            valueLabelDisplay="auto"
            onChange={handleLeverageChange}
          />
        </div>
      </div>
      <div className="bg-umbra rounded-2xl">
        <div className="flex flex-col mb-4 p-4 w-full">
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Available Liquidity
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(
                  Number(
                    utils.formatUnits(
                      isShort
                        ? optionScalpData?.totalBaseAvailable ??
                            BigNumber.from(0)
                        : optionScalpData?.totalQuoteAvailable ??
                            BigNumber.from(0)
                              .mul(1e6)
                              .div(markPrice.isZero() ? 1 : markPrice),
                      isShort
                        ? optionScalpData?.baseDecimals!.toNumber()!
                        : optionScalpData?.quoteDecimals!.toNumber()!
                    )
                  ),
                  2
                )}{' '}
                {isShort
                  ? optionScalpData?.baseSymbol!
                  : optionScalpData?.quoteSymbol === 'USDC'
                  ? 'USDC.e'
                  : optionScalpData?.quoteSymbol!}
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Wallet Balance
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(
                  Number(
                    utils.formatUnits(
                      userTokenBalance,
                      optionScalpData?.quoteDecimals!.toNumber()!
                    )
                  ),
                  3
                )}{' '}
                {optionScalpData?.quoteSymbol === 'USDC'
                  ? 'USDC.e'
                  : optionScalpData?.quoteSymbol}
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Margin
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(positionDetails.marginInQuote, 3)}{' '}
                {optionScalpData?.quoteSymbol === 'USDC'
                  ? 'USDC.e'
                  : optionScalpData?.quoteSymbol}
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Premium
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(
                  Number(
                    utils.formatUnits(
                      premium,
                      optionScalpData?.quoteDecimals!.toNumber()!
                    )
                  ),
                  2
                )}{' '}
                {optionScalpData?.quoteSymbol === 'USDC'
                  ? 'USDC.e'
                  : optionScalpData?.quoteSymbol}
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">Fees</h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                <span className={orderType === 'Limit' ? 'text-green-500' : ''}>
                  {orderType === 'Limit'
                    ? 0
                    : optionScalpData?.feeOpenPosition
                    ? formatAmount(
                        Number(
                          utils.formatUnits(
                            posSize,
                            optionScalpData?.quoteDecimals!.toNumber()!
                          )
                        ) *
                          Number(
                            utils.formatUnits(
                              optionScalpData?.feeOpenPosition!,
                              10
                            )
                          ),
                        2
                      )
                    : 0}{' '}
                  {optionScalpData?.quoteSymbol === 'USDC'
                    ? 'USDC.e'
                    : optionScalpData?.quoteSymbol}
                </span>
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Liquidation Price
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(liquidationPrice, 4)}{' '}
              </h6>
            </div>
          </div>
          <div className={'flex mb-1'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Max. Slippage
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">0.5%</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </div>
      <div className="rounded-lg bg-neutral-800">
        <div className="p-3">
          <Button
            size="small"
            className="w-full !rounded-md"
            color={!tradeButtonProps.disabled ? 'primary' : 'mineshaft'}
            disabled={tradeButtonProps.disabled}
            onClick={approved ? handleTrade : handleApprove}
          >
            <p className="text-[0.8rem]">{tradeButtonProps.text}</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeCard;
