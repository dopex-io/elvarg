import { useEffect, useMemo, useState } from 'react';

import { useAccount, useContractWrite } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import TableLayout from 'components/common/TableLayout';

import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

import columns, { UserBonds as UserBondsType } from './ColumnDefs/BondsColumn';

const UserBonds = () => {
  const [amount, setAmount] = useState<bigint>(0n);

  const { address: account } = useAccount();
  const { updateUserBonds, userBonds, loading } = useRdpxV2CoreData({
    user: account || '0x',
  });

  const { updateBalance, updateAllowance, approved } = useTokenData({
    amount,
    spender: addresses.receiptToken,
    token: addresses.receiptToken,
  });

  const { write: approve } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'approve',
    args: [addresses.receiptToken, amount],
  });

  // todo: incomplete contract implementation
  const { write: redeem } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'redeem',
    args: [amount],
  });

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0) return [];

    return userBonds.map((bond) => {
      const redeemable =
        bond.maturity <= BigInt(Math.ceil(new Date().getTime()));
      let label = 'Redeem';
      if (redeemable) {
        label = approved ? 'Redeem' : 'Approve';
      }
      return {
        tokenId: bond.id,
        maturity: bond.maturity,
        amount: bond.amount,
        redeemable,
        timestamp: bond.timestamp,
        button: {
          handleRedeem: () => {
            setAmount(bond.amount);
            approved ? redeem() : approve();
          },
          redeemable,
          id: bond.id,
          label,
        },
      };
    });
  }, [userBonds, approve, approved, redeem]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds]);

  return (
    <TableLayout<UserBondsType>
      data={userRdpxBonds}
      columns={columns}
      rowSpacing={2}
      isContentLoading={loading}
      fill="bg-umbra"
    />
  );
};

export default UserBonds;
