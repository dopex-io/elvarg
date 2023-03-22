import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useCallback } from 'react';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import Stats from '../Stats';

const TopBar = () => {
  const {
    optionScalpData,
    setSelectedPoolName,
    updateOptionScalpUserData,
    updateOptionScalp,
    selectedPoolName,
  } = useBoundStore();

  const handleSelectChange = useCallback(
    async (e: any) => {
      await setSelectedPoolName(e.target.value.toString());
      await updateOptionScalpUserData().then(() => updateOptionScalp());
    },
    [setSelectedPoolName, updateOptionScalp, updateOptionScalpUserData]
  );

  return (
    <Box className="flex lg:flex-row md:flex-col items-center">
      <Box className="flex items-center">
        <Typography
          variant="h5"
          className="bg-primary rounded-lg p-2 font-bold h-[fit-content] text-[0.7rem]"
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
          <Typography variant="h5" className="text-[0.8rem]">
            Option Scalps
          </Typography>
          <Select
            className="text-white h-8 text-[0.7rem] pr-[1rem] border-2 border-mineshaft mt-2"
            MenuProps={{
              sx: {
                '.MuiMenu-paper': {
                  background: '#151515',
                  color: 'white',
                  fill: 'white',
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
          </Select>
        </Box>
      </Box>
      <Stats />
    </Box>
  );
};

export default TopBar;
