import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import { CircularProgress } from '@mui/material';

import { ERC20__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Wrapper from 'components/ssov/Wrapper';

import formatAmount from 'utils/general/formatAmount';

const DepositCard = () => {
  const {
    chainId,
    accountAddress,
    signer,
    contractAddresses,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
    selectedPoolName,
    provider,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [userQuoteBalance, setUserQuoteBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [userBaseBalance, setUserBaseBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [wrapEthOpen, setWrapEthOpen] = useState(false);

  const [isQuote, setisQuote] = useState(true);

  const userTokenBalance = useMemo(() => {
    return isQuote ? userQuoteBalance : userBaseBalance;
  }, [userQuoteBalance, userBaseBalance, isQuote]);

  const [isQuoteApproved, setIsQuoteApproved] = useState(false);
  const [isBaseApproved, setIsBaseApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  const approved = useMemo(() => {
    return isQuote ? isQuoteApproved : isBaseApproved;
  }, [isQuoteApproved, isBaseApproved, isQuote]);

  const [rawAmount, setRawAmount] = useState<string>('1');

  const [estimatedLpTokens, setEstimatedLpTokens] = useState<BigNumber>(
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

  const updateUserBalance = useCallback(async () => {
    if (!accountAddress || !provider) return;
    const balance = await ERC20__factory.connect(
      isQuote
        ? contractAddresses[optionScalpData!.quoteSymbol!]
        : contractAddresses[optionScalpData!.baseSymbol!],
      provider
    ).balanceOf(accountAddress);

    if (isQuote) {
      setUserQuoteBalance(balance);
    } else {
      setUserBaseBalance(balance);
    }
  }, [accountAddress, contractAddresses, isQuote, optionScalpData, provider]);

  useEffect(() => {
    updateUserBalance();
  }, [updateUserBalance]);

  const checkApproved = useCallback(async () => {
    if (!accountAddress || !signer || !optionScalpData) return;

    const quote = ERC20__factory.connect(
      contractAddresses[optionScalpData!.quoteSymbol!],
      signer
    );
    const base = ERC20__factory.connect(
      contractAddresses[optionScalpData!.baseSymbol!],
      signer
    );

    const [quoteAllowance, baseAllowance] = await Promise.all([
      quote.allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      ),
      base.allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      ),
    ]);

    const depositAmount = utils.parseUnits(
      rawAmount,
      isQuote
        ? optionScalpData?.quoteDecimals!.toNumber()
        : optionScalpData?.baseDecimals!.toNumber()
    );

    if (isQuote) {
      setIsQuoteApproved(quoteAllowance.gte(depositAmount));
    } else {
      setIsBaseApproved(baseAllowance.gte(depositAmount));
    }
  }, [
    accountAddress,
    contractAddresses,
    isQuote,
    optionScalpData,
    signer,
    rawAmount,
  ]);

  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (amount == 0) return 'Insert an amount';
    else if (amount > readableUserTokenBalance) return 'Insufficient balance';
    return 'Deposit';
  }, [approved, amount, readableUserTokenBalance]);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    if (!optionScalpData?.optionScalpContract || !signer || !contractAddresses)
      return;

    const quote = ERC20__factory.connect(
      contractAddresses[optionScalpData!.quoteSymbol!],
      signer
    );
    const base = ERC20__factory.connect(
      contractAddresses[optionScalpData!.baseSymbol!],
      signer
    );

    try {
      await sendTx(isQuote ? quote : base, 'approve', [
        optionScalpData?.optionScalpContract?.address,
        utils.parseUnits(
          rawAmount,
          isQuote
            ? optionScalpData?.quoteDecimals!.toNumber()
            : optionScalpData?.baseDecimals!.toNumber()
        ),
      ])
        .then(async () => await checkApproved())
        .then(() => setLoading(false));
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [
    sendTx,
    signer,
    optionScalpData,
    contractAddresses,
    isQuote,
    checkApproved,
    rawAmount,
  ]);

  // Handle deposit
  const handleDeposit = useCallback(async () => {
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
        'deposit',
        [
          accountAddress,
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

  const calcLpAmount = useCallback(async () => {
    if (!optionScalpData) return;

    try {
      const estimatedOutput = await optionScalpData!.optionScalpContract
        .connect(signer)
        .callStatic.deposit(
          isQuote,
          utils.parseUnits(
            String(amount),
            isQuote
              ? optionScalpData?.quoteDecimals!.toNumber()!
              : optionScalpData?.baseDecimals!.toNumber()!
          )
        );
      setEstimatedLpTokens(estimatedOutput);
    } catch (e) {}
  }, [optionScalpData, signer, isQuote, amount]);

  // Update LP tokens
  useEffect(() => {
    calcLpAmount();
  }, [calcLpAmount]);

  // Updates approved state and user balance
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  const _resolveSymbol = (token: any) => {
    if (token === 'ETH') {
      return 'W' + token;
    } else {
      return token;
    }
  };

  return (
    <div className="h-full flex flex-col pt-2">
      {selectedPoolName === 'ETH' && !isQuote && (
        <Wrapper open={wrapEthOpen} handleClose={() => setWrapEthOpen(false)} />
      )}
      <div className="bg-umbra rounded-xl flex flex-col mb-1 mx-2 p-3 pr-2">
        {selectedPoolName === 'ETH' && !isQuote && (
          <div
            role="button"
            className="ml-auto mt-1 text-xs pr-3"
            onClick={() => setWrapEthOpen(true)}
          >
            <span className="text-stieglitz underline">Wrap ETH</span>
          </div>
        )}
        <div className="flex flex-row justify-between">
          <div className="bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center border border-cod-gray">
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
            onChange={(e: {
              target: { value: React.SetStateAction<string | number> };
            }) => setRawAmount(String(e.target.value))}
          />
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div>
            <h6 className="text-stieglitz text-sm pl-1 pr-3 text-[0.8rem]">
              Token to deposit
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
                : _resolveSymbol(optionScalpData?.baseSymbol!)}
            </h6>
          </div>
        </div>
      </div>
      {estimatedLpTokens.gt(0) ? (
        <div className="bg-umbra rounded-2xl">
          <div className="flex flex-col mb-4 p-4 w-full">
            <div className={'flex mb-0.5'}>
              <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
                Estimated LP tokens
              </h6>
              <div className={'text-right'}>
                <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                  {formatAmount(
                    Number(
                      utils.formatUnits(
                        estimatedLpTokens,
                        isQuote
                          ? optionScalpData?.quoteDecimals!.toNumber()!
                          : optionScalpData?.baseDecimals!.toNumber()!
                      )
                    ),
                    2
                  )}{' '}
                  {isQuote
                    ? optionScalpData?.quoteSymbol!
                    : optionScalpData?.baseSymbol!}{' '}
                  LP
                </h6>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div>
        <p className="text-justify h-full p-2 px-3 m-1 text-sm font-light mb-1.5">
          After depositing you will receive ERC4626 tokens representing your
          share in this pool. On withdrawal of deposited funds the same ERC4626
          tokens will be burnt in exchange for the deposited funds along with
          earnings.
        </p>
        <p className="text-justify h-full p-2 px-3 m-1 text-sm font-light mb-1.5">
          Deposits are locked for an hour from the time of deposit after which
          they can be withdrawn.
        </p>
      </div>
      <div className="rounded-lg bg-neutral-800 mx-2">
        <div className="p-3">
          <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
            <EstimatedGasCostButton gas={500000} chainId={chainId} />
          </div>
          <Button
            size="small"
            className="w-full"
            color={
              !approved || (amount > 0 && amount <= readableUserTokenBalance)
                ? 'primary'
                : 'mineshaft'
            }
            disabled={amount <= 0}
            onClick={approved ? handleDeposit : handleApprove}
          >
            <p className="text-[0.8rem]">
              {loading ? (
                <CircularProgress className="text-white" size="1rem" />
              ) : (
                depositButtonMessage
              )}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepositCard;
