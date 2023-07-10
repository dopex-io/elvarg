import FilterPanel from './FilterPanel';
import StrikesTable from './StrikeTable';

const StrikesChain = ({ market }: { market: string }) => {
  return (
    <div className="space-y-2 bg-cod-gray rounded-lg pt-3">
      <div className="relative h-12 mx-3">
        <FilterPanel market={market} />
      </div>
      <StrikesTable market={market} />
    </div>
  );
};

export default StrikesChain;
