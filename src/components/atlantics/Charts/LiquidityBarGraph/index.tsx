import Box from '@mui/material/Box';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from 'recharts';

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
  const { data, height, header } = props;

  console.log(' THE DATA ', data);

  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex justify-between p-3">
        <Box className="flex space-x-2 justify-start">
          {header['type'] === 'CALLS' ? (
            // @TODO Fill is hard coded
            <CallsIcon fill="#8aff95" className="my-auto" />
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
      <Box className="flex justify-around">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            barCategoryGap="10%"
            barSize={25}
            layout="vertical"
            margin={{
              top: 20,
              right: 0,
              left: 10,
              bottom: 5,
            }}
          >
            {/* Tried overlapping the graphs */}
            <XAxis type="number" dataKey="deposits" hide />
            <XAxis type="number" dataKey="unlocked" hide />
            <XAxis type="number" dataKey="activeCollateral" hide />
            <YAxis
              type="category"
              dataKey="strike"
              orientation="right"
              tickSize={5}
              axisLine={false}
              tickLine={false}
              z="2"
            />
            <Tooltip />
            <Bar
              dataKey="activeCollateral"
              stackId="a"
              fill="#3E3E3E"
              label="pv"
              barSize={50}
            />
            <Bar dataKey="unlocked" stackId="a" fill="#FFFFFF" barSize={50} />
            <Bar dataKey="deposits" stackId="a" fill="#1E1E1E" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LiquidityBarGraph;
