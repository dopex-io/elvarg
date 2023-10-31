import { useEffect, useMemo, useState } from 'react';

import { useAccount, useContractWrite } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';

import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
// import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

import columns, { UserBonds as UserBondsType } from './ColumnDefs/BondsColumn';

const UserBonds = () => {
  const [selectionIndex, setSelectionIndex] = useState<number>(0);
  const { address: account } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user: account || '0x',
  });

  const { write: approve } = useContractWrite({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'setApprovalForAll',
    args: [addresses.v2core, true], // use userBonds[selectionIndex].id for single approval
  });

  // const { write: redeem } = useContractWrite({
  //   abi: Rdpx,
  //   address: addresses.v2core,
  //   functionName: 'settle',
  // });

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0) return [];

    return userBonds.map((bond, index) => {
      return {
        tokenId: bond.id,
        maturity: bond.maturity,
        amount: bond.amount,
        redeemable:
          bond.maturity <= BigInt(Math.ceil(new Date().getTime() / 1000)),
        timestamp: bond.timestamp,
        button: {
          handleRedeem: () => {
            setSelectionIndex(index);
            approve();
          },
          redeemable:
            bond.maturity <= BigInt(Math.ceil(new Date().getTime() / 1000)),
          id: bond.id,
        },
      };
    });
  }, [approve, userBonds]);

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
