import { useEffect, useMemo, useState } from 'react';

import { useAccount, useContractWrite } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';

import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

import columns, {
  DelegatePositions as DelegatePositionsType,
} from './ColumnDefs/DelegatePositionsColumn';

const DelegatePositions = () => {
  const [delegateId, setDelegateId] = useState<bigint>(0n);
  const { address: account } = useAccount();
  const { updateUserDelegatePositions, userDelegatePositions, loading } =
    useRdpxV2CoreData({
      user: account || '0x',
    });

  const { write: withdraw, isSuccess: withdrawSuccess } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'withdraw',
    args: [delegateId],
  });

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions, withdrawSuccess]);

  const delegatePositions = useMemo(() => {
    if (userDelegatePositions.length === 0) return [];
    console.log(userDelegatePositions);
    return userDelegatePositions.map((pos) => {
      return {
        amount: pos.amount,
        activeCollateral: pos.activeCollateral,
        balance: pos.amount - pos.activeCollateral,
        fee: pos.fee,
        button: {
          handleWithdraw: () => {
            setDelegateId(pos._id);
            withdraw();
          },
          disabled: pos.activeCollateral === pos.amount,
        },
      };
    });
  }, [userDelegatePositions, withdraw]);

  return (
    <TableLayout<DelegatePositionsType>
      data={delegatePositions}
      columns={columns}
      isContentLoading={loading}
      fill="bg-umbra"
    />
  );
};

export default DelegatePositions;
