import { useEffect, useMemo } from 'react';
import { Address, checksumAddress } from 'viem';

import { useQuery } from '@tanstack/react-query';
import MerklDistributor from 'abis/clamm/MerklDistributor';
import { Token } from 'types';
import { useContractRead, useContractWrite } from 'wagmi';

const chains = ['42161', '137'] as const;
type Chain = (typeof chains)[number];

type Props = {
  user: Address | undefined;
  chainId: number;
  rewardToken: Token | undefined;
  pool: Address | undefined;
};

type ApiResult = {
  [key in (typeof chains)[number]]: {
    merkleRoot: string;
    message: string;
    pools: {
      [key: string]: {
        meanAPR: string;
        aprs: Record<string, number>;
      };
    };
    validRewardTokens: {
      minimumAmountPerEpoch: number;
      token: string;
      decimals: number;
      symbol: string;
    }[];
    transactionData: Record<
      string,
      {
        claim: string;
        leaf: string;
        proof: Array<`0x${string}`>;
        token: Address;
      }
    >;
  };
};

const useMerklRewards = (props: Props) => {
  const { user, chainId = 42161, rewardToken, pool = '0x' } = props;

  const { data, refetch } = useQuery<ApiResult, Error>({
    queryKey: ['user-merkl-rewards'],
    queryFn: () =>
      fetch(
        `https://api.angle.money/v2/merkl?user=${user}&chainIds%5B%5D=${chainId}`,
      )
        .then((res) => res.json())
        .catch((e) => console.error(e)),
    staleTime: 3200,
  });

  const { data: claimed = [0n, 0n, '0x'] } = useContractRead({
    abi: MerklDistributor,
    address: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Merkl Distributor Address
    functionName: 'claimed',
    args: [user || '0x', (rewardToken?.address as Address) || '0x'],
  });

  const { writeAsync: claim, isLoading: claiming } = useContractWrite({
    abi: MerklDistributor,
    address: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Merkl Distributor Address
    functionName: 'claim',
    args: [
      [user || '0x'],
      [rewardToken?.address as Address],
      [
        BigInt(
          data?.[chainId.toString() as Chain]?.transactionData[
            rewardToken?.address as Address
          ]?.claim || 0n,
        ),
      ],
      [
        data?.[chainId.toString() as Chain]?.transactionData[
          rewardToken?.address as Address
        ]?.proof.map((proof) => proof) ?? [
          '0x0000000000000000000000000000000000000000000000000000000000000000' as Address,
        ],
      ],
    ],
    onError: (e) => console.error(e),
  });

  const avgAPR = useMemo(() => {
    return Object.values(
      data?.[chainId.toString() as Chain]?.pools?.[checksumAddress(pool)]
        ?.aprs || {},
    )[0];
  }, [chainId, data, pool]);

  useEffect(() => {
    if (
      user === '0x' ||
      Object.keys(data?.[chainId.toString() as Chain]?.transactionData || {})
        .length === 0
    )
      refetch();
  }, [chainId, data, refetch, user]);

  return {
    data,
    claim,
    claimed,
    claiming,
    avgAPR,
    refetch,
    tokenSymbol: rewardToken?.symbol || 'N/A',
    claimableAmount: useMemo(
      () =>
        BigInt(
          data?.[chainId.toString() as Chain]?.transactionData?.[
            rewardToken?.address as Address
          ].claim || 0,
        ) - claimed[0],
      [chainId, claimed, data, rewardToken?.address],
    ),
    claimable:
      Object.keys(data?.[chainId.toString() as Chain]?.transactionData || {})
        .length === 0,
  };
};

export default useMerklRewards;
