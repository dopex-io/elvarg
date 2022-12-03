import React, { MouseEventHandler } from 'react';
import { Box, Button, Input } from '@mui/material';
import { BigNumber } from 'ethers';

import { Typography } from 'components/UI';
import AssetMenuBox from 'components/common/AssetMenuBox';
import { BalanceBox } from 'components/common/LpCommon';

import { DECIMALS_USD, DECIMALS_TOKEN } from 'constants/index';

interface AmountBoxProps {
  assetIdx: number;
  handleSelectAsset: Function;
  assets: string[];
  setRawDepositAmount: Function;
  rawDepositAmount: string;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  underlyingSymbol: string;
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

const AmountBox = (props: AmountBoxProps) => {
  const {
    assetIdx,
    handleSelectAsset,
    assets,
    setRawDepositAmount,
    rawDepositAmount,
    usdBalance,
    underlyingBalance,
    underlyingSymbol,
  } = props;

  return (
    <Box>
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
};

export default AmountBox;
