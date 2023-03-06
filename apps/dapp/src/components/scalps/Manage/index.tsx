import React, { value useState } from 'react';

import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import DepositCard from 'components/scalps/DepositCard';
import WithdrawCard from 'components/scalps/WithdrawCard';

const Manage = () => {
  const [activeTab, setActiveTab] = useState<string>('Deposit');

  return (
    <Box className="bg-cod-gray rounded-xl p-1 max-w-sm">
      <Box className={'flex'}>
        <Box className={'w-full'}>
          <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
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
            <Box
              className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
                activeTab === 'Withdraw' ? 'bg-[#2D2D2D]' : ''
              }`}
              onClick={() => setActiveTab('Withdraw')}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Withdraw
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {activeTab === 'Deposit' ? <DepositCard /> : ''}
      {activeTab === 'Withdraw' ? <WithdrawCard /> : ''}
    </Box>
  );
};

export default Manage;
