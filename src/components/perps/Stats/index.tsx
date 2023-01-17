import React, { useCallback, useMemo } from 'react';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Typography from 'components/UI/Typography';
import InfoBox from './InfoBox';

import { useBoundStore } from 'store';

import getExtendedLogoFromChainId from 'utils/general/getExtendedLogoFromChainId';
import getExplorerUrl from 'utils/general/getExplorerUrl';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const Stats = () => {
  const { chainId, optionPerpData, optionPerpEpochData } = useBoundStore();

  return (
    <Box className="md:flex grid grid-cols-3 text-gray-400">
      <Box className="w-full">
        <Box className="border flex justify-between border-neutral-800 p-2">
          <Typography variant="h6" className="text-gray-400">
            Funding (1 day) %
          </Typography>
          <Typography variant="h6" className="text-white">
            {optionPerpData?.fundingRate.toString()}%
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Total deposits (ETH)
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(
                optionPerpEpochData!['base']?.totalDeposits!,
                18
              ),
              0
            )}{' '}
            <span className="text-gray-400"> USDC</span>
          </Typography>
        </Box>
        <Box className="border rounded-bl-lg border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Total deposits (USDC)
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(
                optionPerpEpochData!['quote']?.totalDeposits!,
                6
              ),
              0
            )}{' '}
            <span className="text-gray-400"> USDC</span>
          </Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 p-2">
          <Typography variant="h6" className="mb-1 text-gray-400">
            Contract
          </Typography>
          <Button
            size="medium"
            color="secondary"
            className="text-white text-md h-8 p-2 hover:text-gray-200 hover:bg-slate-800 bg-slate-700"
          >
            <img
              className="w-auto h-6 mr-2"
              src={getExtendedLogoFromChainId(chainId)}
              alt={'Arbitrum'}
            />
            <a
              className={'cursor-pointer'}
              href={`${getExplorerUrl(chainId)}/address/${
                optionPerpData?.optionPerpContract?.address
              }`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Typography variant="h5" className="text-white text-[11px]">
                {displayAddress(
                  optionPerpData?.optionPerpContract?.address,
                  undefined
                )}
              </Typography>
            </a>
          </Button>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <InfoBox
            heading={'Annualized Premium'}
            tooltip={`The deposited principal is subject to a loss in case of a market downturn, 
            as the writers are selling put options.
            In such a case, the loss may be greater than the premiums received`}
          />
          <Typography variant="h6" className="text-white">
            {0}%
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography
            variant="h6"
            className="flex justify-center items-center text-gray-400"
          >
            Utilization
          </Typography>
          <Typography variant="h6" className="text-white">
            {0}
            <span className="text-gray-400"> USDC</span>
          </Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 rounded-tr-lg p-2">
          <Typography variant="h6" className="mb-1 text-gray-400">
            Strategy
          </Typography>
          <Button
            size="medium"
            color="secondary"
            className="text-white text-md h-8 p-3 hover:text-gray-200 hover:bg-mineshaft bg-neutral-800"
          >
            Option Perpetual
          </Button>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Epoch Length
          </Typography>
          <Typography variant="h6" className="text-white">
            2 Days
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Implied Volatility
          </Typography>
          <Typography variant="h6" color="white">
            0
          </Typography>
        </Box>
        <Box className="border border-neutral-800 rounded-br-lg flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Premiums
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            0
          </Typography>
          <Typography variant="h6" className="text-gray-400">
            USDC
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Stats;
