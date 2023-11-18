import { useCallback, useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';
import columns, {
  DelegatePositions as DelegatePositionsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/DelegatePositionsColumn';

import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
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

  const handleWithdraw = useCallback(
    async (id: bigint) => {
      const write = async () =>
        await writeContract({
          abi: DelegateBonds,
          address: addresses.delegateBonds,
          functionName: 'withdraw',
          args: [id],
        });

      await write()
        .then(() => updateUserDelegatePositions())
        .catch((e) => console.error(e));
    },
    [updateUserDelegatePositions],
  );

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
  }, [handleWithdraw, userDelegatePositions]);

  return (
    <TableLayout<DelegatePositionsType>
      data={delegatePositions}
      columns={columns}
      isContentLoading={loading && !!account}
      fill="bg-umbra"
    />
  );
};

export default DelegatePositions;
