import {
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const PriceChart = ({ maxPrice }: any) => {
  const chartDataStep = Number(maxPrice) / 5;

  const data = [0, 1, 2, 3, 4, 5].map((n) => {
    return {
      price: Number((n * chartDataStep).toFixed(2)),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart className="mt-4" data={data}>
        <defs>
          <linearGradient id="color" x1="0.7" y1="0.5" x2="0.9" y2="1.2">
            <stop offset="5%" stopColor="#22E1FF" stopOpacity={1} />
            <stop offset="60%" stopColor="#002EFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} opacity={0.2} />
        <YAxis
          orientation="right"
          axisLine={false}
          tickLine={false}
          type="number"
          domain={[0, Number(maxPrice)]}
          tickCount={3}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#002EFF"
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
