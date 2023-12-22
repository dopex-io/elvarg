import React, { useCallback, useMemo, useState } from 'react';
import {
  Address,
  BaseError,
  encodeFunctionData,
  Hex,
  parseAbi,
  zeroAddress,
} from 'viem';

import { Button } from '@dopex-io/ui';
import toast from 'react-hot-toast';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';

import Filter from 'components/common/Filter';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

import FilterSettings from './Dialogs/FilterSettings';
import WithdrawSummary from './Dialogs/WithdrawSummary';

type Props = {
  selectedPositions: Map<number, any | null>;
  positionsTypeIndex: number;
  resetPositions: () => void;
};
const ActionButton = (props: Props) => {
  const { positionsTypeIndex, selectedPositions, resetPositions } = props;
  const { updateLPPositions } = useClammPositions();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

  const handleAction = useCallback(async () => {
    if (!userAddress || !chain || !walletClient) return;
    const { publicClient } = wagmiConfig;

    let to: Address = zeroAddress;
    let encodedTxData: Hex = '0x0';

    const positionsArray = Array.from(selectedPositions);
    const toastLoadingId = toast.loading('Opening wallet');
    try {
      // if (positionsTypeIndex === 1) {
      to = positionsArray[0][1].withdrawTx.to;
      encodedTxData = encodeFunctionData({
        abi: parseAbi([MULTI_CALL_FN_SIG]),
        functionName: 'multicall',
        args: [positionsArray.map(([_, v]) => v.withdrawTx.txData)],
      });
      // } else {
      //   to = positionsArray[0][1].exerciseTx.to;
      //   encodedTxData = encodeFunctionData({
      //     abi: parseAbi([MULTI_CALL_FN_SIG]),
      //     functionName: 'multicall',
      //     args: [positionsArray.map(([_, v]) => v.exerciseTx.txData)],
      //   });
      // }

      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: to,
        data: encodedTxData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      const reciept = await publicClient.waitForTransactionReceipt({
        hash,
      });
      toast.success('Transaction sent');
      resetPositions();
    } catch (err) {
      const error = err as BaseError;
      toast.error(error.shortMessage);
      console.error(err);
    }
    toast.remove(toastLoadingId);
    await updateLPPositions?.();
  }, [
    resetPositions,
    chain,
    selectedPositions,
    userAddress,
    walletClient,
    updateLPPositions,
  ]);

  const buttonProps = useMemo(() => {
    const isBuyPositions = positionsTypeIndex === 0;
    const action = isBuyPositions ? 'Multi Exercise' : 'Multi Withdraw';
    return {
      buttonText: action,
      disabled: selectedPositions.size < 2,
    };
  }, [positionsTypeIndex, selectedPositions]);
  return (
    <div>
      <Button
        size="small"
        variant={buttonProps.disabled ? 'text' : 'contained'}
        // disabled={buttonProps.disabled}
        className="w-[200px] bg-carbon"
        onClick={openDialog}
      >
        {buttonProps.buttonText}
      </Button>
      <FilterSettings handleClose={closeDialog} isOpen={dialogOpen} />
    </div>
  );
};

export default ActionButton;
