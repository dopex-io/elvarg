import { useEffect, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import axios from 'axios';
import { format } from 'date-fns';
import request from 'graphql-request';
import {
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import queryClient from 'queryClient';

import { getPricesDocument } from 'graphql/rdpx';

import { getUserReadableAmount } from 'utils/contracts';

import { DOPEX_RDPX_SUBGRAPH_API_URL } from 'constants/subgraphs';

import CustomTooltip from './CustomTooltip';

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
      rdpxPrices: number;
      dscPrices: number;
    }[]
  >();
  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  useEffect(() => {
    (async () => {
      if (!ethPriceInUsd) return;
      const prices = await queryClient
        .fetchQuery({
          queryKey: ['getPrices'],
          queryFn: () =>
            request(DOPEX_RDPX_SUBGRAPH_API_URL, getPricesDocument),
        })
        .then((res) => [res.rdpxPrices, res.dscPrices]);

      const formatted = prices[0]?.map((obj, i) => ({
        time: format(new Date(Number(obj.id) * 1000), 'dd LLL YYY'),
        rdpxPrices: Number(
          (
            getUserReadableAmount(prices[0]?.[i]?.price, 8) * ethPriceInUsd
          ).toFixed(3),
        ),
        dscPrices: Number(
          (
            getUserReadableAmount(prices[1]?.[i]?.price, 8) * ethPriceInUsd
          ).toFixed(3),
        ),
      }));

      setData(formatted);
    })();
  }, [ethPriceInUsd]);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      )
      .then((payload) => {
        const _ethPriceInUsd = Number(payload.data.ethereum.usd);
        setEthPriceInUsd(_ethPriceInUsd);
      });
  }, []);

  return (
    <div className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra">
      <div className="flex space-x-2 justify-start py-2 px-3">
        <h6 className="text-sm text-stieglitz align-center">Price</h6>
        <Tooltip title="RDPX & DPXETH Prices over time">
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
              content={
                <CustomTooltip
                  datapointKeys={['rdpxPrices', 'dscPrices']}
                  isTypePrice
                />
              }
            />
            <defs>
              <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#7B61FF" stopOpacity={0.6} />
                <stop offset="99.5%" stopColor="#7B61FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              strokeWidth={2}
              dataKey="rdpxPrices"
              stroke="#7B61FF"
              fill="url(#colorUv1)"
              dot={false}
            />
            <defs>
              <linearGradient id="colorUv3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#C3F8FF" stopOpacity={0.3} />
                <stop offset="99.5%" stopColor="#C3F8FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              strokeWidth={2}
              dataKey="dscPrices"
              stroke="#C3F8FF"
              fill="url(#colorUv3)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiquidityBarGraph;
