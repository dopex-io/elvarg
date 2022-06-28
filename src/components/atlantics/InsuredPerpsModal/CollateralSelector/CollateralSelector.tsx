import { FC } from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface IProps {
  options: {
    title: string;
    asset: string;
  }[];
  setCollateral: (
    event: SelectChangeEvent<string | undefined>,
    child?: React.ReactNode
  ) => void;
  collateral: string;
}
const CollateralSelector: FC<IProps> = ({
  options,
  setCollateral,
  collateral,
}) => {
  return (
    <Box className="h-[3rem] w-full flex justify-between items-center bg-cod-gray p-1 mt-2">
      <Typography variant="h6">
        Select Collateral
        <Tooltip title="Select collateral to deposit for using this strategy">
          <InfoOutlined className="h-4 fill-current text-mineshaft" />
        </Tooltip>
      </Typography>
      <Select
        value={collateral}
        defaultValue={collateral}
        onChange={setCollateral}
        placeholder="Select Collateral"
        MenuProps={{
          classes: { paper: 'bg-umbra' },
        }}
        className={`text-white bg-mineshaft flex-0.3 h-[2rem] ${
          collateral === '' && 'animate-pulse'
        }`}
        classes={{
          icon: 'text-white',
        }}
        renderValue={() => (
          <Typography
            variant="h6"
            className="text-white text-center w-full relative"
          >
            {collateral}
          </Typography>
        )}
      >
        {options.map(({ title, asset }, index) => (
          <MenuItem className="text-white text-sm" value={asset} key={index}>
            {title}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CollateralSelector;
