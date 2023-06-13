import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

const WithdrawCard = () => {
  const {
    chainId,
    accountAddress,
    signer,
    contractAddresses,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
    optionScalpUserData,
    provider,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [approved, setApproved] = useState(false);

  const [userQuoteBalance, setUserQuoteBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [userBaseBalance, setUserBaseBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [isQuote, setisQuote] = useState(true);

  const userTokenBalance = useMemo(() => {
    return isQuote ? userQuoteBalance : userBaseBalance;
  }, [userQuoteBalance, userBaseBalance, isQuote]);

  const [rawAmount, setRawAmount] = useState<string>('0');

  const [estimatedOut, setEstimatedOut] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const readableUserTokenBalance = useMemo(() => {
    return Number(
      utils.formatUnits(
        userTokenBalance,
        isQuote
          ? optionScalpData?.quoteDecimals!.toNumber()!
          : optionScalpData?.baseDecimals!.toNumber()!
      )
    );
  }, [optionScalpData, userTokenBalance, isQuote]);

  const handleSetMax = useCallback(() => {
    setRawAmount(
      String(Math.floor(readableUserTokenBalance * 100000) / 100000)
    ); // 5 decimals
  }, [readableUserTokenBalance]);

  const withdrawButtonProps = useMemo(() => {
    let disabled = false;
    let text: any = 'Withdraw';
    let coolDown = 0;
    const date = Math.floor(new Date().getTime() / 1000);

    if (!approved) {
      text = 'Approve';
    }

    if (amount === 0) {
      text = 'Insert an amount';
      disabled = true;
    }

    if (amount > readableUserTokenBalance) {
      text = 'Amount exceeds balance';
      disabled = true;
    }

    if (isQuote && (optionScalpUserData?.coolingPeriod?.quote ?? 0) > date) {
      coolDown = optionScalpUserData?.coolingPeriod?.quote ?? 0;
      disabled = true;
    }

    if (!isQuote && (optionScalpUserData?.coolingPeriod?.base ?? 0) > date) {
      coolDown = optionScalpUserData?.coolingPeriod?.base ?? 0;
      disabled = true;
    }

    return {
      disabled,
      text,
      coolDown,
    };
  }, [
    amount,
    approved,
    isQuote,
    optionScalpUserData?.coolingPeriod?.quote,
    readableUserTokenBalance,
    optionScalpUserData?.coolingPeriod?.base,
  ]);

  const handleApprove = useCallback(async () => {
    if (!optionScalpData?.optionScalpContract || !signer || !contractAddresses)
      return;

    try {
      await sendTx(
        (isQuote
          ? optionScalpData?.quoteLpContract
          : optionScalpData?.baseLpContract
        ).connect(signer),
        'approve',
        [optionScalpData?.optionScalpContract?.address, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, optionScalpData, contractAddresses, isQuote]);

  // Handle deposit
  const handleWithdraw = useCallback(async () => {
    if (
      !optionScalpData?.optionScalpContract ||
      !accountAddress ||
      !signer ||
      !updateOptionScalp ||
      !updateOptionScalpUserData
    )
      return;

    try {
      await sendTx(
        optionScalpData!.optionScalpContract.connect(signer),
        'withdraw',
        [
          isQuote,
          utils.parseUnits(
            String(amount),
            isQuote
              ? optionScalpData?.quoteDecimals!.toNumber()!
              : optionScalpData?.baseDecimals!.toNumber()!
          ),
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
    amount,
    updateOptionScalp,
    updateOptionScalpUserData,
    sendTx,
    isQuote,
  ]);

  const calcTokenAmount = useCallback(async () => {
    if (!optionScalpData) return;

    try {
      const estimatedOutput =
        await optionScalpData!.optionScalpContract.callStatic.withdraw(
          isQuote,
          utils.parseUnits(
            String(amount),
            isQuote
              ? optionScalpData?.quoteDecimals!.toNumber()!
              : optionScalpData?.baseDecimals!.toNumber()!
          )
        );
      setEstimatedOut(estimatedOutput);
    } catch (e) {}
  }, [isQuote, amount, optionScalpData]);

  useEffect(() => {
    calcTokenAmount();
  }, [calcTokenAmount]);

  // Updates user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !provider || !optionScalpData?.optionScalpContract)
        return;

      const quote = ERC20__factory.connect(
        optionScalpData!.quoteLpContract.address,
        provider
      );
      const base = ERC20__factory.connect(
        optionScalpData!.baseLpContract.address,
        provider
      );
      const balance: BigNumber = await (isQuote ? quote : base).balanceOf(
        accountAddress
      );

      if (isQuote) {
        setUserQuoteBalance(balance);
      } else {
        setUserBaseBalance(balance);
      }

      const allowance: BigNumber = await (isQuote
        ? optionScalpData?.quoteLpContract
        : optionScalpData?.baseLpContract
      ).allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      );
      setApproved(allowance.gte(balance));
    })();
  }, [
    contractAddresses,
    accountAddress,
    provider,
    chainId,
    optionScalpData,
    isQuote,
  ]);

  return (
    <div className="pt-2">
      <div className="bg-umbra rounded-xl flex flex-col mb-4 p-3 pr-2 mx-2">
        <div className="flex flex-row justify-between">
          <div className="bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <div className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                {optionScalpData?.quoteSymbol!}
              </h6>
            </div>
            <div className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                {optionScalpData?.baseSymbol!}
              </h6>
            </div>
          </div>
          <Input
            color="cod-gray"
            variant="small"
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            value={rawAmount}
            handleChange={(e: {
              target: { value: React.SetStateAction<string | number> };
            }) => setRawAmount(String(e.target.value))}
          />
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div>
            <h6 className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]">
              Token to withdraw
            </h6>
          </div>
          <div className="ml-auto mr-0">
            <h6
              role="button"
              className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem] underline"
              onClick={handleSetMax}
            >
              {formatAmount(readableUserTokenBalance, 8)}{' '}
              {isQuote
                ? optionScalpData?.quoteSymbol!
                : optionScalpData?.baseSymbol!}{' '}
              LP
            </h6>
          </div>
        </div>
      </div>
      <div className="bg-umbra rounded-2xl mx-2">
        <div className="flex flex-col mb-1 p-4 pb-0 w-full">
          <div className={'flex'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Available
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(
                  Number(
                    utils.formatUnits(
                      isQuote
                        ? optionScalpData?.totalQuoteAvailable!
                        : optionScalpData?.totalBaseAvailable!,
                      isQuote
                        ? optionScalpData?.quoteDecimals!.toNumber()!
                        : optionScalpData?.baseDecimals!.toNumber()!
                    )
                  ),
                  2
                )}{' '}
                {isQuote
                  ? optionScalpData?.quoteSymbol!
                  : optionScalpData?.baseSymbol!}
              </h6>
            </div>
          </div>
        </div>
        <div className="flex flex-col mb-4 p-4 w-full">
          <div className={'flex'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              1{' '}
              {isQuote
                ? optionScalpData?.quoteSymbol!
                : optionScalpData?.baseSymbol!}{' '}
              LP
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                {formatAmount(
                  Number(
                    utils.formatUnits(
                      isQuote
                        ? optionScalpData?.quoteLpValue!
                        : optionScalpData?.baseLpValue!,
                      isQuote
                        ? optionScalpData?.quoteDecimals!.toNumber()!
                        : optionScalpData?.baseDecimals!.toNumber()!
                    )
                  ),
                  9
                )}{' '}
                {isQuote
                  ? optionScalpData?.quoteSymbol!
                  : optionScalpData?.baseSymbol!}
              </h6>
            </div>
          </div>
        </div>
      </div>
      {estimatedOut.gt(0) ? (
        <div className="bg-umbra rounded-2xl">
          <div className="flex flex-col mb-4 p-4 w-full">
            <div className={'flex mb-0.5'}>
              <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
                Estimated out
              </h6>
              <div className={'text-right'}>
                <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                  {formatAmount(
                    Number(
                      utils.formatUnits(
                        estimatedOut,
                        isQuote
                          ? optionScalpData?.quoteDecimals!.toNumber()!
                          : optionScalpData?.baseDecimals!.toNumber()!
                      )
                    ),
                    2
                  )}{' '}
                  {isQuote
                    ? optionScalpData?.quoteSymbol!
                    : optionScalpData?.baseSymbol!}
                </h6>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="rounded-lg bg-neutral-800 mx-2">
        <div className="p-3">
          <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
            <EstimatedGasCostButton gas={500000} chainId={chainId} />
          </div>
          <Button
            size="small"
            className="w-full !rounded-md"
            color={!withdrawButtonProps.disabled ? 'primary' : 'mineshaft'}
            disabled={withdrawButtonProps.disabled}
            onClick={approved ? handleWithdraw : handleApprove}
          >
            <span className="text-[0.8rem]">
              {withdrawButtonProps.coolDown > 0 ? (
                <Countdown
                  date={new Date(withdrawButtonProps.coolDown * 1000)}
                  renderer={({ minutes, seconds }) => {
                    return (
                      <h6 className="text-stieglitz mr-1">
                        Withdrawal locked for {minutes}m {seconds}s
                      </h6>
                    );
                  }}
                />
              ) : (
                withdrawButtonProps.text
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawCard;
