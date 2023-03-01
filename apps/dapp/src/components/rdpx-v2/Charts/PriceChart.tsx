// import { useMemo, useState } from 'react';
// import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import {
  // LineChart,
  AreaChart,
  Area,
  // Line,
  XAxis,
  YAxis,
  // CartesianGrid,
  // Tooltip as RechartsTooltip,
  // Legend,
  ResponsiveContainer,
} from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import Typography from 'components/UI/Typography';

// import formatAmount from 'utils/general/formatAmount';
// import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const areaData = [
  {
    name: '22/01',
    amt: 2400,
  },
  {
    name: '23/01',
    amt: 2210,
  },
  {
    name: '24/01',
    amt: 2290,
  },
  {
    name: '25/01',
    amt: 2000,
  },
  {
    name: '26/01',
    amt: 2181,
  },
  {
    name: '27/01',
    amt: 2500,
  },
  {
    name: '28/01',
    amt: 2100,
  },
];

interface LiquidityBarGraphProps {
  data: any[];
  width: number;
  height: number;
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { /*data,*/ height } = props;

  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex space-x-2 justify-start py-2 px-3">
        <Typography variant="h6" className="align-center" color="stieglitz">
          DSC Price
        </Typography>
        <Tooltip title="DSC price over time">
          <InfoOutlinedIcon className="fill-current text-stieglitz w-[1.2rem]" />
        </Tooltip>
      </Box>
      <Box className="flex justify-around">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            width={500}
            height={400}
            data={areaData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis dataKey="name" hide />
            <YAxis hide />
            {/* <RechartsTooltip
              contentStyle={{
                borderColor: '#2D2D2D',
                backgroundColor: '#2D2D2D',
                color: '#2D2D2D',
              }}
              wrapperClassName="rounded-xl flex text-right h-auto"
              cursor={{
                fill: '#151515',
              }}
            /> */}
            <Area
              type="linear"
              dataKey="amt"
              stroke="#C3F8FF"
              fill="url(#colorUv1)"
              className="blur-sm cursor-not-allowed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LiquidityBarGraph;
