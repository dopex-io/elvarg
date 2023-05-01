import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Countdown from 'react-countdown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import InfoBox from './InfoBox';

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
    // tokenPrices,
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
          <MenuItem value={index + 1} key={index + 1}>
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

  const settlementPrice = useMemo(() => {
    return !straddlesEpochData?.settlementPrice.eq(BigNumber.from(0))
      ? formatAmount(
          getUserReadableAmount(straddlesEpochData?.settlementPrice!, 8),
          2
        )
      : 0;
  }, [straddlesEpochData]);

  function getSettlementDisplay() {
    return settlementPrice != 0 ? (
      <Box className="w-full lg:border-r lg:border-t-0 border-r-0 border-t border-carbon">
        <Box className="flex justify-between p-2">
          <Typography variant="h6" color="stieglitz">
            Settlement Price
          </Typography>
          <Typography variant="h6">${settlementPrice}</Typography>
        </Box>
      </Box>
    ) : null;
  }

  return (
    <Box className="grid lg:grid-cols-3 grid-cols-1 border border-carbon rounded-lg">
      <Box className="lg:border-r border-r-0 border-b border-carbon">
        <Typography variant="h6" className="mb-1 p-2" color="stieglitz">
          Epoch
        </Typography>
        <Box className="flex space-x-2 p-2 pt-0">
          <Select
            className="text-white h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
            MenuProps={{
              sx: {
                '.MuiMenu-paper': {
                  background: '#151515',
                  color: 'white',
                  fill: 'white',
                },
                '.Mui-selected': {
                  background:
                    'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
                },
                height: 150,
              },
              PaperProps: {
                style: {
                  width: 70,
                },
              },
            }}
            classes={{
              icon: 'text-white',
            }}
            displayEmpty
            autoWidth
            value={selectedEpoch}
            onChange={handleSelectChange}
          >
            {epochs}
          </Select>
          <Box className="h-auto p-1 hover:bg-mineshaft hover:cursor-default bg-carbon rounded-md">
            <Countdown
              date={epochEndTime}
              renderer={({ days, hours, minutes }) => {
                return (
                  <Box className="flex my-auto space-x-2">
                    <img
                      src="/assets/timer.svg"
                      className="h-[1rem] my-1 "
                      alt="Timer"
                    />
                    <Typography
                      variant="h6"
                      className="ml-auto my-auto"
                      color="stieglitz"
                    >
                      {days}d {hours}h {minutes}m
                    </Typography>
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className="lg:border-r border-r-0 border-b border-carbon">
        <Typography variant="h6" className="mb-1 p-2" color="stieglitz">
          Contract
        </Typography>
        <Box className="p-2 pt-0">
          <Button size="medium" className="h-8 hover:bg-arbitrum bg-arbitrum">
            <img
              className="w-auto h-4 mr-2"
              src={getExtendedLogoFromChainId(chainId)}
              alt="arbitrum"
            />
            <a
              className="cursor-pointer"
              href={`${getExplorerUrl(chainId)}/address/${
                straddlesData?.straddlesContract?.address
              }`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Typography variant="h6">
                {displayAddress(
                  straddlesData?.straddlesContract?.address,
                  undefined
                )}
              </Typography>
            </a>
          </Button>
        </Box>
      </Box>
      <Box className="border-b border-carbon">
        <Typography variant="h6" className="mb-1 p-2" color="stieglitz">
          Strategy
        </Typography>
        <Box className="flex space-x-2 p-2 pt-0">
          <Typography
            variant="h6"
            className="mb-1 px-2 py-1 h-8 hover:cursor-default bg-carbon rounded-md w-fit"
          >
            Long Straddle
          </Typography>
        </Box>
      </Box>
      <Box className="flex justify-between lg:border-r border-r-0 border-b border-carbon p-2">
        <Typography variant="h6" color="stieglitz" className="my-auto">
          Funding %
        </Typography>
        <Typography variant="h6" className="my-auto">
          {straddlesEpochData?.aprFunding.toString()}%
        </Typography>
      </Box>
      <Box className="flex justify-between lg:border-r border-r-0 border-b border-carbon p-2">
        <Typography variant="h6" color="stieglitz">
          Total Liquidity
        </Typography>
        <Typography variant="h6" className="my-auto">
          $
          {formatAmount(
            getUserReadableAmount(straddlesEpochData?.usdDeposits!, 6),
            6
          )}
        </Typography>
      </Box>
      <Box className="flex justify-between border-b border-carbon p-2">
        <InfoBox
          heading="Annualized Premium"
          tooltip={`The deposited principal is subject to a loss in case of a market down-turn, 
            as the writers are selling put options. In such a case, the loss may be greater than
            the premiums received.`}
        />
        <Typography variant="h6" className="my-auto">
          {straddlesEpochData?.aprPremium}%
        </Typography>
      </Box>
      <Box className="flex justify-between lg:border-r border-r-0 border-b border-carbon p-2">
        <Typography
          variant="h6"
          className="flex justify-center items-center"
          color="stieglitz"
        >
          Utilization
        </Typography>
        <Typography variant="h6" className="my-auto">
          $
          {formatAmount(
            getUserReadableAmount(straddlesEpochData?.activeUsdDeposits!, 26),
            2
          )}
        </Typography>
      </Box>
      <Box className="flex justify-between lg:border-r border-r-0 border-b border-carbon p-2">
        <Typography variant="h6" color="stieglitz">
          Epoch Length
        </Typography>
        <Typography variant="h6" className="my-auto">
          2 Days
        </Typography>
      </Box>
      <Box className="flex justify-between border-b border-carbon p-2">
        <Typography variant="h6" color="stieglitz" className="my-auto">
          Implied Volatility
        </Typography>
        <Typography variant="h6">
          {straddlesEpochData?.volatility.toString()}
        </Typography>
      </Box>
      <Box className="flex justify-between lg:border-r lg:border-b-0 border-r-0 border-carbon p-2">
        <Typography variant="h6" color="stieglitz">
          Premiums
        </Typography>
        <Typography variant="h6">
          $
          {formatAmount(
            getUserReadableAmount(straddlesEpochData?.usdPremiums!, 18 + 6 + 2),
            4
          )}
        </Typography>
      </Box>
      {/* {straddlesData?.underlying ===
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' ? (
        <Box className="flex justify-between lg:border-r lg:border-b-0 border-r-0 border-carbon p-2">
          <Typography variant="h6" color="wave-blue">
            Reward APR
          </Typography>
          <Typography variant="h6" color="wave-blue">
            ~
            {formatAmount(
              ((1526 *
                Number(
                  tokenPrices.find(
                    (item: { name: string }) => item.name === 'MATIC'
                  )?.price
                ) *
                100) /
                getUserReadableAmount(straddlesEpochData?.usdDeposits!, 6)) *
                182.5,
              2
            )}
            %
          </Typography>
        </Box>
      ) : null} */}
      {getSettlementDisplay()}
    </Box>
  );
};

export default Stats;
