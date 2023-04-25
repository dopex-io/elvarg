import React from 'react';

import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';

import PoolChart from './PoolChart';

const PoolCard = () => {
  return (
    <div className="text-gray-400 w-full mb-2 opacity-30">
      <div className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <div className="flex">
          <SignalCellularAltRoundedIcon className="mx-2" />
          <h6 className="text-gray-400">Pool Volume</h6>
        </div>
      </div>
      <div className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <div className="m-2 flex">
          <div className="ml-2">
            <h6 className="pt-1 pb-4 text-gray-400">$1213.13</h6>
            <h6 className="py-4 text-gray-400">$1213.13</h6>
            <h6 className="pb-1 pt-4 text-gray-400">$1213.13</h6>
          </div>
          <div className="w-full px-2 py-1 h-36">
            <PoolChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
