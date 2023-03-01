import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import Redeem from 'components/rdpx-v2/BondPanel/Redeem';
import Mint from 'components/rdpx-v2/BondPanel/Mint';

const buttonLabels = ['Bond', 'Redeem'];

const BondPanel = () => {
  const [active, setActive] = useState<string>('Bond');

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  return (
    <Box className="p-3 bg-cod-gray rounded-xl space-y-3">
      <Typography variant="h6">Mint</Typography>
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-lg">
        {buttonLabels.map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
              active === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={handleClick}
          >
            <Typography variant="caption">{label}</Typography>
          </Button>
        ))}
      </ButtonGroup>
      {active === 'Bond' ? <Mint /> : <Redeem />}
    </Box>
  );
};

export default BondPanel;
