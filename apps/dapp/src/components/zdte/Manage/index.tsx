import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import Loading from 'components/zdte/Loading';
import Deposit from 'components/zdte/Manage/DepositCard';
import TradeCard from 'components/zdte/Manage/TradeCard';
import Withdraw from 'components/zdte/Manage/WithdrawCard';

const ManageCard = () => {
  const { zdteData, staticZdteData } = useBoundStore();

  const [active, setActive] = useState<string>('Deposit');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  if (!zdteData || !staticZdteData) {
    return <Loading />;
  }

  return (
    <Box className="w-full">
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
            <Typography variant="h6" className="text-xs mt-2 pb-2">
              {label}
            </Typography>
          </Button>
        ))}
      </ButtonGroup>
      <Box className="bg-cod-gray rounded-b-xl pb-3">
        {active === 'Deposit' ? <Deposit /> : <Withdraw />}
      </Box>
    </Box>
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
  } = useBoundStore();

  const [manageSection, setManageSection] = useState<string>('Trade');

  useEffect(() => {
    if (focusTrade) setManageSection('Trade');
  }, [focusTrade]);

  if (!zdteData || !staticZdteData) {
    return <Loading />;
  }

  return (
    <Box className="w-[348px]">
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
            <Typography variant="h6" className="text-xs pb-1">
              {label}
            </Typography>
          </Button>
        ))}
      </ButtonGroup>
      {manageSection === 'Trade' ? (
        <>
          <Box className="bg-cod-gray rounded-xl">
            <TradeCard />
          </Box>
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
    </Box>
  );
};

export default ManageComponent;
