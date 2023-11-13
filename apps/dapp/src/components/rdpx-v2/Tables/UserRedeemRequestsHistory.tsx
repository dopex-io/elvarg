import { useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';

import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import columns, {
  RedeemRequestsHistoryType,
} from 'components/rdpx-v2/Tables/ColumnDefs/RedeemRequestsHistoryColumn';

const UserRedeemRequestsHistory = () => {
  const { address: user = '0x' } = useAccount();

  const { userRedeemRequestsHistory, updateHistoricLpRedeemRequests, loading } =
    useSubgraphQueries({
      user,
    });

  useEffect(() => {
    updateHistoricLpRedeemRequests();
  }, [updateHistoricLpRedeemRequests]);

  const data = useMemo(() => {
    if (userRedeemRequestsHistory.length === 0) return [];
    return userRedeemRequestsHistory
      .map((rr) => ({
        owner: rr.owner,
        composition: [rr.ethAmount, rr.rdpxAmount] as readonly [bigint, bigint],
        epoch: rr.epoch,
        transaction: {
          hash: rr.txHash,
        },
      }))
      .sort((a, b) => Number(b.epoch - a.epoch));
  }, [userRedeemRequestsHistory]);

  return (
    <TableLayout<RedeemRequestsHistoryType>
      data={data}
      columns={columns}
      rowSpacing={3}
      isContentLoading={loading && user !== '0x'}
      fill="bg-umbra"
    />
  );
};

export default UserRedeemRequestsHistory;
