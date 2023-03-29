import dynamic from 'next/dynamic';

// @ts-ignore
const Chart = dynamic<ChartType>(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const TradingViewChart = () => {
  return <Chart symbol={'UNISWAP3ARBITRUM:WETHUSDC'} />;
};

export default TradingViewChart;
