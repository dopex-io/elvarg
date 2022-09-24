import React, { useCallback } from 'react';
import { MouseEventHandler } from 'react';
import { Box, Input, Select, MenuItem } from '@mui/material';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import { getUserReadableAmount, getReadableTime } from 'utils/contracts';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import DiscountBox from 'components/common/LpCommon/DiscountBox';

interface Props {
  strikeIdx: number;
  handleSelectStrike: Function;
  strikes: BigNumber[];
  rawDiscountAmount: string;
  setRawDiscountAmount: Function;
  rawDepositAmount: string;
  setRawDepositAmount: Function;
  userTokenBalance: BigNumber;
  expiry: BigNumber;
  isEpochExpired: boolean;
  chainId: number;
  approved: boolean;
  depositAmount: number;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleDeposit: MouseEventHandler<HTMLButtonElement>;
  depositButtonMessage: string;
  selectedIsPut: boolean;
  setSelectedIsPut: Function;
  updateOlp: Function;
  updateOlpEpochData: Function;
  updateOlpUserData: Function;
}

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

export default function DepositPanel(props: Props) {
  const {
    strikeIdx,
    handleSelectStrike,
    strikes,
    rawDiscountAmount,
    setRawDiscountAmount,
    rawDepositAmount,
    setRawDepositAmount,
    userTokenBalance,
    expiry,
    isEpochExpired,
    chainId,
    approved,
    depositAmount,
    handleApprove,
    handleDeposit,
    depositButtonMessage,
    selectedIsPut,
    setSelectedIsPut,
    updateOlp,
    updateOlpEpochData,
    updateOlpUserData,
  } = props;

  function depositWord() {
    return (
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Provide LP
        </Typography>
      </Box>
    );
  }

  function strikeMenuBox(
    strikeIdx: number,
    handleSelectStrike: any,
    strikes: BigNumber[]
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
            {strikes.map((strike: BigNumber, index: number) => (
              <MenuItem key={index} value={index} className="pb-2 pt-2">
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  $
                  {formatAmount(
                    getUserReadableAmount(strike, DECIMALS_STRIKE),
                    2
                  )}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    );
  }

  function discountDepositBalanceBox(
    rawDiscountAmount: string,
    setRawDiscountAmount: Function,
    rawDepositAmount: string,
    setRawDepositAmount: Function,
    userTokenBalance: BigNumber
  ) {
    return (
      <Box>
        <DiscountBox
          rawAmount={rawDiscountAmount}
          setRawAmount={setRawDiscountAmount}
        />
        <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
          <Box className="flex flex-row h-10 w-[100px] p-1">
            <img src={'/images/tokens/usdc.svg'} alt={'USDC'} />
            <Typography
              variant="h6"
              className="text-stieglitz text-md font-medium pl-1 pt-1.5 ml-1.5"
            >
              <span className="text-white">USDC</span>
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
            <Typography variant="h6" className="text-sm pl-1 pt-2 pr-3">
              {formatAmount(
                getUserReadableAmount(userTokenBalance, DECIMALS_USD),
                2
              )}{' '}
              USDC
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

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
                {expiry ? getReadableTime(expiry) : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  function gasCostBox(chainId: number) {
    return (
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
    );
  }

  function approveDepositButton(
    approved: boolean,
    amount: number,
    handleApprove: MouseEventHandler<HTMLButtonElement>,
    handleDeposit: MouseEventHandler<HTMLButtonElement>,
    depositButtonMessage: string,
    isEpochExpired: boolean
  ) {
    return (
      <Box className="mt-3">
        <CustomButton
          size="medium"
          className="w-full !rounded-md"
          color={
            !approved ||
            (depositButtonMessage === 'Provide LP' && !isEpochExpired)
              ? 'primary'
              : 'mineshaft'
          }
          disabled={amount <= 0 || isEpochExpired}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {depositButtonMessage}
        </CustomButton>
      </Box>
    );
  }

  const handleIsPut = useCallback(
    async (isPut: boolean) => {
      setSelectedIsPut(isPut);
      await updateOlp();
      await updateOlpEpochData();
      await updateOlpUserData();
    },
    [setSelectedIsPut, updateOlpEpochData, updateOlpUserData, updateOlp]
  );

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

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[350px]">
      {depositWord()}
      {isPutBox(selectedIsPut, handleIsPut)}
      {strikeMenuBox(strikeIdx, handleSelectStrike, strikes)}
      {discountDepositBalanceBox(
        rawDiscountAmount,
        setRawDiscountAmount,
        rawDepositAmount,
        setRawDepositAmount,
        userTokenBalance
      )}
      {epochDisplayBox(expiry)}
      {gasCostBox(chainId)}
      {approveDepositButton(
        approved,
        depositAmount,
        handleApprove,
        handleDeposit,
        depositButtonMessage,
        isEpochExpired
      )}
    </Box>
  );
}
