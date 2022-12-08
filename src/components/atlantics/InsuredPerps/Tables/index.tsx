import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import Positions from 'components/atlantics/InsuredPerps/Tables/Positions';
// import Orders from 'components/atlantics/InsuredPerps/Tables/Orders';

const Tables = ({ setTriggerMarker }: { setTriggerMarker: Function }) => {
  const [active, setActive] = useState<string>('Insured Positions');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  const renderComponent = useMemo(() => {
    // if (active === 'Positions')
    return <Positions active={active} setTriggerMarker={setTriggerMarker} />;
    // else return <Orders active={active} />;
    // else return <Trades />;
  }, [active, setTriggerMarker]);

  return (
    <Box>
      <ButtonGroup size="small">
        {['Insured Positions'].map((item, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 transition ease-in-out duration-1000 bg-transparent ${
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
    </Box>
  );
};

export default Tables;
