import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

const Sparkline = ({ data }: any) => {
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{}}>
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

export default Sparkline;
