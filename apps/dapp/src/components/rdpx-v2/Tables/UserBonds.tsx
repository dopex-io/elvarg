import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@dopex-io/ui';
import { Address, useAccount, useContractRead } from 'wagmi';
import { writeContract } from 'wagmi/actions';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';
import useSubgraphQueries from 'hooks/rdpx/useSubgraphQueries';

import TableLayout from 'components/common/TableLayout';
import RedeemBondAndStakeStepper from 'components/rdpx-v2/Dialogs/RedeemBondAndStakeStepper';
import RedeemDelegateBondAndStakeStepper from 'components/rdpx-v2/Dialogs/RedeemDelegateBondAndStakeStepper';
import columns, {
  UserBonds as UserBondsType,
} from 'components/rdpx-v2/Tables/ColumnDefs/BondsColumn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/UI/Tooltip';

import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

type DialogState = {
  open: boolean;
  id: bigint;
};

type DelegateBondDialogState = {
  open: boolean;
  pendingMaturedPositions: {
    positionId: bigint;
    delegationControllerAddress: Address;
  }[];
};

const UserBonds = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    id: 0n,
  });
  const [delegateRedeemDialogState, setDelegateRedeemDialogState] =
    useState<DelegateBondDialogState>({
      open: false,
      pendingMaturedPositions: [],
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
    async (posId: bigint, contractAddress: Address) => {
      const delegateBond = async () =>
        await writeContract({
          abi: DelegateBonds,
          address: contractAddress,
          functionName: 'redeem',
          args: [posId],
        });

      await delegateBond()
        .then(() => refetchBalance().then(() => updateDelegateBonds()))
        .catch((e) => console.error(e));
    },
    [refetchBalance, updateDelegateBonds],
  );

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleCloseDelegateBondDialog = useCallback(() => {
    setDelegateRedeemDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const userRdpxBonds = useMemo(() => {
    if (userBonds.length === 0 && delegateBonds.length === 0) return [];

    const formattedDelegateBonds = delegateBonds
      .map((bond) => ({
        id: BigInt(bond.positionId),
        maturity: bond.maturity,
        contractAddress: bond.contractAddress,
        amount: bond.amount,
        redeemed: bond.redeemed,
        timestamp: bond.timestamp,
        positionId: BigInt(bond.positionId),
        vestedAmount:
          bond.maturity * 1000n > BigInt(new Date().getTime())
            ? 0n
            : bond.amount,
        claimableBalance: 0n,
      }))
      .filter((pos) => !pos.redeemed); // filter out redeemed bonds

    return userBonds.concat(formattedDelegateBonds).map((bond) => {
      let disabled = false;
      if (bond.positionId !== -1n) {
        disabled = bond.maturity * 1000n > BigInt(new Date().getTime());
      }

      const handleRedeem = () => {
        if (bond.positionId === -1n) handleVest(bond.id);
        else redeemDelegateBond(BigInt(bond.positionId), bond.contractAddress);
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
          label: 'Claim',
          id: bond.id,
          disabled, // enable if either bond has matured or bond is vested
          action: handleRedeem,
        },
      };
    });
  }, [delegateBonds, redeemDelegateBond, userBonds]);

  const redeemableDelegateBonds = useMemo(() => {
    let _pendingDelegateBonds = [];
    for (let i = 0; i < delegateBonds.length; i++) {
      if (
        delegateBonds[i].maturity * 1000n < BigInt(new Date().getTime()) &&
        !delegateBonds[i].redeemed &&
        delegateBonds[i].contractAddress === addresses.delegateBondsV2
      ) {
        _pendingDelegateBonds.push({
          positionId: BigInt(delegateBonds[i].positionId),
          delegationControllerAddress: delegateBonds[i].contractAddress,
        });
        /**
         * @todo: Imminent bug when delegate and delegatee is the same address. Such a case occurs when user delegates WETH,
         * then uses their own WETH to bond with rDPX. Duplicate position IDs appear in such cases. This requires usage of
         * Set<bigint>(positionIds) if contractAddress is the same across duplicate position IDs.
         **/
      }
    }

    return _pendingDelegateBonds;
  }, [delegateBonds]);

  useEffect(() => {
    updateUserBonds();
  }, [updateUserBonds]);

  useEffect(() => {
    updateDelegateBonds();
  }, [updateDelegateBonds, userBonds]);

  return (
    <>
      <div className="flex flex-col space-y-1">
        <TableLayout<UserBondsType>
          data={userRdpxBonds}
          columns={columns}
          rowSpacing={2}
          isContentLoading={loading && user !== '0x'}
          fill="bg-umbra"
        />
        {redeemableDelegateBonds.length > 0 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() =>
                    setDelegateRedeemDialogState((prev) => ({
                      ...prev,
                      open: true,
                    }))
                  }
                  className="w-full"
                >
                  Redeem All Delegate Bonds
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-umbra w-auto backdrop-blur-md">
                <p className="text-white text-sm">
                  Redeem all pending delegated bonds in a single transaction.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <RedeemDelegateBondAndStakeStepper
        open={delegateRedeemDialogState.open}
        data={{ positions: redeemableDelegateBonds }}
        handleClose={handleCloseDelegateBondDialog}
        updatePositions={updateDelegateBonds}
      />
      <RedeemBondAndStakeStepper
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
