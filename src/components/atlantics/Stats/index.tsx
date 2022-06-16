import { useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { AtlanticsContext } from 'contexts/Atlantics';

import formatAmount from 'utils/general/formatAmount';

const Stats = () => {
  const { stats } = useContext(AtlanticsContext);

  return (
    <Box className="grid grid-cols-3 grid-flow-col border-2 border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
      <Box className="p-4">
        <Typography variant="h6" className="p-2" color="stieglitz">
          {stats.tvl ? `$${formatAmount(stats.tvl, 3, true)}` : '...'}
        </Typography>
        <Typography variant="h5" color="stieglitz">
          TVL
        </Typography>
      </Box>
      <Box className="p-4">
        <Typography variant="h6" className="p-2" color="stieglitz">
          {stats.volume ? `$${formatAmount(stats.volume, 3, true)}` : '...'}
        </Typography>
        <Typography variant="h5" color="stieglitz">
          Volume
        </Typography>
      </Box>
      <Box className="p-4">
        <Typography variant="h6" className="p-2" color="stieglitz">
          {stats.poolsCount
            ? `${formatAmount(stats.poolsCount, 3, true)}`
            : '...'}
        </Typography>
        <Typography variant="h5" color="stieglitz">
          Pools
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;
