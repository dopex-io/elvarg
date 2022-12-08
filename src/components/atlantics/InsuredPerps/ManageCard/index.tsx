import { useCallback, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

// import Typography from 'components/UI/Typography';
import ManagePosition from '../ManagePosition';
import Swap from '../Swap';

const buttonLabels = ['Long', /*'Short',*/ 'Swap'];

interface ManageCardProps {
  underlying: string;
  stable: string;
}

const ManageCard = (props: ManageCardProps) => {
  const { underlying = '', stable = '' } = props;

  const [active, setActive] = useState<string>('Long');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  const renderComponent = useMemo(() => {
    if (active === 'Long' || active === 'Short') return <ManagePosition />;
    else return <Swap underlying={underlying} stable={stable} />;
  }, [active, stable, underlying]);

  return (
    <Box className="flex flex-col bg-cod-gray rounded-xl p-2 space-y-3">
      <ButtonGroup className="flex w-full justify-between bg-umbra rounded-lg">
        {buttonLabels.map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-1/2 transition ease-in-out duration-500 ${
              active === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={handleClick}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      {renderComponent}
    </Box>
  );
};

export default ManageCard;
