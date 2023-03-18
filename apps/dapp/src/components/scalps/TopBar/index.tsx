import { useMemo, useCallback } from 'react';
import { ethers } from 'ethers';

import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const TopBar = () => {
  const {
    optionScalpData,
    selectedPoolName,
    setSelectedPoolName,
    updateOptionScalp,
    updateOptionScalpUserData,
  } = useBoundStore();

  const handleSelectChange = useCallback(
    // @ts-ignore TODO: FIX
    async (e) => {
      await setSelectedPoolName(e.target.value.toString());
      await updateOptionScalpUserData().then(() => updateOptionScalp());
    },
    [setSelectedPoolName]
  );

  const markPrice = useMemo(() => {
    if (selectedPoolName === 'ETH')
      return (
        <Box>
          {optionScalpData?.quoteSymbol}{' '}
          {formatAmount(
            getUserReadableAmount(
              optionScalpData?.markPrice!,
              optionScalpData?.quoteDecimals!.toNumber()
            ),
            2
          )}
        </Box>
      );
    else if (selectedPoolName === 'BTC')
      return (
        <Box>
          {optionScalpData?.baseSymbol}{' '}
          {getUserReadableAmount(
            ethers.utils
              .parseUnits('1000000', 'ether')
              .div(optionScalpData?.markPrice!),
            6
          )}
        </Box>
      );

    return '';
  }, [selectedPoolName, optionScalpData]);

  return (
    <Box className="flex justify-between">
      <Box className="flex items-center">
        <Typography
          variant="h5"
          className="bg-primary rounded-lg p-2 font-bold h-[fit-content]"
        >
          BETA
        </Typography>
        <Box sx={{ p: 1 }} className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${optionScalpData?.baseSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.baseSymbol!}
          />
          <img
            className="w-9 h-9 z-0"
            src={`/images/tokens/${optionScalpData?.quoteSymbol!.toLowerCase()}.svg`}
            alt={optionScalpData?.quoteSymbol!}
          />
        </Box>
        <Box className="ml-4">
          <Typography variant="h5">Option Scalps</Typography>
        </Box>
        <Box className="ml-4">
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
                  width: 120,
                },
              },
            }}
            classes={{
              icon: 'text-white',
            }}
            displayEmpty
            autoWidth
            value={selectedPoolName}
            onChange={handleSelectChange}
          >
            <MenuItem value={'ETH'} key={'ETH'} className="text-white">
              ETH/USDC
            </MenuItem>
            <MenuItem value={'BTC'} key={'BTC'} className="text-white">
              ETH/BTC
            </MenuItem>
          </Select>
        </Box>
        <Typography variant="h4" className="ml-4 mt-3 self-start">
          {markPrice}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;
