import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { ContractTransaction } from 'ethers';

import TransactionToast from 'components/UI/TransactionToast';

import { useBoundStore } from 'store';
import errorParser from './errorParser';

const useSendTx = () => {
  const { wrongNetwork, chainId } = useBoundStore();

  const sendTx = useCallback(
    async (
      transaction: Promise<ContractTransaction>,
      waitingMessage: string = 'Please confirm the transaction...',
      loadingMessage: string = 'Transaction pending...',
      successMessage: string = 'Transaction confirmed',
      revertMessage: string = 'Transaction rejected'
    ) => {
      let toastId: string;
      if (wrongNetwork) {
        toast.error('Wrong Network');
        return;
      }
      toastId = toast.loading(waitingMessage);
      try {
        const tx = await transaction;
        toast.loading(
          TransactionToast({
            message: loadingMessage,
            txHash: tx.hash,
            chainId,
          }),
          { id: toastId }
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          toast.success(
            TransactionToast({
              message: successMessage,
              txHash: tx.hash,
              chainId,
            }),
            {
              id: toastId,
            }
          );
        } else {
          toast.error(
            TransactionToast({
              message: revertMessage,
              txHash: tx.hash,
              chainId,
            }),
            {
              id: toastId,
            }
          );
        }
      } catch (err: any) {
        if (err?.data?.message !== undefined) {
          toast.error(err.data.message, { id: toastId });
        } else {
          if (err.message.includes('user rejected transaction'))
            toast('You rejected the transaction', { id: toastId, icon: '🤑' });
          else toast.error(errorParser(err.message), { id: toastId });
        }
        throw Error(err);
      }
    },
    [wrongNetwork, chainId]
  );
  return sendTx;
};

export default useSendTx;
