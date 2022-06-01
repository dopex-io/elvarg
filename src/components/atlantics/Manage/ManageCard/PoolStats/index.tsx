import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';

import PoolStatsRow from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsBox';

import { AtlanticsContext } from 'contexts/Atlantics';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  const { atlanticPoolData, atlanticPoolEpochData } =
    useContext(AtlanticsContext);

  const epochExpiry = useMemo(() => {
    return (
      (atlanticPoolEpochData.epochTimes['expiryTime']?.toNumber() ?? 0) * 1000
    );
  }, [atlanticPoolEpochData.epochTimes]);

  return (
    <Box className="border border-umbra rounded-xl divide-y divide-umbra">
      <Box className="flex divide-x divide-umbra">
        <PoolStatsBox stat={'-'} description="Deposit" />
        <PoolStatsBox stat={'-'} description="Pool Share" />
      </Box>
      <Box className="flex flex-col space-y-3 p-3">
        <PoolStatsRow
          description="Epoch Type"
          value={atlanticPoolData.expiryType}
        />
        <PoolStatsRow description="Side" value={poolType} />
        <PoolStatsRow
          description="Expiry"
          value={format(epochExpiry, 'dd LLLL, yyyy')}
        />
      </Box>
    </Box>
  );
};

export default PoolStats;
