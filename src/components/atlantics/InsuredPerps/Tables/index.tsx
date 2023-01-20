import { useState, useCallback, useMemo } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import Positions from 'components/atlantics/InsuredPerps/Tables/Positions';

const Tables = ({ setTriggerMarker }: { setTriggerMarker: Function }) => {
  const [active, setActive] = useState<string>('Insured Positions');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  const renderComponent = useMemo(() => {
    // Add conditional rendering logic here for <TradeHistory {...props} />
    return <Positions active={active} setTriggerMarker={setTriggerMarker} />;
  }, [active, setTriggerMarker]);

  return (
    <>
      <ButtonGroup size="small">
        {['Insured Positions'].map((item, index) => (
          <Button
            key={index}
            className={`cursor-default border-0 hover:border-0 transition ease-in-out duration-1000 bg-transparent ${
              active === item ? 'text-white' : 'text-stieglitz'
            } hover:text-white`}
            disableRipple
            onClick={handleClick}
          >
            {item}
          </Button>
        ))}
      </ButtonGroup>
      {renderComponent}
    </>
  );
};

export default Tables;
