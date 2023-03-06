import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE } from 'constants/index';

const DepositCard = () => {
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

  const [isQuoteApproved, setIsQuoteApproved] = useState(false);
  const [isBaseApproved, setIsBaseApproved] = useState(false);

  const approved = useMemo(() => {
    return isQuote ? isQuoteApproved : isBaseApproved;
  }, [isQuoteApproved, isBaseApproved, isQuote]);

  const [rawAmount, setRawAmount] = useState<string>('1000');

  const [estimatedLpTokens, setEstimatedLpTokens] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (amount == 0) return 'Insert an amount';
    else if (amount > getUserReadableAmount(userTokenBalance, 6))
      return 'Insufficient balance';
    return 'Deposit';
  }, [approved, amount, userTokenBalance]);

  const handleApprove = useCallback(async () => {
    if (!optionScalpData?.optionScalpContract || !signer || !contractAddresses)
      return;

    const quote = ERC20__factory.connect(contractAddresses['USDC'], signer);
    const base = ERC20__factory.connect(contractAddresses['WETH'], signer);

    try {
      await sendTx(isQuote ? quote : base, 'approve', [
        optionScalpData?.optionScalpContract?.address,
        MAX_VALUE,
      ]);

      if (isQuote) setIsQuoteApproved(true);
      else setIsBaseApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, optionScalpData, contractAddresses, isQuote]);

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
        optionScalpData.optionScalpContract.connect(signer),
        'deposit',
        [isQuote, getContractReadableAmount(amount, isQuote ? 6 : 18)]
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
      const estimatedOutput = await optionScalpData.optionScalpContract
        .connect(signer)
        .callStatic.deposit(
          isQuote,
          getContractReadableAmount(amount, isQuote ? 6 : 18)
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
    (async () => {
      if (!accountAddress || !signer || !optionScalpData?.optionScalpContract)
        return;

      const quote = ERC20__factory.connect(contractAddresses['USDC'], signer);
      const base = ERC20__factory.connect(contractAddresses['WETH'], signer);
      const quoteAllowance: BigNumber = await quote.allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      );
      const baseAllowance: BigNumber = await base.allowance(
        accountAddress,
        optionScalpData?.optionScalpContract?.address
      );
      const balance: BigNumber = await (isQuote ? quote : base).balanceOf(
        accountAddress
      );
      if (isQuote) {
        setIsQuoteApproved(quoteAllowance.gte(balance));
        setUserQuoteBalance(balance);
      } else {
        setIsBaseApproved(baseAllowance.gte(balance));
        setUserBaseBalance(balance);
      }
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    signer,
    chainId,
    optionScalpData,
    isQuote,
  ]);

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer hover:opacity-50',
                  isQuote ? 'text-white' : 'text-stieglitz'
                )}
                onClick={() => setisQuote(true)}
              >
                USDC
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer hover:opacity-50',
                  !isQuote ? 'text-white' : 'text-stieglitz'
                )}
                onClick={() => setisQuote(false)}
              >
                WETH
              </Typography>
            </Box>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white font-mono"
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="flex flex-row justify-between mt-2">
          <Box>
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3"
            >
              Token to deposit
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pr-3"
            >
              Balance ~{' '}
              {formatAmount(
                getUserReadableAmount(userTokenBalance, isQuote ? 6 : 18),
                isQuote ? 0 : 3
              )}{' '}
              {isQuote ? 'USDC' : 'WETH'}
            </Typography>
          </Box>
        </Box>
      </Box>
      {estimatedLpTokens.gt(0) ? (
        <Box className="bg-umbra rounded-2xl">
          <Box className="flex flex-col mb-4 p-4 w-full">
            <Box className={'flex mb-0.5'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Estimated LP tokens
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {formatAmount(
                    getUserReadableAmount(estimatedLpTokens, isQuote ? 6 : 18),
                    2
                  )}{' '}
                  {isQuote ? 'USDC' : 'ETH'} LP
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
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
              (amount > 0 &&
                amount <= getUserReadableAmount(userTokenBalance, 6))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={amount <= 0}
            onClick={approved ? handleDeposit : handleApprove}
          >
            {depositButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositCard;
