import { Dispatch, SetStateAction, useCallback } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Typography from 'components/UI/Typography';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const SelectMenuClasses = {
  icon: 'absolute right-1 text-white scale-x-75',
  select: 'overflow-hidden',
};

const SUPPORTED_TOKENS = ['2CRV', 'USDT', 'USDC'];

const Curve2PoolDepositSelector = ({
  depositTokenName,
  setDepositTokenName,
}: {
  depositTokenName: string;
  setDepositTokenName: Dispatch<SetStateAction<string>>;
}) => {
  const handleSelectChange = useCallback(
    (e: { target: { value: string } }) =>
      setDepositTokenName(e.target.value.toString()),
    [setDepositTokenName]
  );

  return (
    <Box className="w-1/4">
      <Select
        className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
        fullWidth
        displayEmpty
        multiple={false}
        value={depositTokenName}
        onChange={handleSelectChange}
        input={<Input />}
        variant="outlined"
        renderValue={() => {
          return (
            <Typography
              variant="h6"
              className="text-white text-center w-full relative"
            >
              {depositTokenName}
            </Typography>
          );
        }}
        MenuProps={SelectMenuProps}
        classes={SelectMenuClasses}
        label="tokens"
      >
        {SUPPORTED_TOKENS.map((token) => {
          return (
            <MenuItem key={token} value={token} className="pb-2 pt-2">
              <Typography
                variant="h5"
                className="text-white text-left w-full relative ml-3"
              >
                {token}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default Curve2PoolDepositSelector;
