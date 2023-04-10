import { useMemo } from 'react';
import { BigNumber } from 'ethers';

import PoolStatsRow from 'components/perpetual-pools/DepositPanel/PoolStats/PoolStatsRow';
import PoolStatsBox from 'components/perpetual-pools/DepositPanel/PoolStats/PoolStatsBox';

import { useBoundStore } from 'store';
import { WritePosition } from 'store/RdpxV2/perpetual-pools';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

interface PoolStatsProps {
  poolType: string;
}

const PoolStats = ({ poolType }: PoolStatsProps) => {
  const { appContractData, appUserData, chainId } = useBoundStore();

  const poolShareStats = useMemo(() => {
    if (
      !appContractData ||
      !appContractData.contract ||
      !appUserData.writePositions
    )
      return { userShare: 0, totalDeposits: 0 };

    const { collateralSymbol, collateralToken } = appContractData;
    if (!collateralToken) return { userShare: 0, totalDeposits: 0 };

    const decimals = getTokenDecimals(collateralSymbol, chainId);

    let _userDeposits;
    let _totalDeposits;
    let _userShare;
    let userDeposits = appUserData.writePositions.reduce(
      (prev, curr: WritePosition) => prev.add(curr.totalCollateral),
      BigNumber.from(0)
    );

    _userDeposits = Number(userDeposits) / 10 ** decimals;
    _totalDeposits =
      Number(appContractData.vaultData.totalCollateral) / 10 ** decimals;
    _userShare = (_userDeposits / _totalDeposits) * 100;
    return {
      userShare: isNaN(_userShare) ? 0 : _userShare,
      totalDeposits: _totalDeposits,
    };
  }, [appContractData, appUserData, chainId]);

  return (
    <div className="border border-umbra rounded-xl divide-y divide-umbra">
      <div className="flex divide-x divide-umbra">
        <PoolStatsBox
          stat={formatAmount(poolShareStats.totalDeposits, 8, true)}
          description="Total Deposits"
        />
        <PoolStatsBox
          stat={formatAmount(poolShareStats.userShare, 8, true) + '%'}
          description="Pool Share"
        />
      </div>
      <div className="flex flex-col space-y-2 p-3">
        <PoolStatsRow description="Side" value={poolType.toLocaleUpperCase()} />
      </div>
    </div>
  );
};

export default PoolStats;
