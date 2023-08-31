import FilterPanel from './FilterPanel';
import StrikesTable from './StrikeTable';

const StrikesChain = () => {
  return (
    <div className="bg-cod-gray rounded-lg pt-3">
      <div className="ml-2">
        <FilterPanel />
      </div>
      <StrikesTable />
    </div>
  );
};

export default StrikesChain;
