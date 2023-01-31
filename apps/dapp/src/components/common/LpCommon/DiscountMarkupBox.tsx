import React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';

import Typography from 'components/UI/Typography';

import InfoBox from 'components/common/LpCommon/InfoBox';

interface Props {
  data: string;
  dataToolTip: string;
  rawAmount: string;
  setRawAmount: Function;
  amount: number;
}

const DiscountMarkupBox = ({
  data,
  dataToolTip,
  rawAmount,
  setRawAmount,
  amount,
}: Props) => {
  const amountInvalid: boolean =
    amount < 1 || amount >= 100 || rawAmount.includes('.');

  return (
    <React.Fragment>
      <Box className="mb-4 px-1 bg-umbra rounded-lg">
        <Box className="flex flex-row mb-2 justify-between">
          <InfoBox heading={data} tooltip={dataToolTip} />
          <Typography variant="h6" color="stieglitz" className="mr-2">
            1% - 100%
          </Typography>
        </Box>
        <Input
          disableUnderline
          placeholder="1% - 100%"
          type="number"
          className={`text-sm text-white rounded-md pr-2 w-full border 
            ${amountInvalid ? 'border-[#d32f2f]' : 'border-carbon'}`}
          value={rawAmount}
          onChange={(e) => setRawAmount(e.target.value)}
          classes={{ input: 'text-right' }}
        />
      </Box>
      <Box className="flex justify-end mr-3 -mt-4 pb-0">
        {amountInvalid && (
          <FormHelperText className="text-3xs" error={amountInvalid}>
            Invalid amount
          </FormHelperText>
        )}
      </Box>
    </React.Fragment>
  );
};

export default DiscountMarkupBox;
