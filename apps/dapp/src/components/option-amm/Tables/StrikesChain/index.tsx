import FilterPanel from 'components/option-amm/Tables/StrikesChain/FilterPanel';
import StrikesTable from 'components/option-amm/Tables/StrikesChain/StrikesTable';

const StrikesChain = ({ market }: { market: string }) => {
  return (
    <div className="bg-cod-gray rounded-lg pt-3">
      <div className="relative h-12 mx-3">
        <FilterPanel market={market} />
      </div>
      <StrikesTable market={market} />
    </div>
  );
};

export default StrikesChain;
