import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { AtlanticsContext } from 'contexts/Atlantics';

const Stats = () => {
  const { stats } = useContext(AtlanticsContext);

  console.log(stats, 'STATS');

  return (
    <Box className="grid grid-cols-3 border-2 border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
      <Box className="p-4">
        <Typography variant="h6" className="p-2 text-stieglitz">
          ${formatAmount(stats.tvl, 3, true)}
        </Typography>
        <Typography variant="h5" className="text-gray-400">
          TVL
        </Typography>
      </Box>

      <Box className="p-4">
        <Typography variant="h6" className="p-2 text-stieglitz">
          ${formatAmount(stats.volume, 3, true)}
        </Typography>
        <Typography variant="h5" className="text-gray-400">
          Volume
        </Typography>
      </Box>

      <Box className="p-4">
        <Typography variant="h6" className="p-2 text-stieglitz"></Typography>
        {stats.poolsCount}
        <Typography variant="h5" className="text-gray-400">
          Pools
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;

/* 
2 Variants (** Re-use this component for variants)
-- Total stats (Total TVL, Total Volume, Total Pools)
-- Individual market stats (TVL & Volume)
*/
