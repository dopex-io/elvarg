import { Select, Box } from '@mui/material';
import { Typography } from 'components/UI';

interface Props {
  data: string;
  values: JSX.Element[];
  selectedValue: number;
  handleOnChange: any;
}

const CustomMenuBox = ({
  data,
  values,
  selectedValue,
  handleOnChange,
}: Props) => {
  return (
    <Box className="flex flex-col mb-3 w-[135px]">
      <Typography variant="h6" className="mb-1 text-gray-400 text-center">
        {data}
      </Typography>
      <Select
        className="text-white text-center text-md h-8 bg-gradient-to-r from-cyan-500 to-blue-700"
        MenuProps={{
          sx: {
            '.MuiMenu-paper': {
              background: 'black',
              color: 'white',
              fill: 'white',
            },
            '.Mui-selected': {
              background: 'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
            },
          },
          disableScrollLock: true,
        }}
        autoWidth
        value={values.length ? selectedValue : ''}
        onChange={handleOnChange}
      >
        {values}
      </Select>
    </Box>
  );
};

export default CustomMenuBox;
