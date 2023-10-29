import QuickLink from 'components/rdpx-v2/QuickLink';

import { quickLinks } from 'constants/rdpx';

import DepositRow from './DepositRow';

const StrategyVaultBody = () => {
  return (
    <div className="bg-cod-gray rounded-xl w-full h-fit p-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.strategyVault} />
      </div>
      <DepositRow />
    </div>
  );
};

export default StrategyVaultBody;
