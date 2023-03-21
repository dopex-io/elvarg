import { AdvancedChart } from 'react-tradingview-embed';

interface Props {
  symbol: string;
}

const SingleChart = (props: Props) => {
  return (
    <AdvancedChart
      widgetProps={{
        theme: 'dark',
        symbol: props.symbol,
        height: 500,
        interval: '1m',
        style: '9',
        range: '1D',
      }}
    />
  );
};

export default SingleChart;
