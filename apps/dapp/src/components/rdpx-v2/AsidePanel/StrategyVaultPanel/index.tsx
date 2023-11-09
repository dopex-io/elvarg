import { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import Deposit from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/Deposit';
import Redeem from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel/Redeem';
import Typography2 from 'components/UI/Typography2';

const BUTTON_LABELS = ['Deposit', 'Redeem'];

const StrategyVaultPanel = () => {
  const [active, setActive] = useState<string>('Deposit');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="space-y-2 bg-cod-gray rounded-xl p-3">
      <ButtonGroup className="flex w-full">
        {BUTTON_LABELS.map((label, index) => (
          <button
            key={index}
            className="flex border-0 mr-2 transition ease-in-out duration-500 rounded-md bg-transparent hover:bg-transparent hover:text-white"
            onClick={handleClick}
          >
            <Typography2
              variant="subtitle2"
              weight="400"
              color={active === label ? 'white' : 'stieglitz'}
            >
              {label}
            </Typography2>
          </button>
        ))}
      </ButtonGroup>
      {active === 'Deposit' ? <Deposit /> : <Redeem />}
    </div>
  );
};

export default StrategyVaultPanel;
