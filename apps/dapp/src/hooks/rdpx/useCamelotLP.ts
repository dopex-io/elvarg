import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import { range } from 'lodash';
import { useContractRead, usePublicClient } from 'wagmi';
import { readContract } from 'wagmi/actions';

import CamelotPositionManager from 'constants/rdpx/abis/CamelotPositionManager';
import addresses from 'constants/rdpx/addresses';

export interface CamelotPosition {
  id: bigint;
  liquidity: bigint;
  poolComposition: readonly [bigint, bigint];
}

interface Props {
  user: Address;
}

export const camelotPositionManagerContractConfig = {
  abi: CamelotPositionManager,
  address: addresses.camelotPositionManager,
};

const useCamelotLP = ({ user = '0x' }: Props) => {
  const [camelotPositionManagerState, setCamelotPositionManagerState] =
    useState<CamelotPosition[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const { data: balance = 0n } = useContractRead({
    ...camelotPositionManagerContractConfig,
    functionName: 'balanceOf',
    args: [user],
  });
  const { simulateContract } = usePublicClient({
    chainId: 42161,
  });

  const updateUserCamelotPositions = useCallback(async () => {
    if (user === '0x' || user === zeroAddress) return;
    setLoading(true);
    let multicallAggregate = [];
    for (const i of range(Number(balance))) {
      const contractCall = readContract({
        ...camelotPositionManagerContractConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [user, BigInt(i)],
      });
      multicallAggregate.push(contractCall);
    }
    const tokenIds = await Promise.all(multicallAggregate);

    multicallAggregate = [];
    for (const tokenId of tokenIds) {
      const contractCall = readContract({
        ...camelotPositionManagerContractConfig,
        functionName: 'positions',
        args: [tokenId],
      });
      multicallAggregate.push(contractCall);
    }
    let userPositions = await Promise.all(multicallAggregate);

    const promises = [];

    for (let i = 0; i < userPositions.length; i++) {
      const poolComposition = simulateContract({
        abi: CamelotPositionManager,
        address: addresses.camelotPositionManager,
        functionName: 'decreaseLiquidity',
        args: [
          {
            tokenId: tokenIds[i],
            liquidity: userPositions[i][6],
            amount0Min: 0n,
            amount1Min: 0n,
            deadline: BigInt(Math.floor(new Date().getTime() / 1000) + 1000000),
          },
        ],
      });
      promises.push(poolComposition);
    }

    const poolCompositions = await Promise.all(promises);
    try {
      setCamelotPositionManagerState(
        userPositions
          .map((position, index) => ({
            id: tokenIds[index],
            liquidity: position[6],
            poolComposition: poolCompositions[index].result,
          }))
          .filter((position) => position.poolComposition[1] !== 0n),
      );

      setLoading(false);
    } catch (e) {
      console.error(e);
      throw new Error('Something went wrong updating user bonds...');
    }
  }, [user, balance, simulateContract]);

  return {
    camelotPositionManagerState,
    loading,
    updateUserCamelotPositions,
    balance,
  };
};

export default useCamelotLP;
