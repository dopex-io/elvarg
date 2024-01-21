import { useCallback, useMemo } from 'react';
import { BaseError, Hex, maxUint256, TypedData } from 'viem';

import LimitExercise from 'abis/clamm/LimitExercise';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  Address,
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData,
} from 'wagmi';

import { EXERCISE_PLUGINS } from 'constants/clamm';
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

type OrderSignature = {
  optionId: bigint;
  minProfit: bigint;
  deadline: bigint;
  profitToken: Address;
  optionMarket: Address;
  signer: Address;
  v: number;
  r: Hex;
  s: Hex;
};

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
  const { writeAsync: writecancelLimitOrder } = useContractWrite({
    address: EXERCISE_PLUGINS['LIMIT-EXERCISE'].contract,
    abi: LimitExercise,
    functionName: 'cancelOrder',
  });

  const chainId = useMemo(() => {
    return chain?.id ?? DEFAULT_CHAIN_ID;
  }, [chain?.id]);

  const domain = useMemo(() => {
    return {
      name: 'DopexV2_Clamm_Limit_Exercise_Order',
      version: '1',
      chainId: chainId,
      verifyingContract: EXERCISE_PLUGINS['LIMIT-EXERCISE'].contract,
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
      console.log('min profit', minProfit);
      if (minProfit === 0n) minProfit = maxUint256;
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
        if (err instanceof BaseError) {
          toast.error(err['shortMessage']);
        } else if (err instanceof AxiosError) {
          toast.error(err.response?.data['message']);
        } else {
          console.error(err);
          toast.error(
            'Something went wrong. Check console for detailed error.',
          );
        }
      }
      toast.remove(id);
    },
    [address, domain, signTypedDataAsync, chainId],
  );

  const cancelLimitOrder = useCallback(
    async ({
      deadline,
      minProfit,
      optionId,
      optionMarket,
      profitToken,
      signer,
      v,
      r,
      s,
    }: OrderSignature) => {
      const id = toast.loading('Opening wallet');

      try {
        await writecancelLimitOrder({
          args: [
            {
              optionId,
              minProfit,
              deadline,
              optionMarket,
              profitToken,
              signer,
            },
            { v, r, s },
          ],
        });

        await axios
          .post(`${VARROCK_BASE_API_URL}/clamm/exercise/delete-limit-order`, {
            chainId,
            optionMarket,
            optionId: optionId.toString(),
          })
          .catch(() => toast.error('Unable to delete order'));

        toast.success('Limit exercise order removed');
      } catch (err) {
        if (err instanceof BaseError) {
          toast.error(err.shortMessage);
        } else {
          console.error(err);
          toast.error('Transaction Failed');
        }
      }

      toast.remove(id);
    },
    [writecancelLimitOrder, chainId],
  );

  return { createLimitOrder, cancelLimitOrder };
};

export default useLimitExercise;
