import FilterPanel from './FilterPanel';
import StrikesTable from './StrikeTable';

const StrikesChain = ({ reload }: { reload: Function }) => {
  return (
    <div className="bg-cod-gray rounded-lg pt-3">
      <div className="ml-2">
        <FilterPanel reload={reload} />
      </div>
      <StrikesTable />
    </div>
  );
};

export default StrikesChain;
