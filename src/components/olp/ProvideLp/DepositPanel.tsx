import React, { MouseEventHandler } from 'react';
import { Box, Button, Input } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import AssetMenuBox from 'components/common/AssetMenuBox';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import {
  BalanceBox,
  DiscountBox,
  WithdrawInfoBox,
} from 'components/common/LpCommon';
import StrikeMenuBox from 'components/common/StrikeMenuBox';

import { OlpDataInterface, OlpEpochDataInterface } from 'store/Vault/olp';

import { getDepositMessage } from 'utils/contracts';

import { DECIMALS_USD, DECIMALS_TOKEN } from 'constants/index';

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
      <Box className="bg-umbra p-1 pb-2 border-radius rounded-lg mt-1">
        <DiscountBox
          rawAmount={rawDiscountAmount}
          setRawAmount={setRawDiscountAmount}
          amount={discountAmount}
        />
      </Box>
    );
  }

  function addDecimals(input: BigNumber, decimals: number) {
    const strInput = input.toString();
    const beforeDecimals = strInput.substring(0, strInput.length - decimals);
    const afterDecimals = strInput.substring(
      strInput.length - decimals,
      strInput.length
    );
    return (beforeDecimals ? beforeDecimals : '0') + ('.' + afterDecimals);
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
      <Box className="rounded-xl flex flex-col mb-0 p-3 w-full bg-umbra">
        <Box className="h-12 rounded-full pl-2 pr-1 pt-0 pb-0 flex flex-row items-center">
          <AssetMenuBox
            assetIdx={assetIdx}
            handleSelectAsset={handleSelectAsset}
            assets={assets}
          />
          <Box className="bg-mineshaft border-radius rounded-lg mt-3 h-8">
            <Button
              onClick={() => {
                setRawDepositAmount(
                  assetIdx === 0
                    ? addDecimals(usdBalance, DECIMALS_USD)
                    : addDecimals(underlyingBalance, DECIMALS_TOKEN)
                );
              }}
            >
              <Typography variant="h6" color="stieglitz" className="-mt-1.5">
                MAX
              </Typography>
            </Button>
          </Box>
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
      <Box className="w-32 ml-2">
        <Typography variant="h6" color="stieglitz" className="mb-1">
          Side
        </Typography>
        <Box
          className={`flex flex-row h-[34px] w-[135px] justify-between bg-mineshaft rounded-md mt-2`}
        >
          <Box
            className={`ml-1 my-1 h-6.5 text-center cursor-pointer group rounded hover:bg-umbra hover:opacity-80 ${
              !isPut ? 'bg-umbra' : ''
            }`}
          >
            <Button disabled={!hasCall} onClick={() => handleIsPut(false)}>
              <Box className="flex flex-row">
                <NorthEastIcon
                  fontSize="small"
                  sx={{
                    color: '#10b981',
                    marginTop: '-0.25rem',
                    marginLeft: '-0.25rem',
                  }}
                />
                <Typography variant="h6" className="-mt-1.5">
                  Call
                </Typography>
              </Box>
            </Button>
          </Box>
          <Box
            className={`mr-2 my-1 h-6.5 text-center cursor-pointer group rounded hover:bg-umbra hover:opacity-80 ${
              isPut ? 'bg-umbra' : ''
            }`}
          >
            <Button disabled={!hasPut} onClick={() => handleIsPut(true)}>
              <Box className="flex flex-row">
                <SouthEastIcon
                  fontSize="small"
                  sx={{
                    color: '#FF617D',
                    marginTop: '-0.25rem',
                    marginLeft: '-0.5rem',
                  }}
                />
                <Typography variant="h6" className="-mt-1.5">
                  Put
                </Typography>
              </Box>
            </Button>
          </Box>
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

  function strikeBox() {
    return (
      <Box className="w-32">
        <Typography variant="h6" color="stieglitz" className="mb-1">
          Strike
        </Typography>
        <StrikeMenuBox
          strikeIdx={strikeIdx}
          handleSelectStrike={handleSelectStrike}
          strikes={olpEpochData?.strikes}
        />
      </Box>
    );
  }

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[350px]">
      <Box className="flex mb-3">
        <Typography variant="h5">Provide LP</Typography>
      </Box>
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

      <Box className="flex flex-row justify-between bg-umbra p-1 pb-2 border-radius rounded-lg mt-1">
        {isPutBox(
          olpData?.isPut,
          handleIsPut,
          olpData?.hasPut,
          olpData?.hasCall
        )}
        {strikeBox()}
      </Box>
      {discountBox(rawDiscountAmount, setRawDiscountAmount, discountAmount)}

      <Box className="bg-umbra p-2 border-radius rounded-lg mt-4">
        <Box className="bg-carbon p-2 border-radius rounded-lg my-2 space-y-1">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <WithdrawInfoBox expiry={olpEpochData?.expiry} />
        </Box>
        {usdApproval()}
        {underlyingApproval()}
      </Box>
    </Box>
  );
}
