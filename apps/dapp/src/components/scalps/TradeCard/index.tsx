import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
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
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('30m');

  const [premium, setPremium] = useState<BigNumber>(BigNumber.from(0));

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1000');

  const [leverage, setLeverage] = useState<number>(20);

  const [isShort, setIsShort] = useState<boolean>(false);

  const isShortAfterAdjustments = useMemo(() => {
    if (optionScalpData?.inverted) return !isShort;
    return isShort;
  }, [isShort, optionScalpData]);

  const margin: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const handleLeverageChange = (event: any) => {
    setLeverage(event.target.value);
  };

  const posSize = useMemo(() => {
    if (!optionScalpData) return BigNumber.from('0');

    const minAbsThreshold = getUserReadableAmount(
      optionScalpData?.minimumAbsoluteLiquidationThreshold!,
      optionScalpData?.quoteDecimals!.toNumber()
    );

    const positions =
      (margin * leverage) /
      getUserReadableAmount(
        optionScalpData?.markPrice,
        optionScalpData?.quoteDecimals!.toNumber()
      );

    return getContractReadableAmount(
      (margin * leverage - minAbsThreshold * positions).toFixed(6),
      optionScalpData?.quoteDecimals!.toNumber()!
    );
  }, [margin, leverage, optionScalpData]);

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

  const tradeButtonMessage: string = useMemo(() => {
    if (!optionScalpData) return '';

    const _margin = getContractReadableAmount(
      margin,
      optionScalpData.quoteDecimals!.toNumber()
    );

    if (!approved) return 'Approve';
    else if (margin == 0) return 'Insert an amount';
    else if (_margin.lt(MINIMUM_MARGIN))
      return (
        'Minium Margin ' +
        getUserReadableAmount(
          MINIMUM_MARGIN,
          optionScalpData?.quoteDecimals!.toNumber()!
        )
      );
    else if (_margin.gt(userTokenBalance)) return 'Insufficient balance';
    return 'Open position';
  }, [approved, margin, userTokenBalance, margin, optionScalpData]);

  const liquidationPrice: number = useMemo(() => {
    let _liquidationPrice = 0;
    const price = getUserReadableAmount(
      optionScalpData?.markPrice!,
      optionScalpData?.quoteDecimals!.toNumber()!
    );
    const positions =
      getUserReadableAmount(
        posSize,
        optionScalpData?.quoteDecimals!.toNumber()!
      ) / price;
    if (positions || margin) {
      const minAbsThreshold = getUserReadableAmount(
        optionScalpData?.minimumAbsoluteLiquidationThreshold!,
        optionScalpData?.quoteDecimals!.toNumber()
      );
      if (isShortAfterAdjustments) {
        _liquidationPrice = margin / positions + minAbsThreshold + price;
      } else {
        _liquidationPrice = price - margin / positions - minAbsThreshold;
      }
    }

    if (optionScalpData?.inverted) return 1 / _liquidationPrice;

    return _liquidationPrice;
  }, [isShortAfterAdjustments, margin, posSize, optionScalpData]);

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
            margin,
            optionScalpData?.quoteDecimals!.toNumber()
          ),
          entryLimit,
        ]
      );
      await updateOptionScalp();
      await updateOptionScalpUserData();
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
    margin,
    isShortAfterAdjustments,
  ]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !optionScalpData?.optionScalpContract)
        return;

      const finalAmount: BigNumber = getContractReadableAmount(
        margin,
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
    margin,
    signer,
    chainId,
    optionScalpData,
  ]);

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <p
                className={cx(
                  'font-medium mt-1 cursor-pointer hover:opacity-50',
                  !isShort ? 'text-green-300' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(false)}
              >
                Long
              </p>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <p
                className={cx(
                  'font-medium mt-1 cursor-pointer hover:opacity-50',
                  isShort ? 'text-red-400' : 'text-stieglitz'
                )}
                onClick={() => setIsShort(true)}
              >
                Short
              </p>
            </Box>
          </Box>
          <Input
            disableUnderline
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white font-mono"
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
          <Typography
            variant="h6"
            className="text-stieglitz font-medium mt-3 mr-3 ml-1"
          >
            {optionScalpData?.quoteSymbol}
          </Typography>
        </Box>
        <Box className="flex flex-row justify-between mt-2">
          <Box>
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3"
            >
              Leverage {leverage}x
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3"
            >
              Balance ~{' '}
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
              className="text-stieglitz text-sm pl-1 pr-3"
            >
              Leverage
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3"
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
            min={1}
            max={110}
            valueLabelDisplay="auto"
            onChange={handleLeverageChange}
          />
        </Box>
      </Box>
      <Box className="bg-umbra rounded-2xl">
        <Box className="flex flex-col mb-4 p-4 w-full">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Pos. Size
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {getUserReadableAmount(
                  posSize,
                  optionScalpData?.quoteDecimals!.toNumber()
                )}{' '}
                {optionScalpData?.quoteSymbol}
              </Typography>
            </Box>
          </Box>
          {premium.gt(0) ? (
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Premium
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
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
          ) : null}
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
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
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Liquidation Price
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(liquidationPrice, 6)}{' '}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-1'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Max. Slippage
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                0.5%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </Box>
          <CustomButton
            size="medium"
            className="w-full !rounded-md"
            color={
              !approved ||
              getUserReadableAmount(
                userTokenBalance,
                optionScalpData?.quoteDecimals!.toNumber()
              ) > margin
                ? 'primary'
                : 'mineshaft'
            }
            disabled={
              !approved ||
              getUserReadableAmount(
                userTokenBalance,
                optionScalpData?.quoteDecimals!.toNumber()
              ) > margin
                ? false
                : true
            }
            onClick={approved ? handleTrade : handleApprove}
          >
            {tradeButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeCard;
