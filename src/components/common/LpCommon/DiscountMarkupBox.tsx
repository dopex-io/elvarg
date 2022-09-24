import React from 'react';
import { Box, Input } from '@mui/material';
import { Typography } from 'components/UI';
import InfoBox from './InfoBox';

interface Props {
  data: string;
  dataToolTip: string;
  rawAmount: string;
  setRawAmount: Function;
  dataText: string;
}

const DiscountMarkupBox = ({
  data,
  dataToolTip,
  rawAmount,
  setRawAmount,
  dataText,
}: Props) => {
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
          className="text-xl text-white ml-2 font-mono w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pr-2"
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
      <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 mb-2">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">{dataText}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default DiscountMarkupBox;
