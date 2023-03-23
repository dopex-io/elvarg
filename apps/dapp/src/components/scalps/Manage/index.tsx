import React from 'react';

import DepositCard from 'components/scalps/DepositCard';
import WithdrawCard from 'components/scalps/WithdrawCard';

const Manage = () => {
  return (
    <div>
      <div className="bg-cod-gray rounded-b-xl p-3">
        <DepositCard />
      </div>
      <div className="bg-cod-gray rounded-xl p-3 mt-5">
        <WithdrawCard />
      </div>
    </div>
  );
};

export default Manage;
