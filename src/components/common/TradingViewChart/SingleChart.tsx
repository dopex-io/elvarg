import { AdvancedChart } from 'react-tradingview-embed';

const SingleChart = () => {
  return <AdvancedChart widgetProps={{ theme: 'dark', symbol: 'ETHUSD' }} />;
};

export default SingleChart;
