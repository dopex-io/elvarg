import { useCallback, useEffect, useMemo } from 'react';

import { useAccount } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import TableLayout from 'components/common/TableLayout';
import columns, {
  RedeemRequestType,
} from 'components/rdpx-v2/Tables/ColumnDefs/RedeemRequestsColumn';
import Typography2 from 'components/UI/Typography2';

import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

const RedeemRequests = () => {
  const { address: account = '0x' } = useAccount();
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
    if (userPerpetualVaultData.claimableTime > 0n) return;
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState, userPerpetualVaultData.claimableTime]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  const handleClaim = useCallback(
    async (epoch: bigint) => {
      const write = writeContract({
        abi: PerpVault,
        address: addresses.perpPool,
        functionName: 'claim',
        args: [epoch],
      });

      await write
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
          breakdown: [rr.ethAmount, rr.rdpxAmount] as readonly [bigint, bigint],
          button: {
            disabled: rr.epoch === perpetualVaultState.currentEpoch,
            label: 'Redeem',
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

  return data.length > 0 ? (
    <div className="space-y-2">
      <Typography2 variant="subtitle2" className="px-2">
        Redemptions Queued
      </Typography2>
      <TableLayout<RedeemRequestType>
        data={data}
        columns={columns}
        isContentLoading={loading && !!account}
        fill="bg-umbra"
      />
    </div>
  ) : null;
};

export default RedeemRequests;
