import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';

import PoolStatsRow from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsBox';

import { WalletContext } from 'contexts/Wallet';
import { AtlanticsContext, IAtlanticPoolCheckpoint } from 'contexts/Atlantics';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  const { selectedPool, userPositions } = useContext(AtlanticsContext);
  const { chainId } = useContext(WalletContext);
  const poolShareStats = useMemo(() => {
    if (!selectedPool?.duration || !userPositions)
      return { userShare: 0, totalDeposits: 0 };

    const decimals = getTokenDecimals(selectedPool.tokens.deposit, chainId);

    if (selectedPool.isPut) {
      const checkpoints = selectedPool.data as IAtlanticPoolCheckpoint[];
      let totalDeposits: number = 0;
      let userDeposits: number = 0;
      checkpoints.map((checkpoint: any) => {
        totalDeposits += Number(checkpoint.liquidity) / 10 ** decimals;
      });
      userPositions.map((position) => {
        userDeposits += Number(position?.liquidity);
      });

      const userShare = (userDeposits / totalDeposits) * 100;

      return {
        userShare: formatAmount(userShare, 3),
        totalDeposits: formatAmount(totalDeposits, 3, true),
      };
    } else {
      const checkpoint = selectedPool.data as IAtlanticPoolCheckpoint;
      const totalDeposits = Number(checkpoint.liquidity) / 10 ** decimals;
      // const totalDeposits = checkpoint.liquidity;
      let totalUserDeposits = userPositions.reduce((acc, position) => {
        return acc + Number(position.liquidity) / 10 ** decimals;
      }, 0);

      const userShare = (totalUserDeposits / totalDeposits) * 100;

      return {
        userShare: formatAmount(userShare, 3),
        totalDeposits: formatAmount(totalDeposits, 3, true),
      };
    }
  }, [selectedPool, userPositions, chainId]);

  const callStrike = useMemo(() => {
    if (!selectedPool) return '0';
    const strike = Number(selectedPool.strikes as BigNumber);
    if (strike !== undefined) {
      return String(strike / 1e8);
    }
    return '...';
  }, [selectedPool]);

  const epochExpiry = useMemo(() => {
    return (selectedPool?.state.expiryTime.toNumber() ?? 0) * 1000;
  }, [selectedPool?.state.expiryTime]);

  return (
    <Box className="border border-umbra rounded-xl divide-y divide-umbra">
      <Box className="flex divide-x divide-umbra">
        <PoolStatsBox
          stat={poolShareStats.totalDeposits}
          description="Total Deposits"
        />
        <PoolStatsBox
          stat={formatAmount(poolShareStats.userShare, 3) + '%'}
          description="Pool Share"
        />
      </Box>
      <Box className="flex flex-col space-y-3 p-3">
        {!selectedPool?.isPut ? (
          <>
            <PoolStatsRow description="Pool Strike" value={callStrike} />
            <PoolStatsRow
              description="Strike OTM Offset"
              value={
                selectedPool?.config.strikeOffset?.div(1e6).toString() + '%'
              }
            />
          </>
        ) : (
          <PoolStatsRow
            description="Tick size"
            value={selectedPool?.config.tickSize?.div(1e8).toString()!}
          />
        )}
        <PoolStatsRow
          description="Epoch Type"
          value={selectedPool?.duration.toLocaleUpperCase()!}
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
