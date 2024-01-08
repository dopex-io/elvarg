import { useCallback, useMemo } from 'react';
import { TypedData } from 'viem';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Address, useAccount, useNetwork, useSignTypedData } from 'wagmi';

import { LIMIT_EXERCISE_CONTRACT } from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

const types = {
  Order: [
    { name: 'optionId', type: 'uint256' },
    { name: 'minProfit', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'profitToken', type: 'address' },
    { name: 'optionMarket', type: 'address' },
    { name: 'signer', type: 'address' },
  ],
} as const satisfies TypedData;

type CreateLimitOrder = {
  optionId: bigint;
  minProfit: bigint;
  deadline: bigint;
  profitToken: Address;
  optionMarket: Address;
};

const useLimitExercise = () => {
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const chainId = useMemo(() => {
    return chain?.id ?? DEFAULT_CHAIN_ID;
  }, [chain?.id]);

  const domain = useMemo(() => {
    return {
      name: 'DopexV2_Clamm_Limit_Exercise_Order',
      version: '1',
      chainId: chainId,
      verifyingContract: LIMIT_EXERCISE_CONTRACT,
    } as const;
  }, [chainId]);

  const createLimitOrder = useCallback(
    async ({
      deadline,
      minProfit,
      optionId,
      optionMarket,
      profitToken,
    }: CreateLimitOrder) => {
      const id = toast.loading('Opening wallet');

      let signError = true;
      try {
        const signatureHex = await signTypedDataAsync({
          account: address!,
          message: {
            optionId,
            minProfit,
            deadline,
            profitToken,
            optionMarket,
            signer: address!,
          },
          primaryType: 'Order',
          types,
          domain,
        });

        signError = false;
        await axios.post(
          `${VARROCK_BASE_API_URL}/clamm/exercise/create-limit-order`,
          {
            chainId,
            optionMarket,
            optionId: optionId.toString(),
            deadline: deadline.toString(),
            minProfit: minProfit.toString(),
            profitToken,
            signatureHex,
          },
        );

        toast.success('Success');
      } catch (err: any) {
        if (signError) {
          toast.error(err['shortMessage']);
        } else {
          console.error(err);
          toast.error('Failed to save signature');
        }
      }
      toast.remove(id);
    },
    [address, domain, signTypedDataAsync, chainId],
  );

  return { createLimitOrder };
};

export default useLimitExercise;
