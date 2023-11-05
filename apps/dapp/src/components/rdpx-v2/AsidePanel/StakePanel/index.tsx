import { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import Stake from 'components/rdpx-v2/AsidePanel/StakePanel/Stake';
import Typography2 from 'components/UI/Typography2';

import Unstake from './Unstake';

const BUTTON_LABELS = ['Stake', 'Unstake'] as const;

const StakePanel = () => {
  const [active, setActive] = useState<string>('Stake');

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
      {active === 'Stake' ? <Stake /> : <Unstake />}
    </div>
  );
};

export default StakePanel;