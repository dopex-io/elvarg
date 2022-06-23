import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

import Typography from 'components/UI/Typography';
import CallsIcon from 'svgs/icons/CallsIcon';
import PutsIcon from 'svgs/icons/PutsIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

interface IBarData {
  deposits: number | string;
  unlocked: number | string;
  activeCollateral: number | string;
  strike: number | string;
}

interface LiquidityBarGraphProps {
  data: IBarData[];
  width: number;
  height: number;
  header: { [key: string]: string | number };
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { data, height, header } = props;

  const [focusBar, setFocusBar] = useState<any>(null);

  const { selectedPool } = useContext(AtlanticsContext);

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
          <Typography variant="h6" className="align-center" color="stieglitz">
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
            barSize={50}
            layout="vertical"
            margin={{
              top: 5,
              right: 0,
              left: 7,
              bottom: 5,
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
              } else {
                setFocusBar(null);
              }
            }}
          >
            <Tooltip
              wrapperClassName="rounded-xl flex text-right h-auto"
              cursor={{
                fill: '#151515',
              }}
            />
            <XAxis type="number" dataKey="deposits" hide />
            <XAxis type="number" dataKey="unlocked" hide />
            <XAxis type="number" dataKey="activeCollateral" hide />
            <YAxis
              type="category"
              dataKey="strike"
              orientation="right"
              tickSize={[selectedPool?.strikes].length}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Bar
              name="Deposits"
              dataKey="deposits"
              stackId="a"
              fill="#1E1E1E"
              label="deposits"
              barSize={100}
              radius={[5, 0, 0, 5]}
              z="1"
            >
              <LabelList
                dataKey="deposits"
                position="insideLeft"
                fill="white"
              />
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#3E3E3E' : '#3E3E3E'}
                />
              ))}
            </Bar>
            <Bar
              name="Active Collateral"
              dataKey="activeCollateral"
              stackId="a"
              fill="#2D2D2D"
              label="activeCollateral"
              barSize={100}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#8E8E8E' : '#2D2D2D'}
                />
              ))}
            </Bar>
            <Bar
              name="Unlocked Collateral"
              dataKey="unlocked"
              stackId="a"
              fill="#1E1E1E"
              label="unlockedCollateral"
              barSize={100}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#C4C4C4' : '#1E1E1E'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LiquidityBarGraph;
