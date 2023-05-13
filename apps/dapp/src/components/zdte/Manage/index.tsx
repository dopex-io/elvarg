import { useEffect, useState } from 'react';

import { Button, ButtonGroup } from '@mui/material';
import { useBoundStore } from 'store';

import Deposit from 'components/zdte/Manage/DepositCard';
import TradeCard from 'components/zdte/Manage/TradeCard';
import Withdraw from 'components/zdte/Manage/WithdrawCard';

const ManageCard = () => {
  const [active, setActive] = useState<string>('Deposit');

  const handleClick = (e: any) => setActive(e.target.textContent);

  return (
    <div className="w-full">
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg">
        {['Deposit', 'Withdraw'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-0 transition ease-in-out duration-500 ${
              active === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={handleClick}
          >
            <h6 className="text-xs mt-2 pb-2">
              <span>{label}</span>
            </h6>
          </Button>
        ))}
      </ButtonGroup>
      <div className="bg-cod-gray rounded-b-xl pb-3">
        {active === 'Deposit' ? <Deposit /> : <Withdraw />}
      </div>
    </div>
  );
};

const ManageComponent = () => {
  const {
    zdteData,
    staticZdteData,
    focusTrade,
    setFocusTrade,
    setTextInputRef,
    setSelectedSpreadPair,
    isLoading,
  } = useBoundStore();

  const [manageSection, setManageSection] = useState<string>('Trade');

  useEffect(() => {
    if (focusTrade) setManageSection('Trade');
  }, [focusTrade]);

  if (isLoading || !zdteData || !staticZdteData) {
    return <></>;
  }

  return (
    <div className="w-[348px]">
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg mb-2">
        {['LP', 'Trade'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
              manageSection === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={() => {
              if (label === 'LP') {
                setFocusTrade(false);
                setTextInputRef(false);
                setSelectedSpreadPair({
                  shortStrike: undefined,
                  longStrike: undefined,
                });
              }
              setManageSection(label);
            }}
          >
            <h6 className="text-xs pb-1">
              <span>{label}</span>
            </h6>
          </Button>
        ))}
      </ButtonGroup>
      {manageSection === 'Trade' ? (
        <>
          <div className="bg-cod-gray rounded-xl">
            <TradeCard />
          </div>
          <p className="text-stieglitz mt-2 p-2">
            Zero day to expiry option spreads are a flexible and risk-controlled
            options trading strategy for traders. By buying and selling options
            with the same expiration date but at different strike prices,
            traders can capitalize on short-term market fluctuations while
            limiting potential losses
          </p>
        </>
      ) : (
        <ManageCard />
      )}
    </div>
  );
};

export default ManageComponent;
