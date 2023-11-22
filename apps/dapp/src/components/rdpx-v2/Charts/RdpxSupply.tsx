import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useAccount } from 'wagmi';

import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import CustomTooltip from 'components/rdpx-v2/Charts/CustomTooltip';

import { DECIMALS_TOKEN } from 'constants/index';

interface LiquidityBarGraphProps {
  width: number;
  height: number;
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { height } = props;

  const { address: user = '0x' } = useAccount();

  const [data, setData] = useState<
    {
      time: string;
      rdpxBurnt: number;
    }[]
  >([]);

  const { cumulativeRdpxBurned, updateRdpxBurned } = useSubgraphQueries({
    user,
  });

  useEffect(() => {
    (async () => {
      const formatted = cumulativeRdpxBurned.map((entry) => ({
        time: format(new Date(Number(entry.timestamp) * 1000), 'dd LLL YYY'),
        rdpxBurnt: Number(formatUnits(entry.amount, DECIMALS_TOKEN)),
      }));

      setData(formatted);
    })();
  }, [cumulativeRdpxBurned]);

  useEffect(() => {
    updateRdpxBurned();
  }, [updateRdpxBurned]);

  return (
    <div className="relative h-full">
      <h6 className="absolute top-3 left-3 text-xs text-stieglitz align-center">
        rDPX Burned
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
            content={<CustomTooltip datapointKeys={['rdpxBurnt']} />}
          />
          <Area
            type="monotone"
            strokeWidth={1}
            dataKey="rdpxBurnt"
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
