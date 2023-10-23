import { useCallback, useEffect, useMemo, useState } from 'react';

import { RdpxV2Treasury__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';
import { DelegateType } from 'store/RdpxV2/dpxeth-bonding';

import useSendTx from 'hooks/useSendTx';

import TableLayout from 'components/common/TableLayout';

import columns, {
  DelegatePositions as DelegatePositionsType,
} from './ColumnDefs/DelegatePositionsColumn';

const DelegatePositions = () => {
  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    treasuryContractState,
    treasuryData,
    updateTreasuryData,
  } = useBoundStore();

  const [userPositions, setUserPositions] = useState<DelegateType[]>([]);

  const handleWithdraw = useCallback(
    async (tokenId: number) => {
      if (!signer || !treasuryContractState.contracts || !accountAddress)
        return;

      const treasury = RdpxV2Treasury__factory.connect(
        treasuryContractState.contracts.treasury.address,
        signer,
      );

      try {
        await sendTx(treasury, 'withdraw', [tokenId]).then(() => {
          updateTreasuryData();
        });
      } catch (e) {
        console.log(e);
      }
    },
    [
      accountAddress,
      sendTx,
      signer,
      treasuryContractState.contracts,
      updateTreasuryData,
    ],
  );

  const delegatePositions = useMemo(() => {
    if (!userPositions || userPositions.length === 0) return [];
    return userPositions?.map((pos) => {
      return {
        amount: pos.amount,
        activeCollateral: pos.activeCollateral,
        balance: pos.amount.sub(pos.activeCollateral),
        fee: pos.fee,
        button: {
          handleWithdraw: () => handleWithdraw(pos._id),
          disabled: pos.activeCollateral.eq(pos.amount),
        },
      };
    });
  }, [handleWithdraw, userPositions]);

  useEffect(() => {
    (async () => {
      if (!treasuryData || !treasuryData.availableDelegates) return;
      const _userPositions: DelegateType[] =
        treasuryData.availableDelegates.filter(
          (delegate: DelegateType) =>
            delegate.owner === accountAddress &&
            delegate.amount.sub(delegate.activeCollateral).gt('10'), // **note**: 1e2 accounts for dust
        );
      setUserPositions(_userPositions);
    })();
  }, [accountAddress, treasuryData]);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <TableLayout<DelegatePositionsType>
          data={delegatePositions}
          columns={columns}
          isContentLoading={false}
        />
      </div>
    </div>
  );
};

export default DelegatePositions;
