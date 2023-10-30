import React, { useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Button } from '@dopex-io/ui';

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
      <div className=" bg-umbra rounded-xl divide-y divide-cod-gray">
        <div className="flex w-full divide-x divide-cod-gray">
          <span className="w-1/2 p-3 text-xs">
            <p>Label 1</p>
            <p className="text-stieglitz">Description 1</p>
          </span>
          <span className="w-1/2 p-3 text-xs">
            <p>Label 2</p>
            <p className="text-stieglitz">Description 2</p>
          </span>
        </div>
        <Charts />
      </div>
      <ButtonGroup className="flex w-full">
        {actions.map((label: ActionType, index) => {
          console.log(active, BUTTON_LABELS[label]);
          return (
            <Button
              key={index}
              size="xsmall"
              className="rounded-md bg-transparent hover:bg-transparent"
              onClick={handleClick}
            >
              <span
                className={`text-sm ${
                  active === BUTTON_LABELS[label]
                    ? 'text-white'
                    : 'text-stieglitz'
                }`}
              >
                {BUTTON_LABELS[label]}
              </span>
            </Button>
          );
        })}
      </ButtonGroup>
      {active === 'Bonds' ? <UserBonds /> : null}
      {active === 'Delegate Positions' ? <DelegatePositions /> : null}
    </div>
  );
};

export default BondsBody;
