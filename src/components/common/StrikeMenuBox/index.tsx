import { Typography } from 'components/UI';
import { Box, Input, Select, MenuItem } from '@mui/material';
import { BigNumber } from 'ethers';
import { formatAmount } from 'utils/general';
import { getUserReadableAmount } from 'utils/contracts';
import { DECIMALS_STRIKE } from 'constants/index';

interface Props {
  strikeIdx: number;
  handleSelectStrike: any;
  strikes: BigNumber[];
}

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 150,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
  disableScrollLock: true,
};

const StrikeMenuBox = ({ strikeIdx, handleSelectStrike, strikes }: Props) => {
  return (
    <Box className="mt-2 flex">
      <Box className={'w-full'}>
        <Select
          className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
          fullWidth
          value={strikes.length ? strikeIdx : ''}
          onChange={handleSelectStrike}
          input={<Input />}
          variant="outlined"
          placeholder="Select Strike Prices"
          MenuProps={SelectMenuProps}
          classes={{
            icon: 'absolute right-7 text-white',
            select: 'overflow-hidden',
          }}
          disableUnderline
          label="strikes"
        >
          {strikes.map((strike: BigNumber, index: number) => (
            <MenuItem key={index} value={index} className="pb-2 pt-2">
              <Typography
                variant="h5"
                className="text-white text-left w-full relative ml-3"
              >
                $
                {formatAmount(
                  getUserReadableAmount(strike, DECIMALS_STRIKE),
                  2
                )}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default StrikeMenuBox;
