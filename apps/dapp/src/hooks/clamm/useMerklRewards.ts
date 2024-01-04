import { useMemo } from 'react';
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
  const { user = '0x', chainId = 42161, rewardToken, pool = '0x' } = props;

  const { data, refetch } = useQuery<ApiResult, Error>({
    queryKey: ['user-merkl-rewards'],
    queryFn: () =>
      fetch(
        `https://api.angle.money/v2/merkl?user=${'0x29ED22a9e56Ee1813e6FF69fC6caC676AA24c09c'}&chainIds%5B%5D=${chainId}`,
      ).then((res) => res.json()),
    staleTime: 3200,
  });

  const { data: claimed = [0n, 0n, '0x'] } = useContractRead({
    abi: MerklDistributor,
    address: '0x3ef3d8ba38ebe18db133cec108f4d14ce00dd9ae', // Merkl Distributor Address
    functionName: 'claimed',
    args: [user, (rewardToken?.address as Address) || '0x'],
  });

  const { writeAsync: claim } = useContractWrite({
    abi: MerklDistributor,
    address: '0x3ef3d8ba38ebe18db133cec108f4d14ce00dd9ae', // Merkl Distributor Address
    functionName: 'claim',
    args: [
      [user],
      [rewardToken?.address as Address],
      [
        BigInt(
          data?.[chainId.toString() as Chain].transactionData[
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
  });

  const avgAPR = useMemo(() => {
    return Object.values(
      data?.[chainId.toString() as Chain]?.pools?.[checksumAddress(pool)]
        ?.aprs || {},
    )[0];
  }, [chainId, data, pool]);

  return {
    data,
    claim,
    claimed,
    avgAPR,
    refetch,
    claimable:
      Object.keys(data?.[chainId.toString() as Chain]?.transactionData || {})
        .length === 0,
  };
};

export default useMerklRewards;
