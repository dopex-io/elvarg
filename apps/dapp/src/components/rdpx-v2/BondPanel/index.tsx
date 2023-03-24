import { useCallback, useState } from 'react';

import ButtonGroup from '@mui/material/ButtonGroup';

import Bond from 'components/rdpx-v2/BondPanel/Bond';
import Delegate from 'components/rdpx-v2/BondPanel/Delegate';

const BUTTON_LABELS = ['Bond', 'Delegate'];

const BondPanel = () => {
  const [active, setActive] = useState<string>('Bond');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="p-3 bg-cod-gray rounded-xl space-y-3">
      <span className="text-base">Mint</span>
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-lg">
        {BUTTON_LABELS.map((label, index) => (
          <button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 pb-1 transition ease-in-out duration-500 rounded-md ${
              active === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
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
