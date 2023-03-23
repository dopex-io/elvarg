import dynamic from 'next/dynamic';
import { SingleChartProps } from './SingleChart';

type ChartType = {
  symbol: string;
};

// @ts-ignore
const Chart = dynamic<ChartType>(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const TradingViewChart = (props: SingleChartProps) => {
  return <Chart symbol={props.symbol} />;
};

export default TradingViewChart;
