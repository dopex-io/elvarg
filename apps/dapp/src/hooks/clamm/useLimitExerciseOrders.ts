import { useMemo } from 'react';
import { Address, Hex, zeroAddress } from 'viem';

import { useQuery } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import useClammStore from './useClammStore';

type ExerciseOrder = {
  optionId: string;
  optionMarket: Address;
  signer: Address;
  minProfit: string;
  deadline: string;
  profitToken: Address;
  v: number;
  r: Hex;
  s: Hex;
};

const useLimitExerciseOrders = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();

  const params = useMemo(() => {
    return {
      chainId: (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      optionMarket: selectedOptionsPool?.optionsPoolAddress ?? zeroAddress,
      user: address ?? zeroAddress,
    };
  }, [address, chain?.id, selectedOptionsPool?.optionsPoolAddress]);

  const { data, isError, refetch, isRefetching, isLoading } = useQuery<
    ExerciseOrder[]
  >({
    queryKey: [
      'CLAMM-EXERCISE-ORDERS',
      params.chainId,
      params.optionMarket,
      params.user,
    ],
    queryFn: async () => {
      const { chainId, optionMarket, user } = params;
      const queryURL = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/orders`);
      queryURL.searchParams.set('chainId', chainId);
      queryURL.searchParams.set('optionMarket', optionMarket);
      queryURL.searchParams.set('user', user);
      return await fetch(queryURL).then((res) => res.json());
    },
  });

  return {
    data: isError ? [] : data ?? [],
    isError,
    refetch,
    isRefetching,
    isLoading,
  };
};

export default useLimitExerciseOrders;
