import { useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { AtlanticsContext } from 'contexts/Atlantics';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const Stats = () => {
  const { stats } = useContext(AtlanticsContext);

  return (
    <Box className="grid grid-cols-3 grid-flow-col border border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">
          {stats.tvl
            ? `$${formatAmount(getUserReadableAmount(stats.tvl, 6), 3, true)}`
            : '...'}
        </Typography>
        <Typography variant="h6" color="stieglitz">
          TVL
        </Typography>
      </Box>
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">
          {stats.volume
            ? `$${formatAmount(
                getUserReadableAmount(stats.volume, 6),
                3,
                true
              )}`
            : '...'}
        </Typography>
        <Typography variant="h6" color="stieglitz">
          Volume
        </Typography>
      </Box>
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">
          {stats.poolsCount ? `${stats.poolsCount}` : '...'}
        </Typography>
        <Typography variant="h6" color="stieglitz">
          Pools
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;
