import { useCallback, useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';
import columns, {
  DelegatePositions as DelegatePositionsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/DelegatePositionsColumn';

import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

const DelegatePositions = () => {
  const { address: account } = useAccount();
  const { updateUserDelegatePositions, userDelegatePositions, loading } =
    useRdpxV2CoreData({
      user: account || '0x',
    });

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions]);

  const handleWithdraw = useCallback(async (id: bigint) => {
    const write = async () =>
      await writeContract({
        abi: RdpxV2Core,
        address: addresses.v2core,
        functionName: 'withdraw',
        args: [id],
      });

    await write()
      .then((tx) => console.log(tx.hash))
      .catch((e) => console.error(e));
  }, []);

  const delegatePositions = useMemo(() => {
    if (userDelegatePositions.length === 0) return [];
    return userDelegatePositions
      .map((pos) => {
        return {
          amount: pos.amount,
          activeCollateral: pos.activeCollateral,
          balance: pos.amount - pos.activeCollateral,
          fee: pos.fee,
          button: {
            handleWithdraw: () => handleWithdraw(pos._id),
            disabled: pos.activeCollateral === pos.amount,
          },
        };
      })
      .filter((pos) => pos.balance > 1000n); // hide dust, if any
  }, [userDelegatePositions]);

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
