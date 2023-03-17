import dynamic from 'next/dynamic';

type ChartType = {
  symbol: string;
};

// @ts-ignore
const Chart = dynamic<ChartType>(() => import('./SingleChart.tsx'), {
  ssr: false,
});

interface Props {
  symbol: string;
}

const TradingViewChart = (props: Props) => {
  return <Chart symbol={props.symbol} />;
};

export default TradingViewChart;
