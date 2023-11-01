import React, { useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Button } from '@dopex-io/ui';

import Typography2 from 'components/UI/Typography2';

import { quickLinks } from 'constants/rdpx';

import Charts from '../Charts';
import QuickLink from '../QuickLink';
import DelegatePositions from '../Tables/DelegatePositions';
import UserBonds from '../Tables/UserBonds';

const actions = ['bonds', 'delegatePositions' /*, 'history'*/] as const;
type ActionType = (typeof actions)[number];

const BUTTON_LABELS: { [key in ActionType]: string } = {
  bonds: 'Bonds',
  delegatePositions: 'Delegate Positions',
  // history: 'History',
};

const BondsBody = () => {
  const [active, setActive] = useState<string>('Bonds');

  const handleClick = (e: any) => {
    setActive(e.target.textContent);
  };

  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <div className="flex w-full">
        <QuickLink {...quickLinks.whitepaper} />
      </div>
      <div className=" bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">Label 1</Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Description 1
            </Typography2>
          </span>
          <span className="w-1/2 p-3 flex flex-col space-y-1">
            <Typography2 variant="caption">Label 2</Typography2>
            <Typography2 variant="caption" color="stieglitz">
              Description 2
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
