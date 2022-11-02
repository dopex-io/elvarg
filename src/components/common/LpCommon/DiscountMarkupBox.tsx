import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';

import { Typography } from 'components/UI';

import InfoBox from 'components/common/LpCommon/InfoBox';

interface Props {
  data: string;
  dataToolTip: string;
  rawAmount: string;
  setRawAmount: Function;
  dataText: string;
  amount: number;
}

const DiscountMarkupBox = ({
  data,
  dataToolTip,
  rawAmount,
  setRawAmount,
  dataText,
  amount,
}: Props) => {
  const amountInvalid: boolean =
    amount < 1 || amount >= 100 || rawAmount.includes('.');

  return (
    <Box>
      <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-1 pb-1 flex flex-row items-center mt-3">
        <Box className="flex flex-row h-10 p-1 w-64">
          <InfoBox heading={data} tooltip={dataToolTip} />
        </Box>
        <Input
          disableUnderline
          id="notionalSize"
          name="notionalSize"
          placeholder="0"
          type="number"
          className={`text-xl text-white ml-2 font-mono w-[11.3rem] rounded-md pr-2 
            lg:w-[9.3rem] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px]
            ${amountInvalid ? 'border-[#d32f2f]' : 'border-[#545454]'}`}
          value={rawAmount}
          onChange={(e) => setRawAmount(e.target.value)}
          classes={{ input: 'text-right' }}
        />
        <Box className="flex">
          <Typography variant="h6" className="text-sm pl-1 pt-2">
            %
          </Typography>
        </Box>
      </Box>
      <Box className="flex justify-end mr-6 -mt-1.5">
        <FormHelperText className="text-xs" error={amountInvalid}>
          Invalid amount
        </FormHelperText>
      </Box>
      <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 mb-2 -mt-2.5">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">{dataText}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default DiscountMarkupBox;
