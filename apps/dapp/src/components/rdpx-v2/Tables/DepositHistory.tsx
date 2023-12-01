import { useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';

import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import columns, {
  DepositHistory as DepositHistoryType,
} from 'components/rdpx-v2/Tables/ColumnDefs/DepositHistoryColumn';

const DepositHistory = () => {
  const { address: user = '0x' } = useAccount();

  const { userDeposits, updateDepositHistory, loading } = useSubgraphQueries({
    user,
  });

  useEffect(() => {
    updateDepositHistory();
  }, [updateDepositHistory]);

  const data = useMemo(() => {
    if (userDeposits.length === 0) return [];
    return userDeposits
      .map((deposit) => ({
        owner: deposit.owner,
        assets: deposit.amount,
        shares: deposit.shares,
        transaction: {
          hash: deposit.txHash,
          timestamp: deposit.timestamp,
        },
      }))
      .sort((a, b) =>
        Number(b.transaction.timestamp - a.transaction.timestamp),
      );
  }, [userDeposits]);

  return (
    <TableLayout<DepositHistoryType>
      data={data}
      columns={columns}
      rowSpacing={3}
      isContentLoading={loading && user !== '0x'}
      fill="bg-umbra"
    />
  );
};

export default DepositHistory;
