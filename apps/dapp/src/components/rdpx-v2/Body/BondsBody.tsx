import { useEffect, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Button } from '@dopex-io/ui';
import { useAccount } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import Charts from 'components/rdpx-v2/Charts';
import QuickLink from 'components/rdpx-v2/QuickLink';
import DelegatePositions from 'components/rdpx-v2/Tables/DelegatePositions';
import UserBonds from 'components/rdpx-v2/Tables/UserBonds';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { quickLinks } from 'constants/rdpx';

const actions = ['bonds', 'delegatePositions' /*, 'history'*/] as const;
type ActionType = (typeof actions)[number];

const BUTTON_LABELS: { [key in ActionType]: string } = {
  bonds: 'Bonds',
  delegatePositions: 'Delegate Positions',
  // history: 'History',
};

const BondsBody = () => {
  const { address: user = '0x' } = useAccount();

  const { rdpxV2CoreState, updateRdpxV2CoreState } = useRdpxV2CoreData({
    user,
  });
  const [active, setActive] = useState<string>('Bonds');

  const handleClick = (e: any) => {
    setActive(e.target.textContent);
  };

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.whitepaper} />
      </div>
      <div className=" bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">
              {formatBigint(rdpxV2CoreState.receiptTokenSupply)} rtETH
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              rtETH Supply
            </Typography2>
          </span>
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">
              {formatBigint(rdpxV2CoreState.rdpxSupply)}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              rDPX Supply
            </Typography2>
          </span>
        </div>
        <Charts />
      </div>
      <div className="space-y-1">
        <ButtonGroup className="flex w-full">
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
        </ButtonGroup>
        {active === 'Bonds' ? <UserBonds /> : null}
        {active === 'Delegate Positions' ? <DelegatePositions /> : null}
      </div>
    </div>
  );
};

export default BondsBody;
