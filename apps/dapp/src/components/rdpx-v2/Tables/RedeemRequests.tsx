import { useCallback, useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import TableLayout from 'components/common/TableLayout';
import Typography2 from 'components/UI/Typography2';

import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

import columns, { RedeemRequestType } from './ColumnDefs/RedeemRequestsColumn';

const RedeemRequests = () => {
  const { address: account } = useAccount();
  const {
    updateUserPerpetualVaultData,
    userPerpetualVaultData,
    perpetualVaultState,
    updatePerpetualVaultState,
    loading,
  } = usePerpPoolData({
    user: account || '0x',
  });

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  const handleClaim = useCallback(
    (epoch: bigint) => {
      const write = async () =>
        await writeContract({
          abi: PerpVault,
          address: addresses.perpPool,
          functionName: 'claim',
          args: [epoch],
        });
      write()
        .then(() => updateUserPerpetualVaultData())
        .catch((e) => console.error(e));
    },
    [updateUserPerpetualVaultData],
  );

  const data = useMemo(() => {
    if (
      userPerpetualVaultData.redeemRequests.length === 0 ||
      !userPerpetualVaultData.redeemRequests
    )
      return [];
    return userPerpetualVaultData.redeemRequests
      .map((rr) => {
        return {
          epoch: rr.epoch,
          amount: rr.amount,
          breakdown: [rr.rdpxAmount, rr.ethAmount] as readonly [bigint, bigint],
          button: {
            disabled: rr.epoch === perpetualVaultState.currentEpoch,
            label: 'Withdraw',
            handler: () => handleClaim(rr.epoch),
          },
        };
      })
      .sort((prev, curr) => Number(prev.epoch - curr.epoch));
  }, [
    userPerpetualVaultData.redeemRequests,
    perpetualVaultState.currentEpoch,
    handleClaim,
  ]);

  return (
    <div className="space-y-2">
      <Typography2 variant="subtitle2" className="px-2">
        Withdrawals Queued
      </Typography2>
      <TableLayout<RedeemRequestType>
        data={data}
        columns={columns}
        isContentLoading={loading}
        fill="bg-umbra"
      />
    </div>
  );
};

export default RedeemRequests;
