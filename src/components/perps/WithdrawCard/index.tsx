import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import cx from 'classnames';
import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import useSendTx from 'hooks/useSendTx';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

const WithdrawCard = () => {
  const { chainId, accountAddress, signer, contractAddresses, optionPerpData, updateOptionPerp, updateOptionPerpUserData, updateOptionPerpEpochData } =
    useBoundStore();

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

  const [rawAmount, setRawAmount] = useState<string>('1000');

  const [estimatedOut, setEstimatedOut] = useState<string>('0');

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const withdrawButtonMessage: string = useMemo(() => {
    if (amount == 0) return 'Insert an amount';
    else if (amount > getUserReadableAmount(userTokenBalance, 6))
      return 'Insufficient balance';
    return 'Withdraw';
  }, [amount, userTokenBalance]);
  
  // Handle deposit
  const handleWithdraw = useCallback(async () => {
    if (
      !optionPerpData?.optionPerpContract ||
      !accountAddress ||
      !signer ||
      !updateOptionPerpEpochData ||
      !updateOptionPerp || 
      !updateOptionPerpUserData
    )
      return;
    
    try {
      await sendTx(optionPerpData.optionPerpContract.connect(signer), 'withdraw', [
        isQuote,
        getContractReadableAmount(amount, isQuote ? 6 : 18),
        estimatedOut
      ]);
      await updateOptionPerp();
      await updateOptionPerpEpochData();
      await updateOptionPerpUserData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    optionPerpData,
    signer,
    amount,
    updateOptionPerp,
    updateOptionPerpUserData,
    updateOptionPerpEpochData,
    sendTx,
    isQuote,
    estimatedOut  
  ]);
  
  const calcTokenAmount = useCallback(async () => {
    if (!optionPerpData) return;
    
    try {
      const estimatedOutput = await optionPerpData.optionPerpContract.callStatic.withdraw(isQuote, getContractReadableAmount(amount, isQuote ? 6 : 18), 0);
      setEstimatedOut(estimatedOutput);
    } catch (e) {}
  }, [optionPerpData, isQuote, amount, optionPerpData]);

  useEffect(() => {
    calcTokenAmount();
  }, [calcTokenAmount]);
  
  // Updates user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !optionPerpData?.optionPerpContract)
        return;

      const quote = ERC20__factory.connect(optionPerpData.quoteLpPositionMinter, signer);
      const base = ERC20__factory.connect(optionPerpData.baseLpPositionMinter, signer);
      const balance: BigNumber = await (isQuote ? quote : base).balanceOf(accountAddress);
      if (isQuote) {
        setUserQuoteBalance(balance);
      } else {
        setUserBaseBalance(balance);
      }
    })();
  }, [
    contractAddresses,
    accountAddress,
    signer,
    chainId,
    optionPerpData
  ]);

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx("font-medium mt-1 cursor-pointer hover:opacity-50", isQuote ? "text-white" : "text-stieglitz")}
                onClick={() => setisQuote(true)}
              >
                USDC
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx("font-medium mt-1 cursor-pointer hover:opacity-50", !isQuote ? "text-white" : "text-stieglitz")}
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
              Token to withdraw
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
              {isQuote ? 'USDC' : 'WETH'} LP
            </Typography>
          </Box>
        </Box>
      </Box>
      {estimatedOut !== '0' ? <Box className="bg-umbra rounded-2xl">
          <Box className="flex flex-col mb-4 p-4 w-full">
          <Box className={'flex mb-0.5'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Estimated out
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(estimatedOut, isQuote ? 6 : 18), 2)} {isQuote ? 'USDC' : 'ETH'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box> : null}
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </Box>
          <CustomButton
            size="medium"
            className="w-full !rounded-md"
            color={
              (amount > 0 &&
                amount <= getUserReadableAmount(userTokenBalance, 6))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={amount <= 0}
            onClick={handleWithdraw}
          >
            {withdrawButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default WithdrawCard;
