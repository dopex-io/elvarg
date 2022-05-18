import Box from '@mui/material/Box';
import { BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

import Typography from 'components/UI/Typography';
import CallsIcon from 'svgs/icons/CallsIcon';
import PutsIcon from 'svgs/icons/PutsIcon';

interface LiquidityBarGraphProps {
  data: any[];
  width: number;
  height: number;
  header: { [key: string]: string | number };
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { data, width, height, header } = props;

  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex justify-between">
        <Box className="flex space-x-2 justify-start mb-3">
          {header['strategy'] === 'call' ? (
            <CallsIcon className="my-auto" />
          ) : (
            <PutsIcon className="my-auto" />
          )}
          <Typography variant="h6" className="text-stieglitz align-center">
            Available ({header['collateral']})
          </Typography>
        </Box>
        <Box className="inline-block">
          <Typography variant="h6">Max Strike</Typography>
        </Box>
      </Box>

      <Box className="relative">
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 10,
            bottom: 5,
          }}
          barCategoryGap="10%"
          barSize={25}
          layout="vertical"
        >
          <XAxis type="number" dataKey="borrowed" />
          <YAxis
            type="category"
            dataKey="strike"
            orientation="right"
            tickSize={5}
          />
          <Tooltip />
          <Bar dataKey="borrowed" stackId="a" fill="#3E3E3E" label="pv" />
          <Bar dataKey="available" stackId="a" fill="#1E1E1E" />
        </BarChart>
      </Box>
    </Box>
  );
};

export default LiquidityBarGraph;
