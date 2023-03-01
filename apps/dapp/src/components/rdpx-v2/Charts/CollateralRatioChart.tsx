import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MuiTooltip from '@mui/material/Tooltip';

import Typography from 'components/UI/Typography';

const areaData = [
  {
    name: '22/01',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '23/01',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '24/01',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '25/01',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '26/01',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '27/01',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '28/01',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

interface LiquidityLineChartProps {
  data: any[];
  width: number;
  height: number;
}

const PriceChart = (props: LiquidityLineChartProps) => {
  const { height } = props;

  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <Box className="flex space-x-2 justify-start py-2 px-3">
        <Typography variant="h6" className="align-center" color="stieglitz">
          Collateral Ratio Overtime
        </Typography>
        <MuiTooltip title="DSC:Alpha token ratio over time">
          <InfoOutlinedIcon className="fill-current text-stieglitz w-[1.2rem]" />
        </MuiTooltip>
      </Box>
      <Box className="h-full">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            width={500}
            height={400}
            data={areaData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" hide />
            <YAxis hide />
            {/* <Tooltip
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
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#22e1ff" stopOpacity={0.3} />
                <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="uv"
              stackId="1"
              stroke="#22e1ff"
              fill="url(#colorUv)"
              className="blur-sm cursor-not-allowed"
            />
            <defs>
              <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#C3F8FF" stopOpacity={0.3} />
                <stop offset="99.5%" stopColor="#C3F8FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="amt"
              stackId="1"
              stroke="#C3F8FF"
              fill="url(#colorUv1)"
              className="blur-sm cursor-not-allowed"
            />
            <defs>
              <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#7B61FF" stopOpacity={0.3} />
                <stop offset="99.5%" stopColor="#7B61FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="pv"
              stackId="1"
              stroke="#7B61FF"
              fill="url(#colorUv2)"
              className="blur-sm cursor-not-allowed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PriceChart;
