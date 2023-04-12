import { useState, useEffect } from 'react';
import graphSdk from 'graphql/graphSdk';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import queryClient from 'queryClient';

import CustomTooltip from './CustomTooltip';

import { getUserReadableAmount } from 'utils/contracts';
import { format } from 'date-fns';

interface LiquidityBarGraphProps {
  data: any[];
  width: number;
  height: number;
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { /*data,*/ height } = props;

  const [data, setData] = useState<
    {
      time: string;
      price: number;
    }[]
  >();

  useEffect(() => {
    (async () => {
      const rdpxPrices = await queryClient
        .fetchQuery({
          queryKey: ['getRdpxPrice'],
          queryFn: () => graphSdk.getRdpxPrice(),
        })
        .then((res) => res.rdpxPrices);

      const formatted = rdpxPrices.map((obj) => ({
        time: format(new Date(Number(obj.id) * 1000), 'dd/LL'),
        price: getUserReadableAmount(obj.price, 8),
      }));

      setData(formatted);
    })();
  }, []);

  return (
    <div className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <div className="flex space-x-2 justify-start py-2 px-3">
        <h6 className="text-sm text-stieglitz align-center">RDPX Price</h6>
        <Tooltip title="RDPX Price over time">
          <InfoOutlinedIcon className="fill-current text-stieglitz w-[1.2rem]" />
        </Tooltip>
      </div>
      <div className="flex justify-around">
        <ResponsiveContainer width="100%" height={height}>
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
            <RechartsTooltip
              contentStyle={{
                borderColor: '#2D2D2D',
                backgroundColor: '#2D2D2D',
                color: '#2D2D2D',
              }}
              wrapperClassName="rounded-xl flex text-right h-fit"
              cursor={{
                fill: '#151515',
              }}
              content={<CustomTooltip isPriceChart />}
            />
            <defs>
              <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#22e1ff" stopOpacity={0.3} />
                <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              dataKey="price"
              stroke="#22e1ff"
              fill="url(#colorUv1)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiquidityBarGraph;
