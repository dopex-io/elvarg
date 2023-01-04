import React from 'react';
import { Box, Button, Input } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';
import AssetMenuBox from 'components/common/AssetMenuBox';
import { BalanceBox } from 'components/common/LpCommon';
import StrikeMenuBox from 'components/common/StrikeMenuBox';

import { DECIMALS_USD, DECIMALS_TOKEN } from 'constants/index';

function addDecimals(input: BigNumber, decimals: number) {
  const strInput = input.toString();
  const beforeDecimals = strInput.substring(0, strInput.length - decimals);
  const afterDecimals = strInput.substring(
    strInput.length - decimals,
    strInput.length
  );
  return (beforeDecimals ? beforeDecimals : '0') + ('.' + afterDecimals);
}

export const DepositBalanceBox = ({
  rawDepositAmount,
  setRawDepositAmount,
  usdBalance,
  underlyingBalance,
  assetIdx,
  underlyingSymbol,
  assets,
  handleSelectAsset,
}: {
  rawDepositAmount: string;
  setRawDepositAmount: Function;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  assetIdx: number;
  underlyingSymbol: string;
  assets: string[];
  handleSelectAsset: Function;
}) => {
  return (
    <Box className="rounded-xl flex flex-col mb-0 p-3 w-full bg-umbra">
      <Box className="h-12 rounded-full pl-2 pr-1 pt-0 pb-0 flex flex-row items-center">
        <Box className="bg-black h-10 mt-2 p-1 -ml-3 rounded-3xl mr-1">
          <AssetMenuBox
            assetIdx={assetIdx}
            handleSelectAsset={handleSelectAsset}
            assets={assets}
          />
        </Box>
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
};

export const PutBox = ({
  isPut,
  handleIsPut,
  hasPut,
  hasCall,
}: {
  isPut: boolean;
  handleIsPut: Function;
  hasPut: boolean;
  hasCall: boolean;
}) => {
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
};

export const StrikeBox = ({
  strikeIdx,
  handleSelectStrike,
  olpEpochData,
}: {
  strikeIdx: number;
  handleSelectStrike: any;
  olpEpochData: any;
}) => {
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
};
