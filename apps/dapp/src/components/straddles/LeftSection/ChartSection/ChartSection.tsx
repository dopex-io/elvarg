import PriceChart from 'components/ssov-beta/PriceChart';

import ChartDashboard from './ChartDashboard';
import ChartGraph from './ChartGraph';

const ChartSection = () => {
  return (
    <div className="w-full h-full flex-[0.7]">
      <div className="h-full w-full flex flex-col">
        <ChartDashboard />
        <PriceChart market="ARB" />
      </div>
    </div>
  );
};

export default ChartSection;
