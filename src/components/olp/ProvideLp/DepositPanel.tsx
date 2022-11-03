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

import { OlpDataInterface, OlpEpochDataInterface } from 'store/Vault/olp';

import { getDepositMessage } from 'utils/contracts';

interface Props {
  olpData: OlpDataInterface;
  olpEpochData: OlpEpochDataInterface;
  strikeIdx: number;
  assetIdx: number;
  handleSelectStrike: Function;
  rawDiscountAmount: string;
  setRawDiscountAmount: Function;
  rawDepositAmount: string;
  discountAmount: number;
  depositAmount: number;
  setRawDepositAmount: Function;
  handleSelectAsset: Function;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  chainId: number;
  approved: boolean;
  underlyingApproved: boolean;
  handleIsPut: Function;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleUnderlyingApprove: MouseEventHandler<HTMLButtonElement>;
  handleDeposit: MouseEventHandler<HTMLButtonElement>;
}

export default function DepositPanel(props: Props) {
  const {
    olpData,
    olpEpochData,
    strikeIdx,
    assetIdx,
    handleSelectStrike,
    rawDiscountAmount,
    setRawDiscountAmount,
    discountAmount,
    rawDepositAmount,
    setRawDepositAmount,
    depositAmount,
    handleSelectAsset,
    usdBalance,
    underlyingBalance,
    chainId,
    approved,
    underlyingApproved,
    handleIsPut,
    handleApprove,
    handleUnderlyingApprove,
    handleDeposit,
  } = props;

  const depositButtonMessage = getDepositMessage(
    olpEpochData!.isEpochExpired,
    depositAmount,
    assetIdx,
    approved,
    underlyingApproved,
    usdBalance,
    underlyingBalance,
    discountAmount,
    rawDiscountAmount
  );

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
    handleSelectAsset: Function
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
      <Box
        className={`flex h-11 flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md`}
      >
        <Box
          className={`text-center w-full cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
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
          className={`text-center w-full cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
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
          !olpEpochData?.isEpochExpired &&
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
          !olpEpochData?.isEpochExpired &&
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
      {isPutBox(olpData?.isPut, handleIsPut, olpData?.hasPut, olpData?.hasCall)}
      <StrikeMenuBox
        strikeIdx={strikeIdx}
        handleSelectStrike={handleSelectStrike}
        strikes={olpEpochData?.strikes}
      />
      {discountBox(rawDiscountAmount, setRawDiscountAmount, discountAmount)}
      {depositBalanceBox(
        rawDepositAmount,
        setRawDepositAmount,
        usdBalance,
        underlyingBalance,
        assetIdx,
        olpData?.underlyingSymbol,
        ['usdc', olpData?.underlyingSymbol!.toLowerCase()!],
        handleSelectAsset
      )}
      <WithdrawInfoBox expiry={olpEpochData?.expiry} />
      <Box className="rounded-xl p-4 border border-none w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
      {usdApproval()}
      {underlyingApproval()}
    </Box>
  );
}
