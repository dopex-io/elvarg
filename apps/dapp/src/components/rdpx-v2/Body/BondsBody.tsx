import React, { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Button } from '@dopex-io/ui';

import Charts from '../Charts';
import DelegatePositions from '../Tables/DelegatePositions';
import UserBonds from '../Tables/UserBonds';

const actions = ['bonds', 'delegatePositions', 'history'] as const;
type ActionType = (typeof actions)[number];

const BUTTON_LABELS: { [key in ActionType]: string } = {
  bonds: 'Bonds',
  delegatePositions: 'Delegate Positions',
  history: 'History',
};

const BondsBody = () => {
  const [active, setActive] = useState<string>('Bonds');

  const handleClick = useCallback((e: any) => {
    console.log(e.target.textContent);
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="flex flex-col w-full sm:w-full lg:w-3/4 h-full">
      <Charts />
      <ButtonGroup className="flex w-full">
        {actions.map((label: ActionType, index) => (
          <Button
            key={index}
            size="small"
            className={`rounded-md bg-transparent hover:bg-transparent ${
              active === BUTTON_LABELS[actions[index]]
                ? 'text-white'
                : 'text-[#8E8E8F]'
            }`}
            onClick={handleClick}
          >
            <span className="text-md">{BUTTON_LABELS[label]}</span>
          </Button>
        ))}
      </ButtonGroup>
      {active === 'Bonds' ? <UserBonds /> : null}
      {active === 'Delegate Positions' ? <DelegatePositions /> : null}
    </div>
  );
};

export default BondsBody;
