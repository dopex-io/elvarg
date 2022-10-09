import { MouseEventHandler } from 'react';
import { Box, Input } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BigNumber } from 'ethers';
import { Typography } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_USD } from 'constants/index';
import { getDialogRow } from 'components/common/LpCommon/Table';
import { getReadableTime } from 'utils/contracts';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import { WritePositionInterface } from 'store/Vault/slp';
import AssetMenuBox from 'components/common/AssetMenuBox';
import BalanceBox from 'components/common/LpCommon/BalanceBox';

interface Props {
  handleClose: Function;
  strikeTokenName: string;
  lpPositionSelected: WritePositionInterface;
  usdToPay: number;
  underlyingToPay: number;
  rawFillAmount: string;
  setRawFillAmount: Function;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  approved: boolean;
  underlyingApproved: boolean;
  isEpochExpired: boolean;
  chainId: number;
  currentEpochExpiry: BigNumber;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleFillPosition: MouseEventHandler<HTMLButtonElement>;
  fillButtonMessage: string;
  assetIdx: number;
  handleSelectAsset: any;
  selectedPoolName: string;
}

export default function FillPositionDialog(props: Props) {
  const {
    handleClose,
    strikeTokenName,
    lpPositionSelected,
    usdToPay,
    underlyingToPay,
    rawFillAmount,
    setRawFillAmount,
    usdBalance,
    underlyingBalance,
    approved,
    underlyingApproved,
    isEpochExpired,
    chainId,
    currentEpochExpiry,
    handleApprove,
    handleFillPosition,
    fillButtonMessage,
    assetIdx,
    handleSelectAsset,
    selectedPoolName,
  } = props;

  function fillLpWord(handleClose: Function) {
    return (
      <Box className="flex justify-between items-center mb-6 p-1">
        <Typography variant="h6" className="text-lg">
          Fill LP
        </Typography>
        <CloseIcon
          role="button"
          className="h-6 w-6"
          onClick={() => handleClose()}
        />
      </Box>
    );
  }

  function lpInfo(strikeTokenName: string) {
    return (
      <Box className="ml-3">
        <Typography variant="h6" className="text-sm">
          Buying {strikeTokenName} put options
        </Typography>
      </Box>
    );
  }

  function getOptionTokenAmountBalance(
    currentEpochExpiry: BigNumber,
    pricePerPut: BigNumber,
    liquidity: BigNumber,
    impliedVol: BigNumber
  ) {
    return (
      <Box className="items-center ml-1">
        {getDialogRow(
          'Expiry',
          currentEpochExpiry ? getReadableTime(currentEpochExpiry) : '-'
        )}
        {getDialogRow('Implied Volatility', `${impliedVol.toString()}`)}
        {getDialogRow(
          'Premium',
          `$${formatAmount(
            getUserReadableAmount(pricePerPut, DECIMALS_USD),
            2
          )}`
        )}
        {getDialogRow(
          'Liquidity available',
          `$${formatAmount(getUserReadableAmount(liquidity, DECIMALS_USD), 2)}`
        )}
      </Box>
    );
  }

  return (
    <Box className="bg-cod-gray rounded-2xl p-4 pr-2 w-[350px]">
      {fillLpWord(handleClose)}
      {lpInfo(strikeTokenName)}

      <Box className="mt-2 rounded-xl flex flex-col p-2 w-full">
        <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
          <AssetMenuBox
            assetIdx={assetIdx}
            handleSelectAsset={handleSelectAsset}
            assets={['usdc', selectedPoolName]}
          />
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mt-3 font-mono mr-2"
            value={rawFillAmount}
            onChange={(e) => setRawFillAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
      </Box>

      <Box className="ml-3 mr-3 mb-3">
        <BalanceBox
          assetIdx={assetIdx}
          usdBalance={usdBalance}
          underlyingBalance={underlyingBalance}
          selectedPoolName={selectedPoolName}
        />
      </Box>

      {getOptionTokenAmountBalance(
        currentEpochExpiry,
        lpPositionSelected?.premium,
        lpPositionSelected?.liquidity,
        lpPositionSelected?.impliedVol
      )}

      <Box className="ml-1 mt-3 pb-3">
        {assetIdx === 0 &&
          getDialogRow('I will pay', `${formatAmount(usdToPay, 2)} USDC`)}
        {assetIdx === 1 &&
          getDialogRow(
            'I will pay',
            `${formatAmount(underlyingToPay, 4)} ${selectedPoolName}`
          )}
      </Box>

      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>

      <ApproveDepositButton
        approved={approved}
        fillButtonMessage={fillButtonMessage}
        handleFillPosition={handleFillPosition}
        handleApprove={handleApprove}
        showPrimary={
          (assetIdx === 0 && !approved) ||
          (assetIdx === 1 && !underlyingApproved) ||
          (fillButtonMessage === 'Fill' && !isEpochExpired)
        }
      />
    </Box>
  );
}
