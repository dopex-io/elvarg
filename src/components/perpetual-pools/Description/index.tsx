import Box from '@mui/material/Box';
import Button from 'components/UI/Button';

import Typography from 'components/UI/Typography';
import PerpetualPoolsIcon from 'svgs/icons/PerpetualPoolsIcon';

const Description = () => {
  return (
    <Box className="flex justify-between border border-umbra rounded-xl p-3">
      <Box className="space-y-2">
        <Box className="flex space-x-2">
          <PerpetualPoolsIcon />
          <Typography variant="h6" className="my-auto">
            Perpetual Pool
          </Typography>
        </Box>
        <Typography variant="h6" color="stieglitz">
          Perpetual Pools writes Puts for DPXUSD Bonding.
        </Typography>
      </Box>
      <Button className="self-start h-[1rem] rounded-sm">Learn More</Button>
    </Box>
  );
};

export default Description;
