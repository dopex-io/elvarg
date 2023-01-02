import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import Typography from 'components/UI/Typography';

interface Props {
  tokenSymbol: string;
  inputAmount: string | number;
  percentageReq: string;
  handleChangeRecalculation: () => void;
  index: number;
}

const InputRow = (props: Props) => {
  const { tokenSymbol, inputAmount, percentageReq, handleChangeRecalculation } =
    props;

  return (
    <Box className="mt-3">
      <Box className="flex justify-between space-x-3">
        <Typography
          variant="caption"
          className="p-1 w-1/6 my-auto bg-carbon rounded-[0.2rem] text-center"
          color="stieglitz"
        >
          {tokenSymbol}
        </Typography>
        <Box className="flex justify-between bg-mineshaft w-1/2 rounded-md px-2">
          <Typography variant="h6" className="my-1">
            {inputAmount}
          </Typography>
          <Typography variant="h6" className="my-1" color="stieglitz">
            {percentageReq}%
          </Typography>
        </Box>
        <Box className="w-1/4">
          <Input
            disableUnderline={true}
            type="number"
            className="border-mineshaft border border-1 rounded-md pl-2 pr-2"
            classes={{ input: 'text-white text-xs text-right' }}
            value={inputAmount}
            placeholder="0"
            onChange={handleChangeRecalculation}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InputRow;
