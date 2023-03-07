import React from 'react';

import Box from '@mui/material/Box';

import DepositCard from 'components/scalps/DepositCard';
import WithdrawCard from 'components/scalps/WithdrawCard';

const Manage = () => {
  return (
    <Box className="bg-cod-gray rounded-xl p-1 max-w-sm">
      <DepositCard />
      <WithdrawCard />
    </Box>
  );
};

export default Manage;
