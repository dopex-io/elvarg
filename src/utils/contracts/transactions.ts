import toast from 'react-hot-toast';
import { ContractTransaction } from 'ethers';

import TransactionToast from 'utils/components/TransactionToast';

export async function newEthersTransaction(
  transaction: Promise<ContractTransaction>,
  waitingMessage: string = 'Please confirm the transaction...',
  loadingMessage: string = 'Transaction pending...',
  successMessage: string = 'Transaction confirmed',
  revertMessage: string = 'Transaction rejected'
): Promise<void> {
  let toastId: string;
  try {
    toastId = toast.loading(waitingMessage);
    const tx = await transaction;
    toast.loading(
      TransactionToast({ message: loadingMessage, txHash: tx.hash }),
      { id: toastId }
    );
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      toast.success(
        TransactionToast({
          message: successMessage,
          txHash: tx.hash,
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
        }),
        {
          id: toastId,
        }
      );
    }
  } catch (err) {
    if (err?.data?.message !== undefined) {
      toast.error(err.data.message, { id: toastId });
    } else {
      console.log(err);
      toast.error(err.message, { id: toastId });
    }
  }
}
