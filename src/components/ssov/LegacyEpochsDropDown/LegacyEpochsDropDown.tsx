import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

const EPOCHS = [
  {
    name: 'Epoch 1 (November)',
    to: 'https://ssov-epoch-1.dopex.io/',
  },
  {
    name: 'Epoch 2 (December)',
    to: 'https://ssov-epoch-2.dopex.io/',
  },
  {
    name: 'Epoch 3 (January)',
    to: 'https://ssov-epoch-3.dopex.io/',
  },
  {
    name: 'Epoch 4 (February)',
    to: 'https://ssov-epoch-4.dopex.io/',
  },
  {
    name: 'Epoch 5 (March)',
    to: 'https://ssov-epoch-5.dopex.io/',
  },
];

const LegacyEpochsDropDown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // @ts-ignore TODO: FIX
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box className="flex items-center justify-center mb-5">
      <Box className="bg-gradient-to-r p-0.5 mb-3 from-indigo-500 to-blue-400 rounded-lg">
        <Button
          size="medium"
          color="secondary"
          className="text-white text-md h-10 p-3 hover:text-gray-200 hover:bg-mineshaft bg-mineshaft"
          onClick={handleClick}
        >
          LEGACY EPOCHS
        </Button>
      </Box>
      <Menu
        classes={{
          paper: 'bg-umbra ml-2 border-2 border-blue-900',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {EPOCHS.map(({ name, to }, index) => (
          <MenuItem
            key={index}
            className="hover:bg-cod-gray bg-umbra text-white"
            onClick={handleClose}
          >
            <a href={to}>{name}</a>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LegacyEpochsDropDown;
