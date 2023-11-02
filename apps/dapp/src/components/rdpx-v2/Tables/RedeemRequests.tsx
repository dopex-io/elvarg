import { useEffect, useMemo, useState } from 'react';

import { useAccount, useContractWrite } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import TableLayout from 'components/common/TableLayout';
import Typography2 from 'components/UI/Typography2';

import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

import columns, { RedeemRequestType } from './ColumnDefs/RedeemRequestsColumn';

const RedeemRequests = () => {
  const [epoch, setEpoch] = useState<bigint>(0n);

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
  const { write: redeem, isSuccess: redeemSuccess } = useContractWrite({
    abi: PerpVault,
    address: addresses.perpPool,
    functionName: 'claim',
    args: [epoch],
  });

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData, redeemSuccess]);

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
            handler: () => {
              setEpoch(rr.epoch);
              redeem();
            },
          },
        };
      })
      .sort((prev, curr) => Number(prev.epoch - curr.epoch));
  }, [
    perpetualVaultState.currentEpoch,
    userPerpetualVaultData.redeemRequests,
    redeem,
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
