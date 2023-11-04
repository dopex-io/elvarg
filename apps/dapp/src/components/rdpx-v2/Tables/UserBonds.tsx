import { useCallback, useEffect, useMemo } from 'react';

import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';

import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

import columns, { UserBonds as UserBondsType } from './ColumnDefs/BondsColumn';

const UserBonds = () => {
  const { address: account } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user: account || '0x',
  });

  const { data: isApprovedForAll } = useContractRead({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'isApprovedForAll',
    args: [account || '0x', addresses.v2core],
  });

  const { write: approve } = useContractWrite({
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
        args: [id, account || '0x'],
      });
      try {
        await write.then(() => updateUserBonds());
      } catch (e) {
        console.error(e);
      }
    },
    [account, updateUserBonds],
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
          redeemable,
          handleRedeem: () => {
            !!isApprovedForAll ? handleRedeem(bond.id) : approve();
          },
        },
      };
    });
  }, [userBonds, isApprovedForAll, handleRedeem, approve]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds]);

  return (
    <TableLayout<UserBondsType>
      data={userRdpxBonds}
      columns={columns}
      rowSpacing={2}
      isContentLoading={loading}
      fill="bg-umbra"
    />
  );
};

export default UserBonds;
