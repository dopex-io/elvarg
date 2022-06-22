import InfoOutlined from '@mui/icons-material/InfoOutlined';
import React, { FC } from 'react';
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
    <Box className="h-[3rem] w-full flex justify-center items-center bg-cod-gray p-1 mt-2">
      <Typography variant="h6" className=" flex-1">
        Select Collateral
        <Tooltip
          className="h-4 my-auto"
          title="Select collateral to deposit for using this strategy"
        >
          <InfoOutlined />
        </Tooltip>
      </Typography>
      <Select
        value={collateral}
        onChange={setCollateral}
        placeholder="Select Collateral"
        MenuProps={{
          classes: { paper: 'bg-umbra' },
        }}
        className={`text-white bg-mineshaft flex-0.3 h-[2rem] ${
          collateral === '' && 'animate-pulse'
        }`}
      >
        {options.map(({ title, asset }, index) => (
          <MenuItem className="text-white text-sm" value={asset} key={index}>
            {title}
          </MenuItem>
        ))}
      </Select>
      <Box></Box>
    </Box>
  );
};

export default CollateralSelector;
