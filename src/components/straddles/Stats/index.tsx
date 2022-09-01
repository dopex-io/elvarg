import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Countdown from 'react-countdown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getExtendedLogoFromChainId from 'utils/general/getExtendedLogoFromChainId';
import getExplorerUrl from 'utils/general/getExplorerUrl';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const Stats = () => {
  const {
    // Wallet
    chainId,
    // Straddles
    selectedEpoch,
    setSelectedEpoch,
    straddlesEpochData,
    updateStraddlesEpochData,
    straddlesData,
  } = useBoundStore();

  const currentEpoch = straddlesData?.currentEpoch || 0;

  const epochEndTime: Date = useMemo(() => {
    return straddlesEpochData
      ? new Date(straddlesEpochData?.expiry?.toNumber() * 1000)
      : new Date(0);
  }, [straddlesEpochData]);

  const epochs = useMemo(() => {
    let _epoch = Number(currentEpoch);

    return Array(_epoch)
      .join()
      .split(',')
      .map((_i, index) => {
        return (
          <MenuItem
            value={index + 1}
            key={index + 1}
            className="text-stieglitz"
          >
            {index + 1}
          </MenuItem>
        );
      });
  }, [currentEpoch]);

  const handleSelectChange = useCallback(
    (e: { target: { value: any } }) => {
      if (setSelectedEpoch) setSelectedEpoch(Number(e.target.value));
      updateStraddlesEpochData();
    },
    [setSelectedEpoch, updateStraddlesEpochData]
  );

  return (
    <Box className="md:flex text-gray-400 ">
      <Box className="w-full">
        <Box className="border rounded-tl-lg border-neutral-800 p-2">
          <Typography variant="h6" className="mb-1 text-gray-400">
            Epoch
          </Typography>
          <Box className="flex">
            <Select
              className="text-white text-md h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
              MenuProps={{
                sx: {
                  '.MuiMenu-paper': {
                    background: 'black',
                    color: 'white',
                    fill: 'white',
                  },
                  '.Mui-selected': {
                    background:
                      'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
                  },
                },
              }}
              displayEmpty
              autoWidth
              value={selectedEpoch! || 0}
              onChange={handleSelectChange}
            >
              {epochs}
            </Select>
            <Button
              size="small"
              color="secondary"
              className="mx-2 text-gray-500 text-md h-8 py-3 px-2 hover:text-gray-200 hover:bg-mineshaft bg-neutral-800"
            >
              <Countdown
                date={epochEndTime}
                renderer={({ days, hours, minutes }) => {
                  return (
                    <Box className={'flex'}>
                      <img
                        src="/assets/timer.svg"
                        className="h-[1rem] mt-1 mr-2 ml-1"
                        alt="Timer"
                      />
                      <Typography
                        variant="h5"
                        className="ml-auto text-stieglitz mr-1 text-sm"
                      >
                        {days}d {hours}h {minutes}m
                      </Typography>
                    </Box>
                  );
                }}
              />
            </Button>
          </Box>
        </Box>
        <Box className="border flex justify-between border-neutral-800 p-2">
          <Typography variant="h6" className="text-gray-400">
            Funding %
          </Typography>
          <Typography variant="h6" className="text-white">
            {straddlesEpochData?.aprFunding.toString()}%
          </Typography>
        </Box>
        <Box className="border rounded-bl-lg border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Total Liquidity
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(straddlesEpochData?.usdDeposits!, 6),
              6
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
                straddlesData?.straddlesContract?.address
              }`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Typography variant="h5" className="text-white text-[11px]">
                {displayAddress(
                  straddlesData?.straddlesContract?.address,
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
            Annualized Premium
          </Typography>
          <Typography variant="h6" className="text-white">
            {straddlesEpochData?.aprPremium}%
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
            {formatAmount(
              getUserReadableAmount(straddlesEpochData?.activeUsdDeposits!, 26),
              2
            )}
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
            Long Straddle
          </Button>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Epoch Length
          </Typography>
          <Typography variant="h6" className="text-white">
            3 Days
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Implied Volatility
          </Typography>
          <Typography variant="h6" className="text-white">
            {straddlesEpochData?.volatility}
          </Typography>
        </Box>
        <Box className="border border-neutral-800 rounded-br-lg flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Premiums
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(
                straddlesEpochData?.usdPremiums!,
                18 + 6 + 2
              ),
              4
            )}
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
