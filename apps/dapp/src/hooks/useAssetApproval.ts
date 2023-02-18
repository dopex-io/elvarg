import { useState, useCallback } from 'react';
import { MAX_VALUE } from 'constants/index';
import { ERC20__factory } from '@dopex-io/sdk';
import { Signer } from 'ethers';
import useSendTx from './useSendTx';
import { BigNumber } from 'ethers';

type UseAssetApproval = (
  signer: Signer | undefined,
  contractAddress: string,
  tokenAddress: string
) => [() => Promise<void>, boolean];

const useAssetApproval: UseAssetApproval = (
  signer,
  contractAddress,
  tokenAddress
) => {
  const sendTx = useSendTx();

  const [tokenApproved, setTokenApproved] = useState<boolean>(false);

  const handleAssetApprove = useCallback(async () => {
    if (!signer || !contractAddress || !tokenAddress) return;
    try {
      const token = await ERC20__factory.connect(tokenAddress, signer);
      const allowance = await token.allowance(
        await signer.getAddress(),
        contractAddress
      );
      if (allowance > BigNumber.from(0)) {
        setTokenApproved(true);
        return;
      }

      await sendTx(token, 'approve', [contractAddress, MAX_VALUE]);
      setTokenApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, contractAddress, tokenAddress]);

  return [handleAssetApprove, tokenApproved];
};

export default useAssetApproval;
