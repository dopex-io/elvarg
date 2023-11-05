import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import request from 'graphql-request';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import queryClient from 'queryClient';

import { getSuppliesDocument } from 'graphql/rdpx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DOPEX_RDPX_SUBGRAPH_API_URL } from 'constants/subgraphs';

interface LiquidityLineChartProps {
  data: any[];
  width: number;
  height: number;
}

const RewardsChart = (props: LiquidityLineChartProps) => {
  const { height, width } = props;

  const [data, setData] = useState<
    {
      time: string;
      dscTotalSupplies: number;
      rdpxTotalSupplies: number;
    }[]
  >();

  useEffect(() => {
    (async () => {
      const dscSupplies = await queryClient
        .fetchQuery({
          queryKey: ['getSupplies'],
          queryFn: () =>
            request(DOPEX_RDPX_SUBGRAPH_API_URL, getSuppliesDocument),
        })
        .then((res) => [res.rdpxSupplies, res.dscSupplies]);

      const formatted = dscSupplies[1]?.map((obj, i) => ({
        time: format(new Date(Number(obj.id) * 1000), 'dd LLL YYY'),
        rdpxTotalSupplies: Number(
          getUserReadableAmount(dscSupplies[0]?.[i]?.totalSupply, 18).toFixed(
            3,
          ),
        ),
        dscTotalSupplies: Number(
          getUserReadableAmount(dscSupplies[1]?.[i]?.totalSupply, 18).toFixed(
            3,
          ),
        ),
      }));

      setData(formatted);
    })();
  }, []);

  return (
    <div className="relative h-full">
      <h6 className="absolute z-10 text-xs text-stieglitz align-center">
        Rewards History
      </h6>
      <ResponsiveContainer width="100%" height={height} className="top-0">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <defs>
            <linearGradient id="colorUv4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.5%" stopColor="#C3F8FF" stopOpacity={0.3} />
              <stop offset="99.5%" stopColor="#C3F8FF" stopOpacity={0} />
            </linearGradient>
            <pattern
              id="pattern2"
              x="0"
              y="0"
              width={0.0125}
              height={0.05}
              fill="url(#colorUv4)"
            >
              <circle cx="1" cy="1" r="1" />
            </pattern>
          </defs>
          <Area
            type="natural"
            strokeWidth={1}
            dataKey="dscTotalSupplies"
            stroke="#C3F8FF"
            fill="url(#pattern2)"
            dot={false}
            className="hover:cursor-not-allowed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RewardsChart;
