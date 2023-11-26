import { useState } from 'react';

import { Button } from '@dopex-io/ui';

import UserDepositGrid from 'components/rdpx-v2/Body/StrategyVault/UserDepositGrid';
import QuickLink from 'components/rdpx-v2/QuickLink';
import DepositHistory from 'components/rdpx-v2/Tables/DepositHistory';
import RedeemRequests from 'components/rdpx-v2/Tables/RedeemRequests';
import UserRedeemRequestsHistory from 'components/rdpx-v2/Tables/UserRedeemRequestsHistory';
import Typography2 from 'components/UI/Typography2';

import { quickLinks } from 'constants/rdpx';

const actions = [
  'redeemRequests',
  'redemptionHistory',
  'depositHistory',
] as const;
type ActionType = (typeof actions)[number];

const BUTTON_LABELS: { [key in ActionType]: string } = {
  redeemRequests: 'Pending Redemptions',
  redemptionHistory: 'Redemptions',
  depositHistory: 'Deposits',
};

const StrategyVaultBody = () => {
  const [active, setActive] = useState<string>('Redeem Requests');

  const handleClick = (e: any) => {
    setActive(e.target.textContent);
  };

  return (
    <div className="bg-cod-gray rounded-xl w-full h-fit p-3 space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.strategyVault} />
      </div>
      <UserDepositGrid />
      <div className="space-y-1">
        <div className="flex w-full">
          {actions.map((label: ActionType, index) => {
            return (
              <Button
                key={index}
                size="xsmall"
                className="rounded-md bg-transparent hover:bg-transparent"
                onClick={handleClick}
              >
                <Typography2
                  variant="subtitle2"
                  color={
                    active === BUTTON_LABELS[label] ? 'white' : 'stieglitz'
                  }
                >
                  {BUTTON_LABELS[label]}
                </Typography2>
              </Button>
            );
          })}
        </div>
        {active === 'Pending Redemptions' ? <RedeemRequests /> : null}
        {active === 'Redemptions' ? <UserRedeemRequestsHistory /> : null}
        {active === 'Deposits' ? <DepositHistory /> : null}
      </div>
    </div>
  );
};

export default StrategyVaultBody;
