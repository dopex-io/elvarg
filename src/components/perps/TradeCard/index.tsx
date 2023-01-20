import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import cx from 'classnames';
import { format } from 'date-fns';
import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';

import useSendTx from 'hooks/useSendTx';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import RollIcon from 'svgs/icons/RollIcon';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { MAX_VALUE } from 'constants/index';

const THREE_DAYS = 3 * 24 * 3600;

const TradeCard = () => {
  const { chainId, accountAddress, signer, contractAddresses, optionPerpData, updateOptionPerp, updateOptionPerpUserData, updateOptionPerpEpochData } =
    useBoundStore();

  const sendTx = useSendTx();

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  
  const [isShort, setIsShort] = useState(false);

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1000');
  
  const [leverage, setLeverage] = useState<number>(20);

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);
  
  
  const handleLeverageChange = (event: any) => {
    setLeverage(event.target.value);
  };

  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (amount == 0) return 'Insert an amount';
    else if (amount > getUserReadableAmount(userTokenBalance, 6))
      return 'Insufficient balance';
    return 'Deposit';
  }, [approved, amount, userTokenBalance]);
  
  const collateralAmount : number = useMemo(() => {
    return amount / leverage;
  }, [amount, leverage]);

  const liquidationPrice : number = useMemo(() => {
    const price = getUserReadableAmount(optionPerpData?.markPrice!, 8);
    const positions = amount / price;
    
    if (isShort) {
      return (collateralAmount / positions) + price
    } else {
      return (collateralAmount / positions) - price;
    }
  }, [isShort, amount, collateralAmount, optionPerpData]);
  
  const handleApprove = useCallback(async () => {
    if (!optionPerpData?.optionPerpContract || !signer || !contractAddresses)
      return;
    
    try {
      await sendTx(
        ERC20__factory.connect(contractAddresses['USDC'], signer),
        'approve',
        [optionPerpData?.optionPerpContract?.address, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, optionPerpData, contractAddresses]);
  
  // Handle trade
  const handleTrade = useCallback(async () => {
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
      await sendTx(optionPerpData.optionPerpContract.connect(signer), 'openPosition', [
        isShort,
        getContractReadableAmount(amount, 8),
        getContractReadableAmount(amount, 6)  
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
    sendTx
  ]);
  
  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !optionPerpData?.optionPerpContract)
        return;

      const finalAmount: BigNumber = getContractReadableAmount(amount, 6);
      const token = ERC20__factory.connect(contractAddresses['USDC'], signer);
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        optionPerpData?.optionPerpContract?.address
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    amount,
    signer,
    chainId,
    optionPerpData,
  ]);

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx("font-medium mt-1 cursor-pointer hover:opacity-50", !isShort ? "text-[#00FA9A]" : "text-stieglitz")}
                onClick={() => setIsShort(false)}
              >
                Long
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx("font-medium mt-1 cursor-pointer hover:opacity-50", isShort ? "text-[#FF0000]" : "text-stieglitz")}
                onClick={() => setIsShort(true)}
              >
                Short
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
          <Typography
            variant="h6"
            className="text-stieglitz font-medium mt-3 mr-3 ml-1"
          >
            $
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
              Notional ~{' '}
              {formatAmount(
                amount / getUserReadableAmount(optionPerpData?.markPrice!, 8),
                8
              )}{' '}
              ETH
            </Typography>
          </Box>
        </Box>
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
              Max. Leverage {leverage}x
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between mt-2 pl-2 pr-3">
          <Slider
            aria-label="Leverage"
            defaultValue={20}
            step={1}
            min={1}
            max={20}
            valueLabelDisplay="auto"
            onChange={handleLeverageChange}
          />
        </Box>
      </Box>
      <Box className="bg-umbra rounded-2xl">
          <Box className="flex flex-col mb-4 p-4 w-full">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(amount * getUserReadableAmount(optionPerpData?.feeOpenPosition!, 10), 2)} USDC
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Collateral required
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(collateralAmount, 2)} USDC
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-1'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Liquidation Price
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(liquidationPrice, 2)} USDC
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
              (amount > 0 &&
                amount <= getUserReadableAmount(userTokenBalance, 6))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={amount <= 0}
            onClick={approved ? handleTrade : handleApprove}
          >
            {depositButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeCard;
