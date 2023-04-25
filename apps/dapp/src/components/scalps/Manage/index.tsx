import React, { useState } from 'react';

import DepositCard from 'components/scalps/DepositCard';
import WithdrawCard from 'components/scalps/WithdrawCard';
import { Button, ButtonGroup } from '@mui/material';

const Manage = () => {
  const [section, setSection] = useState('Deposit');

  return (
    <div className="min-w-[24.5rem]">
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg">
        {['Deposit', 'Withdraw'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-0 transition ease-in-out duration-500 ${
              section === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={() => setSection(label)}
          >
            <h6 className="text-xs mt-2 pb-2">{label}</h6>
          </Button>
        ))}
      </ButtonGroup>
      <div className="bg-cod-gray rounded-b-xl w-full pb-3">
        {section === 'Deposit' ? <DepositCard /> : <WithdrawCard />}
      </div>
    </div>
  );
};

export default Manage;
