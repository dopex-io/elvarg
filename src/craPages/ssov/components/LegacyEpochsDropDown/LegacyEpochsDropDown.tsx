import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import { useState } from 'react';
import { Button } from '@material-ui/core';

const LegacyEpochsDropDown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const epochs = [
    {
      name: 'November Epoch 1',
      to: 'https://ssov-epoch-1.dopex.io/',
    },
    {
      name: 'December Epoch 2',
      to: 'https://ssov-epoch-2.dopex.io/',
    },
  ];

  return (
    <Box className="flex items-center justify-center mb-5">
      <Box className="bg-gradient-to-r p-0.5 mb-3 from-indigo-500 to-blue-400 rounded-lg">
        <Button
          size="medium"
          color="secondary"
          className="text-white text-lg h-10 hover:text-gray-400 hover:bg-umbra pb-3 bg-umbra px-8"
          onClick={handleClick}
        >
          PREVIOUS EPOCHS
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
        {epochs.map(({ name, to }, index) => (
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
