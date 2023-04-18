import { useCallback, useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';

import Curve from './Curve';
import DopexAmm from './DopexAmm';

const BUTTON_LABELS = ['dpxETH-WETH', 'RDPX-WETH'];

const Swap = () => {
  const [active, setActive] = useState<string>(BUTTON_LABELS[0] || '');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <div className="py-12 mt-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
      <ButtonGroup className="flex w-full md:w-1/2 lg:w-1/3 mx-auto bg-cod-gray border border-umbra rounded-lg">
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
      <div className="py-12 my-auto flex justify-center space-x-2">
        <div className="flex flex-col bg-cod-gray p-3 rounded-xl">
          {active === 'dpxETH-WETH' ? <Curve /> : <DopexAmm />}
        </div>
      </div>
    </div>
  );
};

export default Swap;
