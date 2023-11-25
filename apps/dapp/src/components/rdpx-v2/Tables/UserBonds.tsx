import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAccount, useContractRead } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData, { UserBond } from 'hooks/rdpx/useRdpxV2CoreData';
import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import RedeemAndStakeStepper from 'components/rdpx-v2/Dialogs/RedeemAndStakeStepper';
import columns, {
  UserBonds as UserBondsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/BondsColumn';

import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

type DialogState = {
  open: boolean;
  id: bigint;
};

const UserBonds = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    id: 0n,
  });

  const { address: user = '0x' } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user,
  });
  const { delegateBonds, updateDelegateBonds } = useSubgraphQueries({
    user,
  });
  const { refetch: refetchBalance } = useContractRead({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'balanceOf',
    args: [user],
  });

  const handleVest = async (id: bigint) => {
    setDialogState({
      open: true,
      id,
    });
  };

  const redeemDelegateBond = useCallback(
    async (posId: bigint) => {
      const delegateBond = async () =>
        await writeContract({
          abi: DelegateBonds,
          address: addresses.delegateBonds,
          functionName: 'redeem',
          args: [posId],
        });

      await delegateBond()
        .then(() => refetchBalance())
        .catch((e) => console.error(e));
    },
    [refetchBalance],
  );

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0 && delegateBonds.length === 0) return [];

    const formattedDelegateBonds: UserBond[] = delegateBonds.map((bond) => ({
      id: BigInt(bond.positionId),
      maturity: bond.maturity,
      amount: bond.amount,
      timestamp: bond.timestamp,
      positionId: BigInt(bond.positionId),
      vestedAmount:
        bond.maturity * 1000n > BigInt(new Date().getTime()) ? bond.amount : 0n,
      claimableBalance: 0n,
    }));

    return userBonds.concat(formattedDelegateBonds).map((bond) => {
      let label = 'Claim';
      if (bond.positionId) {
        label = 'Redeem';
      }

      const handleRedeem = () => {
        if (!bond.positionId) handleVest(bond.id);
        else redeemDelegateBond(bond.positionId);
      };

      return {
        tokenId: String(bond.id),
        maturity: bond.maturity * 1000n,
        timestamp: bond.timestamp,
        claimData: {
          vested: bond.vestedAmount,
          claimable: bond.claimableBalance,
          amount: bond.amount,
        },
        button: {
          label: label,
          id: bond.id,
          disabled: !!bond.positionId, // todo: enable 5-day post-maturity of DelegationControllerV1
          action: handleRedeem,
        },
      };
    });
  }, [delegateBonds, redeemDelegateBond, userBonds]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds]);

  useEffect(() => {
    updateDelegateBonds();
  }, [updateDelegateBonds, userBonds]);

  return (
    <>
      <TableLayout<UserBondsType>
        data={userRdpxBonds}
        columns={columns}
        rowSpacing={2}
        isContentLoading={loading && user !== '0x'}
        fill="bg-umbra"
      />
      <RedeemAndStakeStepper
        open={dialogState.open}
        handleClose={handleClose}
        data={{ id: dialogState.id }}
        updatePositions={updateUserBonds}
        claimable={
          userRdpxBonds.find((bond) => dialogState.id === BigInt(bond.tokenId))
            ?.claimData.vested
        }
      />
    </>
  );
};

export default UserBonds;
