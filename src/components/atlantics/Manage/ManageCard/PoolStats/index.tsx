import { useMemo } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';

import PoolStatsRow from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsBox';

import { useBoundStore } from 'store';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  const { atlanticPool, atlanticPoolEpochData, userPositions, chainId } =
    useBoundStore();

  const poolShareStats = useMemo(() => {
    if (!atlanticPool?.durationType || !userPositions || !atlanticPoolEpochData)
      return { userShare: 0, totalDeposits: 0 };

    const { depositToken } = atlanticPool.tokens;
    if (!depositToken) return { userShare: 0, totalDeposits: 0 };

    const decimals = getTokenDecimals(depositToken, chainId);

    let _userDeposits;
    let _totalDeposits;
    let _userShare;
    let userDeposits = userPositions.reduce(
      (prev, curr) => prev.add(curr.liquidity),
      BigNumber.from(0)
    );

    _userDeposits = Number(userDeposits) / 10 ** decimals;
    _totalDeposits =
      Number(atlanticPoolEpochData?.totalEpochLiquidity) / 10 ** decimals;
    _userShare = (_userDeposits / _totalDeposits) * 100;
    return {
      userShare: _userShare,
      totalDeposits: _totalDeposits,
    };
  }, [atlanticPool, atlanticPoolEpochData, userPositions, chainId]);

  // const callStrike = useMemo(() => {
  //   if (!atlanticPoolEpochData) return '0';
  //   const strike = Number(atlanticPoolEpochData.maxStrikes as BigNumber[]);
  //   if (strike !== undefined) {
  //     return String(strike / 1e8);
  //   }
  //   return '...';
  // }, [atlanticPoolEpochData]);

  const epochExpiry = useMemo(() => {
    if (!atlanticPoolEpochData) return 0;
    return (atlanticPoolEpochData?.expiry.toNumber() ?? 0) * 1000;
  }, [atlanticPoolEpochData]);

  return (
    <Box className="border border-umbra rounded-xl divide-y divide-umbra">
      <Box className="flex divide-x divide-umbra">
        <PoolStatsBox
          stat={formatAmount(poolShareStats.totalDeposits, 8, true)}
          description="Total Deposits"
        />
        <PoolStatsBox
          stat={formatAmount(poolShareStats.userShare, 8, true) + '%'}
          description="Pool Share"
        />
      </Box>
      <Box className="flex flex-col space-y-2 p-3">
        {/* {!selectedPool?.isPut ? ( */}
        {/* <>
          <PoolStatsRow description="Pool Strike" value={callStrike} />
          <PoolStatsRow
            description="Strike OTM Offset"
            value={
              atlanticPool?.vaultConfig.strikeOffset?.div(1e6).toString() + '%'
            }
          />
        </> */}
        <PoolStatsRow
          description="Tick size"
          value={atlanticPoolEpochData?.tickSize?.div(1e8).toString()!}
        />
        {/*} ) : (
        // )} */}
        <PoolStatsRow
          description="Epoch Type"
          value={atlanticPool?.durationType.toLocaleUpperCase()!}
        />
        <PoolStatsRow description="Side" value={poolType.toLocaleUpperCase()} />
        <PoolStatsRow
          description="Expiry"
          value={format(epochExpiry, 'dd LLLL, yyyy')}
        />
      </Box>
    </Box>
  );
};

export default PoolStats;
