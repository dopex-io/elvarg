import React, { useCallback } from 'react';
import { BaseError, encodeFunctionData, parseAbi } from 'viem';

import { Button } from '@dopex-io/ui';
import toast from 'react-hot-toast';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useClammPositions from 'hooks/clamm/useClammPositions';

import { LPPositionMeta } from 'utils/clamm/varrock/types';

import { MULTI_CALL_FN_SIG } from 'constants/clamm';
import { DEFAULT_CHAIN_ID } from 'constants/env';

type Props = {
  positions: Map<number, LPPositionMeta>;
  deselectAll: () => void;
};

const MultiWithdrawButton = ({ positions, deselectAll }: Props) => {
  const { updateLPPositions } = useClammPositions();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({
    chainId: chain?.id ?? DEFAULT_CHAIN_ID,
  });
  const { address: userAddress } = useAccount();

  const handleWithdrawAll = useCallback(async () => {
    if (!userAddress || !chain || !walletClient) return;
    const { publicClient } = wagmiConfig;
    const positionsArray = Array.from(positions);
    const toastLoadingId = toast.loading('Opening wallet');

    try {
      const to = positionsArray[0][1].withdrawTx.to;
      const encodedTxData = encodeFunctionData({
        abi: parseAbi([MULTI_CALL_FN_SIG]),
        functionName: 'multicall',
        args: [positionsArray.map(([_, v]) => v.withdrawTx.txData)],
      });

      const request = await walletClient.prepareTransactionRequest({
        account: walletClient.account,
        to: to,
        data: encodedTxData,
        type: 'legacy',
      });
      const hash = await walletClient.sendTransaction(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
    } catch (err) {
      const error = err as BaseError;
      toast.error(error.shortMessage);
      console.error(err);
    }

    toast.remove(toastLoadingId);
    await updateLPPositions?.();
    deselectAll();
  }, [
    chain,
    positions,
    userAddress,
    walletClient,
    updateLPPositions,
    deselectAll,
  ]);

  return (
    <Button
      className="text-xs"
      size="xsmall"
      disabled={positions.size < 2}
      onClick={handleWithdrawAll}
    >
      Withdraw All
    </Button>
  );
};

export default MultiWithdrawButton;
