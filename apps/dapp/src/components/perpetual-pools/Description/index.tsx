import Box from '@mui/material/Box';

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
          Write Perpetual Puts for $DSC Bonding.
        </Typography>
      </Box>
      <a
        className="self-start rounded-sm bg-primary px-2 py-1"
        href="https://blog.dopex.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Typography variant="h6" className="my-auto text-center">
          Learn More
        </Typography>
      </a>
    </Box>
  );
};

export default Description;
