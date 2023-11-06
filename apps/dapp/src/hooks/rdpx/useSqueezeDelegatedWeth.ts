import { useCallback, useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  user: Address;
  collateralRequired: bigint;
  bondsToMint: string;
}
const useSqueezeDelegatedWeth = ({
  user,
  collateralRequired,
  bondsToMint,
}: Props) => {
  const { delegatePositions, updateUserDelegatePositions } = useRdpxV2CoreData({
    user,
  });

  const [squeezeResult, setSqueezeResult] = useState<{
    ids: bigint[];
    wethToBeUsed: bigint;
    amounts: bigint[];
    totalWethAvailable: bigint;
  }>({
    ids: [],
    wethToBeUsed: 0n,
    amounts: [],
    totalWethAvailable: 0n,
  });

  const squeezeAndFetchDelegates = useCallback(async () => {
    if (delegatePositions.length === 0) return null;
    let requiredBalance = collateralRequired;
    let accumulator = {
      amounts: [] as bigint[],
      wethToBeUsed: 0n as bigint,
      ids: [] as bigint[],
      totalWethAvailable: 0n,
    };
    let totalWethAvailable = 0n;
    for (let i = 0; i < delegatePositions.length; i++) {
      totalWethAvailable +=
        delegatePositions[i].amount - delegatePositions[i].activeCollateral;
      if (
        delegatePositions[i].amount - delegatePositions[i].activeCollateral <
        100n
      )
        continue;
      const delegateBalance =
        delegatePositions[i].amount - delegatePositions[i].activeCollateral;
      const delegateId = delegatePositions[i]._id;
      if (requiredBalance >= delegateBalance) {
        requiredBalance = requiredBalance - delegateBalance;
        accumulator.amounts.push(delegateBalance);
        accumulator.ids.push(delegateId);
      } else {
        accumulator.amounts.push(requiredBalance);
        accumulator.ids.push(delegateId);
        break;
      }
    }

    const wethToBeUsed = accumulator.amounts.reduce(
      (prev, curr) => prev + curr,
      0n,
    );

    accumulator = {
      ...accumulator,
      ids: accumulator.ids.filter(
        (_, index) => accumulator.amounts[index] > 100n,
      ),
    }; // skip dust balances

    accumulator = {
      ...accumulator,
      wethToBeUsed,
      amounts: accumulator.amounts
        .map(
          (amount) =>
            (amount * parseUnits(bondsToMint, DECIMALS_TOKEN)) /
              (collateralRequired + 1n) -
              100n <
            0n
              ? 0n
              : (amount * parseUnits(bondsToMint, DECIMALS_TOKEN)) /
                  (collateralRequired + 1n) -
                100n, // todo: some precision is lost; calculateBondCost(A) + cbc(B) + cbc(C) !== cbc(A + B + C)
        )
        .filter((amount) => amount > 100n),
    };

    setSqueezeResult({
      ids: accumulator.ids,
      amounts: accumulator.amounts,
      wethToBeUsed,
      totalWethAvailable,
    });
  }, [delegatePositions, collateralRequired, bondsToMint]);

  const calculateDelegateData = useCallback(async () => {}, []);

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions]);

  useEffect(() => {
    squeezeAndFetchDelegates();
  }, [squeezeAndFetchDelegates]);

  return { squeezeAndFetchDelegates, squeezeDelegatesResult: squeezeResult };
};

export default useSqueezeDelegatedWeth;
