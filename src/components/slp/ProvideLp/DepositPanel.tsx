import React, { useCallback } from 'react';
import { Box, Input } from '@mui/material';
import { BigNumber } from 'ethers';
import { Typography } from 'components/UI';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import StrikeBox from './StrikeBox';
import MarkupBox from 'components/common/LpCommon/MarkupBox';
import WithdrawInfoBox from 'components/common/LpCommon/WithdrawInfoBox';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import BalanceBox from 'components/common/LpCommon/BalanceBox';
import { formatAmount } from 'utils/general';
import AssetMenuBox from 'components/common/AssetMenuBox';

interface Props {
  rawMarkupAmount: string;
  setRawMarkupAmount: React.Dispatch<React.SetStateAction<string>>;
  rawDepositAmount: string;
  setRawDepositAmount: React.Dispatch<React.SetStateAction<string>>;
  rawStrike: string;
  setRawStrike: React.Dispatch<React.SetStateAction<string>>;
  nearestValidPrice: number;
  usdBalance: BigNumber;
  underlyingBalance: BigNumber;
  selectedPoolName: string;
  assetToWrite: number;
  expiry: BigNumber;
  isEpochExpired: boolean;
  chainId: number;
  approved: boolean;
  underlyingApproved: boolean;
  handleApprove: () => Promise<void>;
  handleUnderlyingApprove: () => Promise<void>;
  handleDeposit: () => Promise<void>;
  depositButtonMessage: string;
  assetIdx: number;
  handleSelectAsset: any;
}

export default function DepositPanel(props: Props) {
  const {
    rawMarkupAmount,
    setRawMarkupAmount,
    rawDepositAmount,
    setRawDepositAmount,
    rawStrike,
    setRawStrike,
    nearestValidPrice,
    usdBalance,
    underlyingBalance,
    selectedPoolName,
    assetToWrite,
    expiry,
    isEpochExpired,
    chainId,
    approved,
    underlyingApproved,
    handleApprove,
    handleUnderlyingApprove,
    handleDeposit,
    depositButtonMessage,
    assetIdx,
    handleSelectAsset,
  } = props;

  const handleInputChange = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>, newStrike: number) => {
      setRawStrike((-1 * newStrike).toString());
    },
    [setRawStrike]
  );

  function depositWord() {
    return (
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Provide LP
        </Typography>
      </Box>
    );
  }

  const asset: string =
    assetIdx === 0 ? 'USDC' : selectedPoolName.toUpperCase();

  function usdApproval() {
    return assetIdx === 0 ? (
      <ApproveDepositButton
        approved={approved}
        fillButtonMessage={depositButtonMessage}
        handleFillPosition={handleDeposit}
        handleApprove={handleApprove}
        showPrimary={
          !approved ||
          (depositButtonMessage === 'Provide LP' && !isEpochExpired)
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
          !underlyingApproved ||
          (depositButtonMessage === 'Provide LP' && !isEpochExpired)
        }
      />
    ) : null;
  }

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[350px]">
      {depositWord()}

      <StrikeBox
        nearestValidPrice={nearestValidPrice}
        rawStrike={rawStrike}
        handleInputChange={handleInputChange}
      />

      <MarkupBox
        rawAmount={rawMarkupAmount}
        setRawAmount={setRawMarkupAmount}
      />

      {/* Amount of put options to write */}
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
            className="h-12 text-2xl text-white ml-2 mt-3 font-mono"
            value={rawDepositAmount}
            onChange={(e) => setRawDepositAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
      </Box>

      <Box className="ml-3 mr-3 mb-2">
        <BalanceBox
          assetIdx={assetIdx}
          usdBalance={usdBalance}
          underlyingBalance={underlyingBalance}
          selectedPoolName={selectedPoolName}
        />
      </Box>

      <Box className="flex flex-row pl-1 justify-between mt-3">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">{asset} to provide</span>
        </Typography>
        <Typography variant="h6" className="text-sm p-2">
          {formatAmount(assetToWrite, 2) || 0} {asset}
        </Typography>
      </Box>

      <WithdrawInfoBox expiry={expiry} />

      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>

      {usdApproval()}
      {underlyingApproval()}
    </Box>
  );
}
