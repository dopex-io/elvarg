import { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import Bond from 'components/rdpx-v2/AsidePanel/BondPanel/Bond';
import Delegate from 'components/rdpx-v2/AsidePanel/BondPanel/Delegate';

const BUTTON_LABELS = ['Bond', 'Delegate'];

const BondPanel = () => {
  const [active, setActive] = useState<string>('Bond');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="space-y-1 bg-cod-gray rounded-xl p-3">
      <ButtonGroup className="flex w-full">
        {BUTTON_LABELS.map((label, index) => (
          <button
            key={index}
            className={`flex border-0 mr-2 transition ease-in-out duration-500 rounded-md bg-transparent hover:bg-transparent ${
              active === label ? 'text-white' : 'text-stieglitz'
            } hover:text-white`}
            onClick={handleClick}
          >
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </ButtonGroup>
      {active === 'Bond' ? <Bond /> : <Delegate />}
    </div>
  );
};

export default BondPanel;
