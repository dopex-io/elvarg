import { useState, useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import { WalletContext } from 'contexts/Wallet';

const LegacyEpochsDropDown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { chainId } = useContext(WalletContext);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const epochs = [
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
  ];

  return (
    <Box className="flex items-center justify-center mb-5">
      <Box className="bg-gradient-to-r p-0.5 mb-3 from-indigo-500 to-blue-400 rounded-lg">
        <Button
          size="medium"
          color="secondary"
          className="text-white text-lg h-10 hover:text-gray-200 hover:bg-mineshaft pb-3 bg-mineshaft px-8"
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
        {epochs.map(({ name, to }, index) => (
          <MenuItem
            key={index}
            className="hover:bg-cod-gray bg-umbra text-white"
            onClick={handleClose}
          >
            <a href={to} target={'_blank'}>
              {name}
            </a>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LegacyEpochsDropDown;
