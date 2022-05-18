import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

// import CustomInput from 'components/UI/CustomInput';

import Typography from 'components/UI/Typography';

const MaxStrikeInput = () => {
  return (
    <Box className="flex flex-col bg-umbra p-3 w-full rounded-xl space-y-3">
      <Typography variant="h6" className="text-stieglitz">
        Max Strike
      </Typography>
      <Input
        disableUnderline
        placeholder="Enter Strike"
        onChange={() => {}}
        type="number"
        className="border border-mineshaft rounded-md px-2 bg-umbra w-full"
        classes={{ input: 'text-white text-xs text-right py-2' }}
      />
    </Box>
  );
};

export default MaxStrikeInput;
