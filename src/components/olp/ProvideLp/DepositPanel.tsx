import React from 'react';
import { MouseEventHandler } from 'react';
import { Box, Button, Input } from '@mui/material';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import AssetMenuBox from 'components/common/AssetMenuBox';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import {
  BalanceBox,
  DiscountBox,
  WithdrawInfoBox,
} from 'components/common/LpCommon';
import StrikeMenuBox from 'components/common/StrikeMenuBox';

interface Props {
  strikeIdx: number;
  assetIdx: number;
  handleSelectStrike: Function;
  strikes: BigNumber[];
  rawDiscountAmount: string;
  setRawDiscountAmount: Function;
  rawDepositAmount: string;
  discountAmount: number;
  setRawDepositAmount: Function;
  handleSelectAsset: any;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  expiry: BigNumber;
  isEpochExpired: boolean;
  chainId: number;
  approved: boolean;
  underlyingApproved: boolean;
  handleIsPut: any;
  hasPut: boolean;
  hasCall: boolean;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleUnderlyingApprove: MouseEventHandler<HTMLButtonElement>;
  handleDeposit: MouseEventHandler<HTMLButtonElement>;
  depositButtonMessage: string;
  isPut: boolean;
  assets: string[];
  underlyingSymbol: string;
}

export default function DepositPanel(props: Props) {
  const {
    strikeIdx,
    assetIdx,
    handleSelectStrike,
    strikes,
    rawDiscountAmount,
    setRawDiscountAmount,
    rawDepositAmount,
    setRawDepositAmount,
    discountAmount,
    handleSelectAsset,
    usdBalance,
    underlyingBalance,
    expiry,
    isEpochExpired,
    chainId,
    approved,
    underlyingApproved,
    handleIsPut,
    hasPut,
    hasCall,
    handleApprove,
    handleUnderlyingApprove,
    handleDeposit,
    depositButtonMessage,
    isPut,
    assets,
    underlyingSymbol,
  } = props;

  function discountBox(
    rawDiscountAmount: string,
    setRawDiscountAmount: Function,
    discountAmount: number
  ) {
    return (
      <Box className="mt-3 rounded-xl border-[1px] border-none">
        <DiscountBox
          rawAmount={rawDiscountAmount}
          setRawAmount={setRawDiscountAmount}
          amount={discountAmount}
        />
      </Box>
    );
  }

  function depositBalanceBox(
    rawDepositAmount: string,
    setRawDepositAmount: Function,
    usdBalance: BigNumber,
    underlyingBalance: BigNumber,
    assetIdx: number,
    underlyingSymbol: string,
    assets: string[],
    handleSelectAsset: any
  ) {
    return (
      <Box className="mt-2 rounded-xl flex flex-col mb-0 p-3 w-full">
        <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
          <AssetMenuBox
            assetIdx={assetIdx}
            handleSelectAsset={handleSelectAsset}
            assets={assets}
          />
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mt-3 font-mono"
            value={rawDepositAmount}
            onChange={(e) => setRawDepositAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <BalanceBox
          assetIdx={assetIdx}
          usdBalance={usdBalance}
          underlyingBalance={underlyingBalance}
          underlyingSymbol={underlyingSymbol}
        />
      </Box>
    );
  }

  function isPutBox(
    isPut: boolean,
    handleIsPut: Function,
    hasPut: boolean,
    hasCall: boolean
  ) {
    return (
      <Box className="flex h-11 flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
        <Box
          className={`text-center w-full pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
            !isPut ? 'bg-[#2D2D2D]' : ''
          }`}
        >
          <Button disabled={!hasCall} onClick={() => handleIsPut(false)}>
            <Typography variant="h6" className="text-xs -mt-1 font-normal">
              Call
            </Typography>
          </Button>
        </Box>
        <Box
          className={`text-center w-full pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
            isPut ? 'bg-[#2D2D2D]' : ''
          }`}
        >
          <Button disabled={!hasPut} onClick={() => handleIsPut(true)}>
            <Typography variant="h6" className="text-xs -mt-1 font-normal">
              Put
            </Typography>
          </Button>
        </Box>
      </Box>
    );
  }

  function usdApproval() {
    return assetIdx === 0 ? (
      <ApproveDepositButton
        approved={approved}
        fillButtonMessage={depositButtonMessage}
        handleFillPosition={handleDeposit}
        handleApprove={handleApprove}
        showPrimary={
          !isEpochExpired &&
          (!approved || depositButtonMessage === 'Provide LP')
        }
      />
    ) : null;
  }

  function underlyingApproval() {
    return assetIdx === 1 ? (
      <ApproveDepositButton
        approved={underlyingApproved}
        fillButtonMessage={depositButtonMessage}
        handleFillPosition={handleDeposit}
        handleApprove={handleUnderlyingApprove}
        showPrimary={
          !isEpochExpired &&
          (!approved || depositButtonMessage === 'Provide LP')
        }
      />
    ) : null;
  }

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[350px]">
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Provide LP
        </Typography>
      </Box>
      {isPutBox(isPut, handleIsPut, hasPut, hasCall)}
      <StrikeMenuBox
        strikeIdx={strikeIdx}
        handleSelectStrike={handleSelectStrike}
        strikes={strikes}
      />
      {discountBox(rawDiscountAmount, setRawDiscountAmount, discountAmount)}
      {depositBalanceBox(
        rawDepositAmount,
        setRawDepositAmount,
        usdBalance,
        underlyingBalance,
        assetIdx,
        underlyingSymbol,
        assets,
        handleSelectAsset
      )}
      <WithdrawInfoBox expiry={expiry} />
      <Box className="rounded-xl p-4 border border-none w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
      {usdApproval()}
      {underlyingApproval()}
    </Box>
  );
}
