import { useCallback, useEffect, useMemo } from 'react';
import { parseUnits } from 'viem';

import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData, { UserBond } from 'hooks/rdpx/useRdpxV2CoreData';
import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import columns, {
  UserBonds as UserBondsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/BondsColumn';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

const UserBonds = () => {
  const { address: user = '0x' } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user,
  });
  const { delegateBonds, updateDelegateBonds } = useSubgraphQueries({
    user,
  });

  const { data: isApprovedForAll, refetch } = useContractRead({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'isApprovedForAll',
    args: [user || '0x', addresses.v2core],
  });
  const { writeAsync: approveBond, isSuccess: approveSuccess } =
    useContractWrite({
      abi: RdpxV2Bond,
      address: addresses.bond,
      functionName: 'setApprovalForAll',
      args: [addresses.v2core, true],
    });
  const { data: userBalance = 0n, refetch: refetchBalance } = useContractRead({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'balanceOf',
    args: [user],
  });

  const handleVest = useCallback(
    async (id: bigint) => {
      const vest = async () =>
        await writeContract({
          abi: RdpxV2Core,
          address: addresses.v2core,
          functionName: 'redeemReceiptTokenBonds',
          args: [id, user],
        });

      const approveStaking = async () =>
        await writeContract({
          abi: ReceiptToken,
          address: addresses.receiptToken,
          functionName: 'approve',
          args: [addresses.receiptTokenStaking, userBalance],
        });

      const stake = async () =>
        await writeContract({
          abi: CurveMultiRewards,
          address: addresses.receiptTokenStaking,
          functionName: 'stake',
          args: [
            (userBalance * parseUnits('1', DECIMALS_TOKEN)) /
              parseUnits('1', DECIMALS_TOKEN),
          ],
        });

      await vest()
        .then(() =>
          refetchBalance().then(() =>
            approveStaking()
              .then(() => stake())
              .catch((e) => console.error(e)),
          ),
        )
        .then(() => updateUserBonds())
        .catch((e) => console.error(e));
    },
    [user, userBalance, refetchBalance, updateUserBonds],
  );

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0 || delegateBonds.length === 0) return [];

    const formattedDelegateBonds: UserBond[] = delegateBonds.map((bond) => ({
      id: -1n,
      maturity: bond.maturity * 1000n,
      // redeemable: bond.maturity * 1000n < BigInt(new Date().getTime()),
      amount: bond.amount,
      timestamp: bond.timestamp * 1000n,
      vestedAmount: 0n,
      claimableBalance: 0n,
    }));

    return userBonds.concat(formattedDelegateBonds).map((bond) => {
      let label = !!isApprovedForAll ? 'Stake' : 'Approve';
      if (bond.id === -1n) {
        label = 'Redeem';
      }

      return {
        tokenId: bond.id === -1n ? 'Delegated' : String(bond.id),
        maturity: bond.maturity,
        redeemable: bond.id > 0n,
        timestamp: bond.timestamp,
        claimData: {
          vested: bond.vestedAmount,
          claimable: bond.claimableBalance,
          amount: bond.amount,
        },
        button: {
          label: label,
          id: bond.id,
          redeemable: bond.id > 0n,
          handleRedeem: () => {
            if (bond.id > 0n) {
              !!isApprovedForAll
                ? handleVest(bond.id).catch((e) => console.error(e))
                : approveBond()
                    .then(() => refetch())
                    .catch((e) => console.error(e));
            } else {
            }
          },
        },
      };
    });
  }, [
    userBonds,
    delegateBonds,
    isApprovedForAll,
    handleVest,
    approveBond,
    refetch,
  ]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds, approveSuccess]);

  useEffect(() => {
    updateDelegateBonds();
  }, [updateDelegateBonds, approveSuccess, userBonds]);

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
