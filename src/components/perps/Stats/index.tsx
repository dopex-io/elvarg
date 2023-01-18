import React, { useCallback, useMemo } from 'react';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import format from 'date-fns/format';

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
            {(
              getUserReadableAmount(optionPerpData?.fundingRate!, 8) / 365
            ).toString()}
            %
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
        <Box className="border border-neutral-800 flex justify-between p-2">
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
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Total long
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            <span className="text-gray-400">$</span>{' '}
            {formatAmount(
              getUserReadableAmount(
                optionPerpEpochData!['base']?.positions!,
                8
              ),
              0
            )}{' '}
          </Typography>
        </Box>
        <Box className="border rounded-bl-lg border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Total short
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            <span className="text-gray-400">$</span>{' '}
            {formatAmount(
              getUserReadableAmount(
                optionPerpEpochData!['quote']?.positions!,
                8
              ),
              0
            )}{' '}
          </Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 p-2 pb-[0.6rem]">
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
          <Typography
            variant="h6"
            className="flex justify-center items-center text-gray-400"
          >
            Close fees
          </Typography>
          <Typography variant="h6" className="text-white">
            {getUserReadableAmount(optionPerpData?.feeClosePosition!, 8)}%
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography
            variant="h6"
            className="flex justify-center items-center text-gray-400"
          >
            Open fees
          </Typography>
          <Typography variant="h6" className="text-white">
            {getUserReadableAmount(optionPerpData?.feeClosePosition!, 8)}%
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography
            variant="h6"
            className="flex justify-center items-center text-gray-400"
          >
            Liquidation fees
          </Typography>
          <Typography variant="h6" className="text-white">
            {getUserReadableAmount(optionPerpData?.feeLiquidation!, 8)}%
          </Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 rounded-tr-lg p-2 pb-[0.6rem]">
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
            Next expiry
          </Typography>
          <Typography variant="h6" className="text-white">
            {optionPerpData?.expiry
              ? format(Number(optionPerpData?.expiry) * 1000, 'd LLL')
              : '-'}
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Open Interest
          </Typography>
          <Typography variant="h6" color="white">
            <span className="text-gray-400">$</span>{' '}
            {formatAmount(
              getUserReadableAmount(
                optionPerpEpochData!['quote']?.oi!.add(
                  optionPerpEpochData!['base']?.oi!
                ),
                8
              ),
              0
            )}{' '}
          </Typography>
        </Box>
        <Box className="border border-neutral-800 rounded-br-lg flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            LTV
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {100 -
              getUserReadableAmount(optionPerpData?.liquidationThreshold!, 8)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Stats;
