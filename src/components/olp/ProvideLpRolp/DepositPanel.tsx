import React, { useCallback } from 'react';
import { MouseEventHandler } from 'react';
import { Box, Input, Select, MenuItem } from '@mui/material';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import format from 'date-fns/format';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import formatAmount from 'utils/general/formatAmount';
import {
  DATE_FORMAT,
  DEFAULT_TOKEN_DECIMALS,
  DEFAULT_USD_DECIMALS,
} from 'constants/index';
import InfoBox from '../_common/InfoBox';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

export default function DepositPanel(props: any) {
  // Display deposit word
  function depositWord() {
    return (
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Provide LP
        </Typography>
      </Box>
    );
  }

  function isPutBox(selectedPut: boolean, handleIsPut: Function) {
    return (
      <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
        <Box
          className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
            !selectedPut ? 'bg-[#2D2D2D]' : ''
          }`}
          onClick={() => handleIsPut(false)}
        >
          <Typography variant="h6" className="text-xs font-normal">
            Call
          </Typography>
        </Box>
        <Box
          className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
            selectedPut ? 'bg-[#2D2D2D]' : ''
          }`}
          onClick={() => handleIsPut(true)}
        >
          <Typography variant="h6" className="text-xs font-normal">
            Put
          </Typography>
        </Box>
      </Box>
    );
  }

  // Display dropdown of strikes
  function strikeMenuBox(
    strikeIdx: number,
    handleSelectStrike: any,
    strikes: string[]
  ) {
    return (
      <Box className="mt-2 flex">
        <Box className={'w-full'}>
          <Select
            className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
            fullWidth
            value={strikeIdx}
            onChange={handleSelectStrike}
            input={<Input />}
            variant="outlined"
            placeholder="Select Strike Prices"
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-7 text-white',
              select: 'overflow-hidden',
            }}
            disableUnderline
            label="strikes"
          >
            {strikes.map((strike: string, index: number) => (
              <MenuItem key={index} value={index} className="pb-2 pt-2">
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  ${formatAmount(strike, 4)}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    );
  }

  // Display discount, amount, balance
  function discountDepositBalanceBox(
    rawMarkupAmount: string,
    setRawMarkupAmount: Function,
    rawDepositAmount: string,
    setRawDepositAmount: Function,
    userTokenBalance: BigNumber,
    selectedPoolName: string,
    strikeTokenName: string,
    selectedStrikeTokenPrice: BigNumber
  ) {
    const symbol = selectedPoolName.toLowerCase();
    return (
      <Box>
        <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
          <Box className="flex">
            <InfoBox
              heading={'Markup'}
              tooltip={
                'A 10% markup means you are willing to sell the option token at 110% of its option premium during purchase'
              }
            />
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawMarkupAmount}
            onChange={(e) => setRawMarkupAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              %
            </Typography>
          </Box>
        </Box>
        <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 mb-2">
          <Typography variant="h6" className="text-sm pl-1 pt-2">
            <span className="text-stieglitz">
              Markup must be a whole number between 0% and 100%
            </span>
          </Typography>
        </Box>
        <Box className="flex flex-row h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 items-center">
          <Box className="flex flex-row h-10 p-1 w-full">
            <img src={`/images/tokens/${symbol}.svg`} alt={`${symbol}`} />
            <Typography
              variant="h6"
              className="text-stieglitz text-xs pl-1 ml-1.5 pt-1.5"
            >
              {strikeTokenName}
            </Typography>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawDepositAmount}
            onChange={(e) => setRawDepositAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">Balance</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(userTokenBalance, DEFAULT_TOKEN_DECIMALS),
                2
              )}{' '}
              tokens
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">Premium per option</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(
                  selectedStrikeTokenPrice,
                  DEFAULT_TOKEN_DECIMALS
                ),
                2
              )}{' '}
              {selectedPoolName}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Display epoch and withdrawable info
  function epochDisplayBox(expiry: BigNumber) {
    return (
      <Box className="mt-3.5">
        <Box className="rounded-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
          <Box className={'flex mb-1'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Withdrawable
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {expiry
                  ? format(new Date(expiry.toNumber() * 1000), DATE_FORMAT)
                  : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Display gas cost estimate
  function gasCostBox(chainId: number) {
    return (
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
    );
  }

  // Approve and deposit button
  function approveDepositButton(
    approved: boolean,
    amount: number,
    userTokenBalance: number,
    handleApprove: MouseEventHandler<HTMLButtonElement>,
    handleDeposit: MouseEventHandler<HTMLButtonElement>,
    depositButtonMessage: string
  ) {
    return (
      <Box className="mt-3">
        <CustomButton
          size="medium"
          className="w-full !rounded-md"
          color={
            !approved ||
            (amount > 0 &&
              amount <=
                getUserReadableAmount(userTokenBalance, DEFAULT_USD_DECIMALS))
              ? 'primary'
              : 'mineshaft'
          }
          disabled={amount <= 0}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {depositButtonMessage}
        </CustomButton>
      </Box>
    );
  }

  const handleIsPut = useCallback(
    async (isPut: boolean) => {
      props.setSelectedIsPut(isPut);
      await props.updateOlpEpochData();
    },
    [props]
  );

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[350px]">
      {depositWord()}
      {isPutBox(props.selectedIsPut, handleIsPut)}
      {strikeMenuBox(props.strikeIdx, props.handleSelectStrike, props.strikes)}
      {discountDepositBalanceBox(
        props.rawMarkupAmount,
        props.setRawMarkupAmount,
        props.rawDepositAmount,
        props.setRawDepositAmount,
        props.userTokenBalance,
        props.selectedPoolName,
        props.strikeTokenName,
        props.selectedStrikeTokenPrice
      )}
      {epochDisplayBox(props.expiry)}
      {gasCostBox(props.chainId)}
      {approveDepositButton(
        props.approved,
        props.depositAmount,
        props.userTokenBalance,
        props.handleApprove,
        props.handleDeposit,
        props.depositButtonMessage
      )}
    </Box>
  );
}
