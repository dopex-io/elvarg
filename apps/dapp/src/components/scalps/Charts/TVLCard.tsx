import React from 'react';

import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';

import TVLChart from './TVLChart';

const TVLCard = () => {
  return (
    <div className="text-gray-400 w-full opacity-30">
      <div className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <div className="flex">
          <SignalCellularAltRoundedIcon className="mx-2" />
          <h6 className="text-gray-400">TVL vs Queued Withdrawals</h6>
        </div>
      </div>
      <div className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <div className="px-2 py-2 h-36 m-2">
          <TVLChart />
        </div>
      </div>
    </div>
  );
};

export default TVLCard;
