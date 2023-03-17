import { AdvancedChart } from 'react-tradingview-embed';

interface Props {
  symbol: string;
}

const SingleChart = (props: Props) => {
  return (
    <AdvancedChart
      widgetProps={{ theme: 'dark', symbol: props.symbol, height: 400 }}
    />
  );
};

export default SingleChart;
