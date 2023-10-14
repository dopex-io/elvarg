import formatAmount from 'utils/general/formatAmount';

import StatBox from './StatBoxComponent';

const StatsSection = ({ data }: any) => {
  const { deposits, depositShare, claimAmount } = data;

  return (
    <div className="border-umbra rounded-xl border p-4 flex flex-col mb-4">
      <div className="flex flex-row justify-between mb-4">
        <StatBox
          Top={deposits !== null ? formatAmount(deposits) : '-'}
          Bottom={'Your Deposit'}
        />
        <StatBox
          Top={
            Number(depositShare) > 0 ? formatAmount(depositShare) + '%' : '-'
          }
          Bottom={<div className="flex flex-row items-center">Your Share</div>}
        />
      </div>
      <div className="flex flex-row justify-between">
        <StatBox
          Top={claimAmount !== null ? `${formatAmount(claimAmount)} DPX` : '-'}
          Bottom={
            <div className="flex flex-row items-center">
              Estimated DPX claim
            </div>
          }
        />
      </div>
    </div>
  );
};
export default StatsSection;
