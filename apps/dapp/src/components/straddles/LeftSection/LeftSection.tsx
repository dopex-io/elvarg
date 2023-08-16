import PriceChart from 'components/ssov-beta/PriceChart';

import ChartSection from './ChartSection/ChartSection';
import PositionsTable from './PositionsTable/PositionsTable';
import StrikeInformation from './StrikeInformation';

const LeftSection = () => {
  return (
    <div className="w-3/4 h-full p-4">
      <div className="h-full w-full flex flex-col space-y-6">
        <ChartSection />
        <StrikeInformation
          strike="1850.8"
          availableOptions="92.3"
          liquidity="100k"
          earnings="21.1k"
          utilization="33.1%"
          iv="50"
          delta="-1.34"
          vega="0.002"
          gamma="3.11"
          theta="-0.001"
        />
        <PositionsTable />
      </div>
    </div>
  );
};

export default LeftSection;
