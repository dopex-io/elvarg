import { useCallback, useEffect, useMemo } from 'react';

import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';
import columns, {
  UserBonds as UserBondsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/BondsColumn';

import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

const UserBonds = () => {
  const { address: user = '0x' } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user,
  });

  const { data: isApprovedForAll, refetch } = useContractRead({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'isApprovedForAll',
    args: [user || '0x', addresses.v2core],
  });

  const { writeAsync: approve, isSuccess: approveSuccess } = useContractWrite({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'setApprovalForAll',
    args: [addresses.v2core, true],
  });

  const handleRedeem = useCallback(
    async (id: bigint) => {
      const write = writeContract({
        abi: RdpxV2Core,
        address: addresses.v2core,
        functionName: 'redeemReceiptTokenBonds',
        args: [id, user || '0x'],
      });
      await write.then(() => updateUserBonds()).catch((e) => console.error(e));
    },
    [user, updateUserBonds],
  );

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0) return [];

    return userBonds.map((bond) => {
      const redeemable =
        bond.maturity <= BigInt(Math.ceil(new Date().getTime()));
      return {
        tokenId: bond.id,
        maturity: bond.maturity,
        amount: bond.amount,
        redeemable,
        timestamp: bond.timestamp,
        button: {
          label: !!isApprovedForAll ? 'Redeem' : 'Approve',
          id: bond.id,
          redeemable: true,
          handleRedeem: () => {
            !!isApprovedForAll
              ? handleRedeem(bond.id)
              : approve()
                  .then(() => refetch())
                  .catch((e) => console.error(e));
          },
        },
      };
    });
  }, [userBonds, isApprovedForAll, handleRedeem, approve, refetch]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds, approveSuccess]);

  return (
    <TableLayout<UserBondsType>
      data={userRdpxBonds}
      columns={columns}
      rowSpacing={2}
      isContentLoading={loading && user !== '0x'}
      fill="bg-umbra"
    />
  );
};

export default UserBonds;
