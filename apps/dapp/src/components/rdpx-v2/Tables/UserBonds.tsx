import { useCallback, useEffect, useMemo } from 'react';
import { parseUnits } from 'viem';

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePublicClient,
} from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData, { UserBond } from 'hooks/rdpx/useRdpxV2CoreData';
import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import columns, {
  UserBonds as UserBondsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/BondsColumn';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
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
  const { simulateContract } = usePublicClient({
    chainId: 42161,
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

      const { result: rtEthAmount = 0n } = await simulateContract({
        account: user,
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
          args: [
            addresses.receiptTokenStaking,
            userBalance === 0n ? rtEthAmount : userBalance,
          ],
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
    [simulateContract, user, userBalance, refetchBalance, updateUserBonds],
  );

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
      let label = !!isApprovedForAll ? 'Vest+Stake' : 'Approve';
      if (bond.positionId) {
        label = 'Redeem';
      }

      const handleRedeem = () => {
        if (!bond.positionId) {
          !!isApprovedForAll
            ? handleVest(bond.id).catch((e) => console.error(e))
            : approveBond()
                .then(() => refetch())
                .catch((e) => console.error(e));
        } else redeemDelegateBond(bond.positionId);
      };

      return {
        tokenId: String(bond.id),
        maturity: bond.maturity,
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
  }, [
    userBonds,
    delegateBonds,
    isApprovedForAll,
    handleVest,
    approveBond,
    refetch,
    redeemDelegateBond,
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
