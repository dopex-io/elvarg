import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import request from 'graphql-request';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import queryClient from 'queryClient';

import { getReceiptTokenSupplyDocument } from 'graphql/rdpx-v2';

import CustomTooltip from 'components/rdpx-v2/Charts/CustomTooltip';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from 'constants/subgraphs';

interface LiquidityLineChartProps {
  width: number;
  height: number;
}

const PriceChart = (props: LiquidityLineChartProps) => {
  const { height } = props;

  const [data, setData] = useState<
    {
      time: string;
      rtTotalSupply: number;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const rtSupplies = await queryClient
        .fetchQuery({
          queryKey: ['getReceiptTokenSupplies'],
          queryFn: () =>
            request(
              DOPEX_RDPX_V2_SUBGRAPH_API_URL,
              getReceiptTokenSupplyDocument,
            ),
        })
        .then((res) => res.totalReceiptTokenSupplies)
        .catch((_) => setData([]));

      const formatted =
        rtSupplies
          ?.sort((a, b) => a.transaction.timestamp - b.transaction.timestamp)
          .map((supply) => ({
            time: format(
              new Date(Number(supply.transaction.timestamp) * 1000),
              'dd LLL YYY',
            ),
            rtTotalSupply: Number(formatBigint(supply.amount, DECIMALS_TOKEN)),
          })) || [];

      setData(formatted);
    })();
  }, []);

  return (
    <div className="relative h-full">
      <h6 className="absolute top-3 left-3 text-xs text-stieglitz align-center">
        rtETH Supply
      </h6>
      <ResponsiveContainer width="100%" height={height} className="top-6">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderColor: '#2D2D2D',
              backgroundColor: '#2D2D2D',
              color: '#2D2D2D',
            }}
            wrapperClassName="rounded-xl flex text-right h-auto"
            cursor={{
              fill: '#151515',
            }}
            content={<CustomTooltip datapointKeys={['rtTotalSupply']} />}
          />
          <defs>
            <linearGradient id="colorUv4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.5%" stopColor="#C3F8FF" stopOpacity={0.3} />
              <stop offset="99.5%" stopColor="#C3F8FF" stopOpacity={0} />
            </linearGradient>
            <pattern
              id="pattern2"
              x="0"
              y="0"
              width={0.025}
              height={0.05}
              fill="url(#colorUv4)"
            >
              <circle cx="1" cy="1" r="1" />
            </pattern>
          </defs>
          <Area
            type="natural"
            strokeWidth={1}
            dataKey="rtTotalSupply"
            stroke="#C3F8FF"
            fill="url(#pattern2)"
            dot={false}
          />
          <defs>
            <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.5%" stopColor="#7B61FF" stopOpacity={0.6} />
              <stop offset="99.5%" stopColor="#7B61FF" stopOpacity={0} />
            </linearGradient>
            <pattern
              id="pattern"
              x="0"
              y="0"
              width={0.025}
              height={0.05}
              fill="url(#colorUv2)"
            >
              <circle cx="1" cy="1" r="1" />
            </pattern>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
