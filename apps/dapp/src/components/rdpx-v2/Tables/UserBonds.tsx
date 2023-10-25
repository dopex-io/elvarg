import { useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers';

import { RdpxV2Bond__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import TableLayout from 'components/common/TableLayout';

import columns, { UserBonds as UserBondsType } from './ColumnDefs/BondsColumn';

const UserBonds = () => {
  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    userDscBondsData,
    treasuryContractState,
    updateTreasuryData,
    treasuryData,
    updateUserDscBondsData,
    isLoading,
  } = useBoundStore();

  const handleRedeem = useCallback(
    async (tokenId: number) => {
      if (!signer || !treasuryContractState.contracts || !accountAddress)
        return;

      const bond = RdpxV2Bond__factory.connect(
        treasuryContractState.contracts.bond.address,
        signer
      );

      const treasury = RdpxV2Treasury__factory.connect(
        treasuryContractState.contracts.treasury.address,
        signer
      );

      const isApproved = (await bond.getApproved(tokenId))
        .toString()
        .toLowerCase()
        .includes(treasury.address.toLowerCase());

      try {
        if (!isApproved)
          await sendTx(bond, 'approve', [treasury.address, tokenId]);
        await sendTx(treasury, 'redeem', [tokenId, accountAddress]).then(() => {
          updateTreasuryData();
          updateUserDscBondsData();
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
      updateUserDscBondsData,
      updateTreasuryData,
    ]
  );

  const userBonds: UserBondsType[] = useMemo(() => {
    // if (userDscBondsData.bonds.length === 0 || !treasuryData) return [];

    return [
      {
        tokenId: 0,
        amount: BigNumber.from(10),
        redeemable: false,
        maturity: 86400,
        timestamp: 0,
        button: {
          handleRedeem: () => handleRedeem(0),
          redeemable: false,
          id: 0,
        },
      },
    ];

    // return userDscBondsData.bonds.map((bond) => {
    //   const redeemable =
    //     Number(bond.maturity) * 1000 < Math.ceil(Number(new Date()));

    //   return {
    //     tokenId: Number(bond.tokenId),
    //     amount: BigNumber.from(bond.amount),
    //     redeemable,
    //     maturity: bond.maturity,
    //     timestamp: Number(bond.timestamp),
    //     button: {
    //       handleRedeem: () => handleRedeem(bond.tokenId),
    //       redeemable,
    //       id: bond.tokenId,
    //     },
    //   };
    // });
  }, [handleRedeem /* userDscBondsData.bonds, treasuryData*/]);

  return (
    <TableLayout<UserBondsType>
      data={userBonds}
      columns={columns}
      rowSpacing={2}
      isContentLoading={isLoading}
    />
  );
};

export default UserBonds;
