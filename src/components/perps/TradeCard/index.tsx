import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import { format } from 'date-fns';
import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Input from '@mui/material/Input';

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
  const { chainId, accountAddress, signer, contractAddresses, optionPerpData } =
    useBoundStore();

  const sendTx = useSendTx();

  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1000');

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

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className="text-[#00FA9A] font-medium mt-1"
              >
                Long
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className="text-stieglitz font-medium mt-1"
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
              Max. Leverage 20x
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
            onClick={null}
          >
            {depositButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeCard;
