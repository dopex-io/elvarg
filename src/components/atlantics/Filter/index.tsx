import { Dispatch, SetStateAction, useCallback } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';

import { Pool } from 'contexts/Atlantics';

interface FilterProps {
  activeFilters: string | string[];
  setActiveFilters: Dispatch<SetStateAction<string | string[]>>;
  text: string;
  options: Pool[];
  multiple: boolean;
}

const Filter = (props: FilterProps) => {
  const { activeFilters, setActiveFilters, text, options, multiple } = props;

  const handleSelect = useCallback(
    (event: { target: { value: SetStateAction<string | string[]> } }) => {
      setActiveFilters(event.target.value);
    },
    [setActiveFilters]
  );

  return (
    <Box className="flex space-x-3 my-auto">
      <Select
        id="tokenFilter"
        name="tokenFilter"
        value={activeFilters}
        onChange={handleSelect}
        multiple={multiple}
        displayEmpty
        MenuProps={{
          classes: { paper: 'bg-umbra' },
        }}
        placeholder="Filter"
        className={`text-white bg-mineshaft flex-0.3 h-[2.4rem] mt-5`}
        classes={{
          icon: 'text-white',
        }}
        renderValue={() => {
          return (
            <Typography
              variant="h6"
              className="text-white text-center w-full relative"
            >
              {text}
            </Typography>
          );
        }}
        notched
      >
        {options.map((token: Pool, index: number) => (
          <MenuItem key={index} value={token.asset} className="text-white">
            <Checkbox
              checked={activeFilters.includes(token.asset)}
              className="text-white border"
            />
            <Box className="flex">
              <Typography
                variant="h5"
                className="text-white text-left w-full relative ml-2"
              >
                {token.asset}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
      <Input
        leftElement={null}
        variant="variant1"
        placeholder="Search by symbol"
        onChange={(e) => setActiveFilters([e.target.value])}
      />
    </Box>
  );
};

export default Filter;
