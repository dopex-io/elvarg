import { Dispatch, SetStateAction, useCallback } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
  disableScrollLock: true,
};

export interface Props {
  activeFilters: string | string[];
  setActiveFilters: Dispatch<SetStateAction<any>>;
  text: string;
  options: string[];
  multiple: boolean;
  showImages: boolean;
}

const Filter = (props: Props) => {
  const {
    activeFilters,
    setActiveFilters,
    text,
    options,
    multiple,
    showImages,
  } = props;

  const handleSelect = useCallback(
    (event: { target: { value: SetStateAction<string | string[]> } }) => {
      setActiveFilters(event.target.value);
    },
    [setActiveFilters]
  );

  return (
    <Box className="m-2">
      <Select
        value={activeFilters}
        className="bg-mineshaft rounded-md pr-2 pl-4 text-white h-8 w-28"
        displayEmpty
        multiple={multiple}
        onChange={handleSelect}
        input={<Input />}
        renderValue={() => {
          return (
            <h6 className="text-white text-center w-full relative">{text}</h6>
          );
        }}
        MenuProps={SelectMenuProps}
        classes={{
          icon: 'absolute right-2 p-0.5 text-white',
        }}
      >
        {options?.map((option) => (
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
                  src={'/images/tokens/' + option.toLowerCase() + '.svg'}
                  alt={option}
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
    </Box>
  );
};

export default Filter;
