import Box from '@mui/material/Box';
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';

import Typography from 'components/UI/Typography';

import LegendIcon from 'svgs/icons/LegendIcon';

interface StatsLineChartProps {
  data: any[];
  width: number;
  height: number;
}

const StatsLineChart = (props: StatsLineChartProps) => {
  const { data, width, height } = props;
  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex space-x-2 justify-start mb-3">
        <LegendIcon color="#22E1FF" className="my-auto" />
        <Typography variant="h6" className="text-stieglitz align-center">
          Deposits
        </Typography>
        <LegendIcon color="#7B61FF" className="my-auto" />
        <Typography variant="h6" className="text-stieglitz">
          Unlocks
        </Typography>
      </Box>
      <Box className="relative">
        <LineChart
          width={width}
          height={height}
          data={data}
          className="py-3 absolute right-5"
        >
          <XAxis ticks={[1, 2, 3]} axisLine={false} />
          <YAxis ticks={[1, 2, 3]} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="Unlocks" stroke="#22E1FF" />
          <Line type="monotone" dataKey="Deposits" stroke="#7B61FF" />
        </LineChart>
      </Box>
    </Box>
  );
};

export default StatsLineChart;
