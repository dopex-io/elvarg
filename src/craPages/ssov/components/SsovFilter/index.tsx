import { Dispatch, SetStateAction, useCallback } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

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

export interface Props {
  activeFilters: string | string[];
  setActiveFilters: Dispatch<SetStateAction<string | string[]>>;
  text: string;
  options: string[];
  multiple: boolean;
  showImages: boolean;
}

const SsovFilter = ({
  activeFilters,
  setActiveFilters,
  text,
  options,
  multiple,
  showImages,
}: Props) => {
  const handleSelect = useCallback(
    (event: React.ChangeEvent<{ value: string[] }>) => {
      setActiveFilters(event.target.value);
    },
    []
  );

  return (
    <Select
      value={activeFilters}
      className="bg-mineshaft rounded-md pr-2 pl-4 text-white h-8"
      displayEmpty
      multiple={multiple}
      onChange={handleSelect}
      disableUnderline
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
      MenuProps={SelectMenuProps}
      classes={{
        icon: 'absolute right-2 p-0.5 text-white',
        select: 'overflow-hidden',
      }}
      label="asset"
    >
      {options.map((option) => (
        <MenuItem key={option} value={option} className="pb-2 pt-2">
          <Checkbox
            className={
              activeFilters.includes(option)
                ? 'p-0 text-white'
                : 'p-0 text-white border'
            }
            checked={activeFilters.includes(option)}
          />
          <Box className={'flex'}>
            {showImages ? (
              <img
                src={'/assets/' + option.toLowerCase() + '.svg'}
                className="w-6 ml-3 mt-[0.4px]"
              />
            ) : null}
            <Typography
              variant="h5"
              className="text-white text-left w-full relative ml-2"
            >
              {option}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

export default SsovFilter;
