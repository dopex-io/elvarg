import React, { useState } from 'react';

import { Button, ButtonGroup } from '@mui/material';

import DepositCard from 'components/scalps/DepositCard';
import WithdrawCard from 'components/scalps/WithdrawCard';

const Manage = () => {
  const [section, setSection] = useState('Deposit');

  return (
    <div className="flex flex-col bg-cod-gray space-y-2">
      <ButtonGroup className="flex justify-between border border-umbra rounded-top-lg">
        {['Deposit', 'Withdraw'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-0 transition ease-in-out duration-500 ${
              section === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            onClick={() => setSection(label)}
          >
            <p className="text-xs py-2">{label}</p>
          </Button>
        ))}
      </ButtonGroup>
      <div className="bg-cod-gray">
        {section === 'Deposit' ? <DepositCard /> : <WithdrawCard />}
      </div>
    </div>
  );
};

export default Manage;
