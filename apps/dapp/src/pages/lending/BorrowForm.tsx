import { useState, useCallback, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';
import { Box, SelectChangeEvent } from '@mui/material';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';
import { ERC20__factory } from '@dopex-io/sdk';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';

import { useBoundStore } from 'store';
import { ISsovLendingData } from 'store/Vault/lending';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { Typography, CustomButton, Dialog, Input } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';

import useSendTx from 'hooks/useSendTx';

import {
  allowanceApproval,
  getContractReadableAmount,
  getUserReadableAmount,
  getReadableTime,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';
import {
  DECIMALS_TOKEN,
  ARBITRUM_CHAIN_ID,
  DECIMALS_STRIKE,
  MAX_VALUE,
} from 'constants/index';

interface BorrowFormProps {
  borrowAmount: string | number;
  underlyingSymbol: string;
  onChange: (e: {
    target: {
      value: React.SetStateAction<string | number>;
    };
  }) => void;
  handleMax: () => void;
  underlyingBalance: BigNumber;
}

export const BorrowForm = ({
  borrowAmount,
  underlyingSymbol,
  onChange,
  handleMax,
  underlyingBalance,
}: BorrowFormProps) => {
  return (
    <Box className="bg-umbra rounded-xl">
      <Input
        size="small"
        variant="default"
        type="number"
        placeholder="0.0"
        value={borrowAmount}
        onChange={onChange}
        className="p-3"
        leftElement={
          <Box className="flex my-auto">
            <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
              <img
                src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
                alt="usdc"
                className="h-8"
              />
              <Typography
                variant="h5"
                color="white"
                className="flex items-center ml-2"
              >
                {underlyingSymbol}
              </Typography>
            </Box>
            <Box
              role="button"
              className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
              onClick={handleMax}
            >
              <Typography variant="caption" color="stieglitz">
                MAX
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box className="flex justify-between pb-3 px-5 pt-0">
        <Typography variant="h6" color="stieglitz">
          Collateral
        </Typography>
        <Typography variant="h6" color="stieglitz">
          Balance:{' '}
          {`${formatAmount(
            getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN),
            2
          )}`}
        </Typography>
      </Box>
    </Box>
  );
};
