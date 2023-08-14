import dynamic from 'next/dynamic';

import { SingleChartProps } from './SingleChart';

type ChartType = {
  poolAddress: string;
  className?: string;
};

// @ts-ignore TODO FIX
const Chart = dynamic<ChartType>(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const DexScreenerChart = (props: SingleChartProps) => {
  return <Chart {...props} />;
};

export default DexScreenerChart;
