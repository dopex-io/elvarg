import dynamic from 'next/dynamic';
import { SingleChartProps } from './SingleChart';

type ChartType = {
  poolAddress: string;
};

// @ts-ignore
const Chart = dynamic<ChartType>(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const DexScreenerChart = (props: SingleChartProps) => {
  return <Chart poolAddress={props.poolAddress} />;
};

export default DexScreenerChart;
