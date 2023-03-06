import dynamic from 'next/dynamic';

// @ts-ignore
const Chart = dynamic(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const TradingViewChart = () => {
  return <Chart />;
};

export default TradingViewChart;
