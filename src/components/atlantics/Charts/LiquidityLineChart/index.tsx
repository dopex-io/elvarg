import Box from '@mui/material/Box';
import {
  LineChart,
  XAxis,
  YAxis,
  // Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts';

import Typography from 'components/UI/Typography';

import LegendIcon from 'svgs/icons/LegendIcon';

interface LiquidityLineChartProps {
  data: any[];
  width: number;
  height: number;
}

const LiquidityLineChart = (props: LiquidityLineChartProps) => {
  const { data, height } = props;
  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex space-x-2 justify-start mb-3">
        <LegendIcon color="#22E1FF" className="my-auto" />
        <Typography variant="h6" className="align-center" color="stieglitz">
          Deposits
        </Typography>
        <LegendIcon color="#7B61FF" className="my-auto" />
        <Typography variant="h6" color="stieglitz">
          Unlocks
        </Typography>
      </Box>
      <Box className="h-full">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            className="py-3"
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 20,
            }}
          >
            {/* <Tooltip
              wrapperClassName="rounded-xl flex text-right h-auto"
              cursor={{
                fill: '#151515',
              }}
              formatter={(value: number) => '$' + value}
            /> */}
            <XAxis ticks={['13/05', '20/05', '27/05']} hide dataKey="name" />
            <YAxis axisLine={false} dataKey="deposits" hide />
            <Line
              type="monotone"
              dataKey="unlocks"
              stroke="#7B61FF"
              dot={false}
              className="blur-sm"
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#22E1FF"
              dot={false}
              className="blur-sm"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LiquidityLineChart;
