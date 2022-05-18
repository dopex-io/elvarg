import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import PoolStatsRow from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsRow';

const PoolStats = () => {
  return (
    <Box className="border border-umbra rounded-xl divide-y divide-umbra">
      <Box className="flex divide-x divide-umbra">
        <Box className="w-1/2 p-3">
          <Typography variant="h5" className="text-stieglitz">
            -
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Deposit
          </Typography>
        </Box>
        <Box className="w-1/2 p-3">
          <Typography variant="h5" className="text-stieglitz">
            -
          </Typography>
          <Typography variant="h5" className="text-stieglitz">
            Pool Share
          </Typography>
        </Box>
      </Box>
      <Box className="flex flex-col space-y-3 p-3">
        <PoolStatsRow description="Epoch Type" value="-" />
        <PoolStatsRow description="Side" value="-" />
        <PoolStatsRow description="Expiry" value="-" />
      </Box>
    </Box>
  );
};

export default PoolStats;
