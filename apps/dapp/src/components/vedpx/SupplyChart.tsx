import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black p-3 rounded-md shadow-2xl">
        <p className="text-sm text-stieglitz">veDPX Supply</p>
        <p className="text-wave-blue">{payload[0]?.value} veDPX</p>
        <p className="text-wave-blue">
          {format(payload[0]?.payload.timestamp * 1000, 'do LLL')}
        </p>
      </div>
    );
  }

  return null;
};

const SupplyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const currentTime = Date.now() / 1000;
    const from = Math.floor(currentTime - 86400 * 180);

    axios
      .get(
        `https://2q7mh3riqd.execute-api.us-east-2.amazonaws.com/default/fetchCirculatingSupply?tokenSymbol=vedpx&from=${from}`
      )
      .then((res) =>
        setData(
          res.data.data
            .map((item: any) => {
              return {
                ...item,
                circulatingSupply: Number(
                  Number(item.circulatingSupply).toFixed(2)
                ),
              };
            })
            .filter((_: any, index: number) => {
              if (index % 71 === 1) return true;
              return false;
            })
        )
      );
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={200}
        height={60}
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.5%" stopColor="#002eff" stopOpacity={0.8} />
            <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="circulatingSupply"
          stroke="#22e1ff"
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SupplyChart;
