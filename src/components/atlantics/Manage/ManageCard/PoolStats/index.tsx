import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';

import PoolStatsRow from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/atlantics/Manage/ManageCard/PoolStats/PoolStatsBox';

import { WalletContext } from 'contexts/Wallet';
import { AtlanticsContext } from 'contexts/Atlantics';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  const { selectedPool, userPositions } = useContext(AtlanticsContext);
  const { chainId } = useContext(WalletContext);

  const poolShareStats = useMemo(() => {
    if (!selectedPool?.duration || !userPositions)
      return { userShare: 0, totalDeposits: 0 };

    const { deposit } = selectedPool.tokens;
    if (!deposit) return { userShare: 0, totalDeposits: 0 };

    const decimals = getTokenDecimals(deposit, chainId);

    let _userDeposits;
    let _totalDeposits;
    let _userShare;
    if (selectedPool.isPut) {
      let userDeposits = userPositions.reduce(
        (prev, curr) => prev.add(curr.liquidity),
        BigNumber.from(0)
      );

      _userDeposits = Number(userDeposits) / 10 ** decimals;
      _totalDeposits =
        Number(selectedPool.epochData.totalEpochLiquidity) / 10 ** decimals;
      _userShare = (_userDeposits / _totalDeposits) * 100;

      return {
        userShare: _userShare,
        totalDeposits: formatAmount(_totalDeposits, 3, true),
      };
    }
    if (!selectedPool.isPut) {
      let userDeposits = userPositions.reduce(
        (prev, curr) => prev.add(curr.liquidity),
        BigNumber.from(0)
      );

      _userDeposits = Number(userDeposits) / 10 ** decimals;
      _totalDeposits =
        Number(selectedPool.epochData.totalEpochLiquidity) / 10 ** decimals;
      _userShare = (_userDeposits / _totalDeposits) * 100;

      return {
        userShare: _userShare,
        totalDeposits: _totalDeposits,
      };
    } else {
      return {
        userShare: 0,
        totalDeposits: 0,
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
          stat={formatAmount(poolShareStats.totalDeposits, 8)}
          description="Total Deposits"
        />
        <PoolStatsBox
          stat={formatAmount(poolShareStats.userShare, 8, true) + '%'}
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
