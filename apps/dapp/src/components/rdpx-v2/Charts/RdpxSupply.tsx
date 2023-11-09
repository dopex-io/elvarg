import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

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

import { getRdpxSuppliesDocument } from 'graphql/rdpx-v2';

import CustomTooltip from 'components/rdpx-v2/Charts/CustomTooltip';

import { DECIMALS_TOKEN } from 'constants/index';
import { DOPEX_RDPX_V2_SUBGRAPH_API_URL } from 'constants/subgraphs';

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
      rdpxSupply: number;
    }[]
  >([]);
  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  useEffect(() => {
    (async () => {
      if (!ethPriceInUsd) return;
      const rdpxSupplies = await queryClient
        .fetchQuery({
          queryKey: ['getRdpxSupplies'],
          queryFn: () =>
            request(DOPEX_RDPX_V2_SUBGRAPH_API_URL, getRdpxSuppliesDocument),
        })
        .then((res) => res.totalRdpxSupplies)
        .catch((_) => setData([]));

      const formatted =
        rdpxSupplies
          ?.sort((a, b) => a.transaction.timestamp - b.transaction.timestamp)
          .map((supply) => ({
            time: format(
              new Date(Number(supply.transaction.timestamp) * 1000),
              'dd LLL YYY',
            ),
            rdpxSupply: Number(formatUnits(supply.amount, DECIMALS_TOKEN)),
          })) || [];

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
    <div className="relative h-full">
      <h6 className="absolute top-3 left-3 text-xs text-stieglitz align-center">
        rDPX Supply
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
            content={<CustomTooltip datapointKeys={['rdpxSupply']} />}
          />
          <Area
            type="natural"
            strokeWidth={1}
            dataKey="rdpxSupply"
            stroke="#7B61FF"
            fill="url(#pattern)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiquidityBarGraph;
