import { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import Deposit from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/Deposit';
import Withdraw from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/Withdraw';

const BUTTON_LABELS = ['Deposit', 'Withdraw'];

const StrategyVaultPanel = () => {
  const [active, setActive] = useState<string>('Deposit');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="p-1 bg-cod-gray rounded-xl space-y-1 px-2 pb-2">
      <ButtonGroup className="flex w-full">
        {BUTTON_LABELS.map((label, index) => (
          <button
            key={index}
            className={`border-0 m-1 mr-2 pb-0 transition ease-in-out duration-500 rounded-md bg-transparent hover:bg-transparent ${
              active === label ? 'text-white' : 'text-stieglitz'
            } hover:text-white`}
            onClick={handleClick}
          >
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </ButtonGroup>
      {active === 'Deposit' ? <Deposit /> : <Withdraw />}
    </div>
  );
};

export default StrategyVaultPanel;
