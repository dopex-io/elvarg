import { value AdvancedChart } from 'react-tradingview-embed';

const SingleChart = () => {
  return (
    <AdvancedChart
      widgetProps={{ theme: 'dark', symbol: 'ETHUSD', height: 400 }}
    />
  );
};

export default SingleChart;
