import DepositRow from 'components/rdpx-v2/Body/StrategyVault/DepositRow';
import QuickLink from 'components/rdpx-v2/QuickLink';
import RedeemRequests from 'components/rdpx-v2/Tables/RedeemRequests';

import { quickLinks } from 'constants/rdpx';

const StrategyVaultBody = () => {
  return (
    <div className="bg-cod-gray rounded-xl w-full h-fit p-3 space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.strategyVault} />
      </div>
      <DepositRow />
      <RedeemRequests />
    </div>
  );
};

export default StrategyVaultBody;
