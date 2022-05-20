import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box className="bg-slate-900 p-4 rounded">
        <p>{`$${payload[0].value}`}</p>
        <p>{new Date(payload[0].payload.timestamp * 1000).toUTCString()}</p>
      </Box>
    );
  }

  return null;
};

// @ts-ignore TODO: FIX
const Chart = ({ data }) => {
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
        }}
      >
        <Tooltip content={<CustomTooltip />} />
        <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.5%" stopColor="#002eff" stopOpacity={0.8} />
            <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke="#22e1ff"
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
