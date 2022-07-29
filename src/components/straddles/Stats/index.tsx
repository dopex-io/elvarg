import React, { useCallback, useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

import Typography from 'components/UI/Typography';
import getExtendedLogoFromChainId from 'utils/general/getExtendedLogoFromChainId';
import getExplorerUrl from 'utils/general/getExplorerUrl';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { WalletContext } from 'contexts/Wallet';
import { StraddlesContext } from 'contexts/Straddles';

const Stats = () => {
  const { chainId } = useContext(WalletContext);
  const { selectedEpoch, setSelectedEpoch, straddlesEpochData } =
    useContext(StraddlesContext);

  const epochs = useMemo(() => {
    if (!selectedEpoch) return [];

    let _epoch = selectedEpoch + 1;

    return Array(_epoch - 1)
      .join()
      .split(',')
      .map((_i, index) => {
        return (
          <MenuItem value={index} key={index} className="text-stieglitz">
            {index}
          </MenuItem>
        );
      });
  }, [selectedEpoch]);

  const handleSelectChange = useCallback(
    (e: { target: { value: any } }) => {
      if (setSelectedEpoch) setSelectedEpoch(Number(e.target.value));
    },
    [setSelectedEpoch]
  );

  return (
    <Box className="flex text-gray-400 ">
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
              <TimerOutlinedIcon className="w-4 h-4 mr-1" />
              16H 11M 11D
            </Button>
          </Box>
        </Box>
        <Box className="border flex justify-between border-neutral-800 p-2">
          <Typography variant="h6" className="text-gray-400">
            Funding Rate
          </Typography>
          <Typography variant="h6" className="text-white">
            16%
          </Typography>
        </Box>
        <Box className="border rounded-bl-lg border-neutral-800 flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Options Sold
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(straddlesEpochData?.totalSold!, 18),
              2
            )}
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
              className="w-16 h-6 mr-2"
              src={getExtendedLogoFromChainId(chainId)}
              alt={'Arbitrum'}
            />
            <a
              className={'cursor-pointer'}
              href={`${getExplorerUrl(
                chainId
              )}/address/${'0x1b700000000000000000000000000000e169'}`}
            >
              <Typography variant="h5" className="text-white text-[11px]">
                {displayAddress(
                  '0x1b700000000000000000000000000000e169',
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
            APR
            <HelpOutlineIcon className="w-5 h-5 ml-1" />
          </Typography>
          <Typography variant="h6" className="ml-auto mr-1 text-gray-400">
            ~
          </Typography>
          <Typography variant="h6" className="text-white">
            13.1%
          </Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography
            variant="h6"
            className="flex justify-center items-center text-gray-400"
          >
            Utilization
            <HelpOutlineIcon className="w-5 h-5 ml-1" />
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
        <Box className="border border-neutral-800 rounded-br-lg flex justify-between p-2">
          <Typography variant="h6" className="text-gray-400">
            Premiums
          </Typography>
          <Typography variant="h6" className="text-white ml-auto mr-1">
            {formatAmount(
              getUserReadableAmount(straddlesEpochData?.usdPremiums!, 18),
              2
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
