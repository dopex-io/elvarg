import ChartSection from './ChartSection/ChartSection';
import PositionsTable from './PositionsTable/PositionsTable';

const LeftSection = () => {
  return (
    <div className="w-full h-full flex-[0.75] p-4">
      <div className="h-full w-full flex flex-col space-y-6">
        <ChartSection />
        <PositionsTable />
      </div>
    </div>
  );
};

export default LeftSection;
