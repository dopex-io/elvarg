import { BigNumber } from 'ethers';

import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import Box from '@mui/material/Box';
import CustomButton from '@mui/material/Button';
import Input from '@mui/material/Input';

import Typography from 'components/UI/Typography';
import AssetMenuBox from 'components/common/AssetMenuBox';
import BalanceBox from 'components/common/LpCommon/BalanceBox';
import StrikeMenuBox from 'components/common/StrikeMenuBox';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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
      <Box className="rounded-full pr-1 py-0 flex items-center space-x-2">
        <Box className="bg-cod-gray p-1 rounded-full">
          <AssetMenuBox
            assetIdx={assetIdx}
            handleSelectAsset={handleSelectAsset}
            assets={assets}
          />
        </Box>
        <CustomButton
          onClick={() => {
            setRawDepositAmount(
              assetIdx === 0
                ? addDecimals(usdBalance, DECIMALS_USD)
                : addDecimals(underlyingBalance, DECIMALS_TOKEN)
            );
          }}
          className="bg-mineshaft hover:bg-mineshaft rounded-md p-1"
          disableRipple
        >
          <Typography variant="h6" color="stieglitz">
            MAX
          </Typography>
        </CustomButton>
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
    <Box className="ml-2">
      <Typography variant="h6" color="stieglitz" className="mb-1">
        Side
      </Typography>
      <Box
        className={`flex p-1 space-x-1 w-fit h-[2em] justify-between bg-mineshaft rounded-md mt-2`}
      >
        <CustomButton
          disabled={!hasPut}
          onClick={() => handleIsPut(true)}
          className={`p-0 text-center cursor-pointer rounded hover:bg-umbra hover:opacity-80 ${
            !isPut ? 'bg-mineshaft' : 'bg-umbra'
          }`}
          disableRipple
        >
          <Box className="flex my-auto space-x-1">
            <SouthEastIcon
              fontSize="small"
              className={`fill-current ${
                !isPut ? 'text-stieglitz' : 'text-[#FF617D]'
              }`}
            />
            <Typography variant="h6" className="my-auto">
              Put
            </Typography>
          </Box>
        </CustomButton>
        <CustomButton
          disabled={!hasCall}
          onClick={() => handleIsPut(false)}
          className={`p-0 text-center cursor-pointer rounded hover:bg-umbra hover:opacity-80 ${
            !isPut ? 'bg-umbra' : 'bg-mineshaft'
          }`}
          disableRipple
        >
          <Box className="flex my-auto space-x-1">
            <NorthEastIcon
              fontSize="small"
              className={`fill-current ${
                !isPut ? 'text-[#10b981]' : 'text-stieglitz'
              }`}
            />
            <Typography variant="h6">Call</Typography>
          </Box>
        </CustomButton>
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
    <Box className="w-32 mr-2">
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
