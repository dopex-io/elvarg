import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { AtlanticsContext } from 'contexts/Atlantics';

import { ATLANTIC_STATS_MAPPING } from 'constants/index';

const Stats = () => {
  const {
    // @ts-ignore TODO: fix this
    marketsData,
  } = useContext(AtlanticsContext);

  const stats = useMemo(() => {
    const tvl = marketsData.reduce((acc: any, curr: any) => {
      return acc.add(curr.stats.tvl);
    }, BigNumber.from(0));

    const vol = marketsData.reduce((acc: any, curr: any) => {
      return acc.add(curr.stats.volume);
    }, BigNumber.from(0));

    const poolCount = marketsData.reduce((acc: any, curr: any) => {
      return acc + curr.pools.length;
    }, 0);

    return {
      TVL: getUserReadableAmount(tvl, 18),
      volume: getUserReadableAmount(vol, 18),
      pools: poolCount,
    };
  }, [marketsData]);

  return (
    <Box className="grid grid-cols-3 border border-umbra rounded-md divide-x divide-umbra my-auto mb-6">
      {Object.keys(ATLANTIC_STATS_MAPPING).map((key, index) => {
        return (
          <Box key={index} className="p-4">
            <Typography variant="h5">{ATLANTIC_STATS_MAPPING[key]}</Typography>
            <Typography variant="h6" className="text-stieglitz">
              {
                // @ts-ignore todo: FIX
                formatAmount(stats[key], 3, true, true)
              }
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Stats;

/* 
2 Variants (** Re-use this component for variants)
-- Total stats (Total TVL, Total Volume, Total Pools)
-- Individual market stats (TVL & Volume)
*/
