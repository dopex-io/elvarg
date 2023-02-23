// import { useMemo } from 'react';
// import format from 'date-fns/format';
// import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';

import PoolStatsRow from 'components/perpetual-pools/DepositPanel/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/perpetual-pools/DepositPanel/PoolStats/PoolStatsBox';

// import { useBoundStore } from 'store';

// import getTokenDecimals from 'utils/general/getTokenDecimals';
// import formatAmount from 'utils/general/formatAmount';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  // const {
  //   // atlanticPool, atlanticPoolEpochData, userPositions,
  //   chainId,
  // } = useBoundStore();

  // const poolShareStats = useMemo(() => {
  //   if (!atlanticPool?.durationType || !userPositions || !atlanticPoolEpochData)
  //     return { userShare: 0, totalDeposits: 0 };

  //   const { depositToken } = atlanticPool.tokens;
  //   if (!depositToken) return { userShare: 0, totalDeposits: 0 };

  //   const decimals = getTokenDecimals(depositToken, chainId);

  //   let _userDeposits;
  //   let _totalDeposits;
  //   let _userShare;
  //   let userDeposits = userPositions.reduce(
  //     (prev, curr) => prev.add(curr.liquidity),
  //     BigNumber.from(0)
  //   );

  //   _userDeposits = Number(userDeposits) / 10 ** decimals;
  //   _totalDeposits =
  //     Number(atlanticPoolEpochData?.totalEpochLiquidity) / 10 ** decimals;
  //   _userShare = (_userDeposits / _totalDeposits) * 100;
  //   return {
  //     userShare: isNaN(_userShare) ? 0 : _userShare,
  //     totalDeposits: _totalDeposits,
  //   };
  // }, [atlanticPool, atlanticPoolEpochData, userPositions, chainId]);

  return (
    <Box className="border border-umbra rounded-xl divide-y divide-umbra">
      <Box className="flex divide-x divide-umbra">
        <PoolStatsBox
          // stat={formatAmount(123.123, 8, true)}
          stat={'-'}
          description="Total Deposits"
        />
        <PoolStatsBox
          // stat={formatAmount(12.1231, 8, true) + '%'}
          stat={'-'}
          description="Pool Share"
        />
      </Box>
      <Box className="flex flex-col space-y-2 p-3">
        <PoolStatsRow description="Side" value={poolType.toLocaleUpperCase()} />
      </Box>
    </Box>
  );
};

export default PoolStats;
