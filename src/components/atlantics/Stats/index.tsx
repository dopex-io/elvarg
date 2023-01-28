import { useMemo } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import { Pool, Pools } from 'pages/atlantics';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  pools: Pools | undefined;
  token: string;
}

const Stats = (props: Props) => {
  const { pools, token } = props;

  const stats = useMemo(() => {
    if (!pools || !token) return;
    let tvl = 0;
    let vol = 0;
    let poolCount = pools[token]?.length;
    pools[token]?.map((pool: Pool) => {
      tvl += Number(pool.tvl);
      vol += Number(pool.unlocked);
    });

    return {
      tvl,
      vol,
      poolCount,
    };
  }, [pools, token]);

  return (
    <Box className="grid grid-cols-3 grid-flow-col border border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">
          {stats
            ? `$${formatAmount(!isNaN(stats.tvl) ? stats.tvl : 0, 2, true)}`
            : '...'}
        </Typography>
        <Typography variant="h6" color="stieglitz">
          TVL
        </Typography>
      </Box>
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">
          {`${
            stats
              ? '$' + formatAmount(!isNaN(stats.vol) ? stats.vol : 0, 2, true)
              : '...'
          }`}
        </Typography>
        <Typography variant="h6" color="stieglitz">
          Volume
        </Typography>
      </Box>
      <Box className="p-4 text-left space-y-2">
        <Typography variant="h6">{`${
          stats ? stats.poolCount : '...'
        }`}</Typography>
        <Typography variant="h6" color="stieglitz">
          Pools
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;
