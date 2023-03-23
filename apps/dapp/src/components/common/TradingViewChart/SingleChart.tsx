import { AdvancedChart } from 'react-tradingview-embed';

export interface SingleChartProps {
  symbol: string;
}

const SingleChart = (props: SingleChartProps) => {
  return (
    <AdvancedChart
      widgetProps={{
        theme: 'dark',
        symbol: props.symbol,
        height: '35rem',
        interval: '1m',
        style: '9',
        range: '1D',
      }}
    />
  );
};

export default SingleChart;
