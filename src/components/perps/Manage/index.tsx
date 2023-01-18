import React, { useState } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import TradeCard from 'components/perps/TradeCard';

const Manage = () => {
  const [activeTab, setActiveTab] = useState<string>('Trade');

  return (
    <Box className="bg-cod-gray rounded-xl p-3 max-w-sm">
      <Box className={'flex'}>
        <Box className={'w-full'}>
          <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
            <Box
              className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
                activeTab === 'Trade' ? 'bg-[#2D2D2D]' : ''
              }`}
              onClick={() => setActiveTab('Trade')}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Trade
              </Typography>
            </Box>
            <Box
              className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
                activeTab === 'Deposit' ? 'bg-[#2D2D2D]' : ''
              }`}
              onClick={() => setActiveTab('Deposit')}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Deposit
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {activeTab === 'Trade' ? <TradeCard /> : ''}
    </Box>
  );
};

export default Manage;
