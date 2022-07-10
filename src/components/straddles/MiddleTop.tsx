import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

import Typography from 'components/UI/Typography';

const MiddleTop = () => {
  const [epoch, setEpoch] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setEpoch(event.target.value as string);
  };

  return (
    <Box className="flex text-gray-400">
      <Box className="w-full">
        <Box className="border rounded-tl-lg border-neutral-800 p-2">
          <Typography variant="h6" className="mb-1">
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
                  },
                  '.Mui-selected': {
                    background:
                      'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
                  },
                },
              }}
              displayEmpty
              autoWidth
              value={epoch}
              onChange={handleChange}
            >
              <MenuItem value={''}>01</MenuItem>
              <MenuItem value={10}>02</MenuItem>
              <MenuItem value={20}>03</MenuItem>
              <MenuItem value={30}>04</MenuItem>
              <MenuItem value={40}>05</MenuItem>
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
          <Typography>Funding Rate</Typography>
          <Typography className="text-white">8.91%</Typography>
        </Box>
        <Box className="border rounded-bl-lg border-neutral-800 flex justify-between p-2">
          <Typography>Options Sold</Typography>
          <Typography className="text-white ml-auto mr-1">134.13</Typography>
          <Typography>ETH</Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 p-2">
          <Typography className="mb-1">Contract</Typography>
          <Button
            size="medium"
            color="secondary"
            className="text-white text-md h-8 p-2 hover:text-gray-200 hover:bg-slate-800 bg-slate-700"
          >
            <img
              className="w-4 mr-2"
              src="images/networks/arbitrum.svg"
              alt={'arbitrium icon'}
            />
            0x1b7...e169
          </Button>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography className="flex justify-center items-center">
            APR
            <HelpOutlineIcon className="w-5 h-5 ml-1" />
          </Typography>
          <Typography className="ml-auto mr-1">~</Typography>
          <Typography className="text-white">13.1%</Typography>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography className="flex justify-center items-center">
            Utilization
            <HelpOutlineIcon className="w-5 h-5 ml-1" />
          </Typography>
          <Typography className="ml-auto mr-1">~</Typography>
          <Typography className="mr-1 text-white">$871.21k</Typography>
          <Typography>USDC</Typography>
        </Box>
      </Box>
      <Box className="w-full">
        <Box className="border border-neutral-800 rounded-tr-lg p-2">
          <Typography className="mb-1">Strategy</Typography>
          <Button
            size="medium"
            color="secondary"
            className="text-white text-md h-8 p-3 hover:text-gray-200 hover:bg-mineshaft bg-neutral-800"
          >
            Long Straddle
          </Button>
        </Box>
        <Box className="border border-neutral-800 flex justify-between p-2">
          <Typography>Epoch Length</Typography>
          <Typography className="text-white">7 Days</Typography>
        </Box>
        <Box className="border border-neutral-800 rounded-br-lg flex justify-between p-2">
          <Typography>Premiums</Typography>
          <Typography className="text-white ml-auto mr-1">$10.34k</Typography>
          <Typography>USDC</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MiddleTop;
