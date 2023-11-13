import { useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';

import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import columns, {
  UserBondsHistoryType,
} from 'components/rdpx-v2/Tables/ColumnDefs/UserBondsHistory';

const UserBondsHistory = () => {
  const { address: user = '0x' } = useAccount();

  const { userAggregatedData, updateUserBondingHistory, loading } =
    useSubgraphQueries({
      user,
    });

  useEffect(() => {
    updateUserBondingHistory();
  }, [updateUserBondingHistory]);

  const data = useMemo(() => {
    return userAggregatedData.bonds
      .map((bond) => ({
        owner: bond.owner,
        composition: [bond.wethRequired, bond.rdpxRequired] as readonly [
          bigint,
          bigint,
        ],
        receiptTokensMinted: bond.receiptTokenAmount,
        transaction: {
          timestamp: bond.timestamp,
          hash: bond.txHash,
        },
      }))
      .sort((a, b) =>
        Number(b.transaction.timestamp - a.transaction.timestamp),
      );
  }, [userAggregatedData.bonds]);

  return (
    <TableLayout<UserBondsHistoryType>
      data={data}
      columns={columns}
      rowSpacing={2}
      isContentLoading={loading && user !== '0x'}
    />
  );
};

export default UserBondsHistory;
