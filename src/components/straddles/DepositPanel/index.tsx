import React, { useContext, useState } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';

import { WalletContext } from 'contexts/Wallet';
import { StraddlesContext } from 'contexts/Straddles';

import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import RollIcon from 'svgs/icons/RollIcon';
import ArrowUpDownIcon from 'svgs/icons/ArrowsUpDownIcon';
import CalculatorIcon from 'svgs/icons/CalculatorIcon';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { SsovV3Context } from '../../../contexts/SsovV3';

const DepositPanel = () => {
  const { chainId } = useContext(WalletContext);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const { straddlesEpochData, straddlesData, straddlesUserData } =
    useContext(StraddlesContext);

  const [strikeDepositAmount, setStrikeDepositAmount] = useState<
    number | string
  >(0);

  return (
    <Box className="bg-umbra rounded-xl p-3 max-w-sm">
      <Box className="mb-4">
        <Typography variant="h6">Deposit</Typography>
      </Box>
      <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
        <Box className="flex">
          <Typography
            variant="h6"
            className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
          >
            Balance
          </Typography>
          <Typography
            variant="h6"
            className="text-white ml-auto mr-0 text-[0.72rem]"
          >
            {formatAmount(getUserReadableAmount(userTokenBalance, 18), 8)}{' '}
            {straddlesData?.underlying}
          </Typography>
        </Box>
        <Box className="mt-3">
          <Box className="flex mb-3 group">
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Amount
            </Typography>
            <Input
              disableUnderline={true}
              type="number"
              className="w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
              classes={{ input: 'text-white text-xs text-right' }}
              value={strikeDepositAmount}
              placeholder="0"
              onChange={() => {}}
            />
          </Box>
        </Box>
      </Box>
      <Box className="mt-4 flex justify-center">
        <Box className="py-2 w-full rounded-tl-lg border border-neutral-800">
          <Typography variant="h6" className="mx-2 text-neutral-400">
            -
          </Typography>
          <Typography variant="h6" className="mx-2 text-neutral-400">
            Deposit
          </Typography>
        </Box>
        <Box className="py-2 w-full rounded-tr-lg border border-neutral-800">
          <Typography variant="h6" className="mx-2 text-neutral-400">
            -
          </Typography>
          <Typography variant="h6" className="mx-2 text-neutral-400">
            Vault Share
          </Typography>
        </Box>
      </Box>
      <Box className="py-2 w-full flex items-center justify-between rounded-b-lg border border-t-0 border-neutral-800">
        <Box className="">
          <Typography variant="h6" className="mx-2 text-neutral-400">
            Next Epoch
            <HelpOutlineIcon className="h-4 mb-1" />
          </Typography>
          <Typography variant="h6" className="mx-2 mt-2 text-neutral-400">
            Withdrawable
            <HelpOutlineIcon className="h-4 mb-1" />
          </Typography>
        </Box>
        <Box className="">
          <Typography variant="h6" className="mx-2  text-white">
            24 Jun 2022
          </Typography>
          <Typography variant="h6" className="mx-2 mt-2 text-white">
            27 Jun 2022
          </Typography>
        </Box>
      </Box>
      <Box className="my-4 w-full rounded-lg border border-neutral-800">
        <Box className="flex justify-start items-center mx-2">
          <RollIcon className="w-4 h-4" />
          <Typography variant="h6" className="mx-2 py-2">
            Auto Rollover Configured
          </Typography>
        </Box>
        <Typography variant="h6" className="mx-2 pb-2 text-gray-400">
          This vault roll deposits over between epochs. This can be cancelled
          after depositing.
        </Typography>
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-neutral-600">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </Box>
          <Box className="bg-neutral-600 rounded-md flex items-center pr-2 pl-4 py-3 mb-3">
            <ArrowUpDownIcon className="" />
            <Typography variant="h6" className="mx-3">
              Get 2CRV
            </Typography>
            <OpenInNewIcon role="button" className="w-5 h-5 ml-auto" />
          </Box>
          <Box className="bg-neutral-600 rounded-md flex items-center pr-2 pl-3.5 py-3">
            <CalculatorIcon className="w-3 h-3" />
            <Typography variant="h6" className="mx-2 pl-1">
              Payout Calculator
            </Typography>
          </Box>
          <Box className="flex items-center mt-2">
            <LockOutlinedIcon className="w-5 h-5 text-gray-400" />
            <Box>
              <Typography variant="h6" className="text-gray-400 mx-2">
                Withdrawals are locked until end of Epoch 4
                <Typography
                  variant="h6"
                  className="text-white inline-flex items-baseline ml-2"
                >
                  20 December
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box
            role="button"
            className="bg-neutral-700 rounded-md flex justify-center items-center p-2 mt-2"
          >
            <Typography variant="h6" className="text-gray-400">
              Deposit
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositPanel;
