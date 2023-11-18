import { useCallback, useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  user: Address;
  collateralRequired: bigint;
  bonds: string;
}
const useSqueezeDelegatedWeth = ({ user, collateralRequired }: Props) => {
  const { delegatePositions, updateUserDelegatePositions } = useRdpxV2CoreData({
    user,
  });

  const [squeezeResult, setSqueezeResult] = useState<{
    ids: bigint[]; // breakdown of delegate ids to pass into bondWithDelegate()
    wethToBeUsed: bigint; // sum of amounts: bigint[]
    amounts: bigint[]; // breakdown of amounts to pass into bondWithDelegate()
    totalWethAvailable: bigint; // sum of [amount - activeCollateral] across all **squeezed** delegates
    totalDelegatedWeth: bigint; // total weth available from delegates
    avgFee: bigint; // average weighted fee % across delegates' used weth
    bondBreakdown: bigint[];
  }>({
    ids: [],
    wethToBeUsed: 0n,
    amounts: [],
    totalWethAvailable: 0n,
    totalDelegatedWeth: 0n,
    avgFee: 0n,
    bondBreakdown: [],
  });

  const squeezeAndFetchDelegates = useCallback(async () => {
    if (delegatePositions.length === 0) return null;
    let requiredBalance = collateralRequired;

    const totalDelegatedWeth = delegatePositions.reduce(
      (prev, curr) =>
        curr.amount - curr.activeCollateral > parseUnits('1', 14)
          ? prev + (curr.amount - curr.activeCollateral)
          : prev + 0n,
      0n,
    );

    let accumulator = {
      amounts: [] as bigint[],
      wethToBeUsed: 0n as bigint,
      ids: [] as bigint[],
      fees: [] as bigint[],
      totalWethAvailable: 0n,
    };

    let totalWethAvailable = 0n;
    for (let i = 0; i < delegatePositions.length; i++) {
      totalWethAvailable +=
        delegatePositions[i].amount - delegatePositions[i].activeCollateral;
      if (
        delegatePositions[i].amount - delegatePositions[i].activeCollateral <
        parseUnits('1', 14) // enforce _validate E4 in RdpxV2Core
      )
        continue;
      const delegateBalance =
        delegatePositions[i].amount - delegatePositions[i].activeCollateral;
      const delegateId = delegatePositions[i]._id;
      if (requiredBalance >= delegateBalance) {
        requiredBalance = requiredBalance - delegateBalance;
        accumulator.amounts.push(delegateBalance);
        accumulator.ids.push(delegateId);
        accumulator.fees.push(delegatePositions[i].fee);
      } else {
        accumulator.amounts.push(requiredBalance);
        accumulator.ids.push(delegateId);
        accumulator.fees.push(delegatePositions[i].fee);
        break;
      }
    }

    const wethToBeUsed = accumulator.amounts.reduce(
      (prev, curr) => prev + curr,
      0n,
    );

    const averageFee = accumulator.amounts.reduce(
      (prev, curr, i) =>
        prev +
        (curr * parseUnits('1', DECIMALS_TOKEN) * accumulator.fees[i]) /
          (wethToBeUsed + 1n),
      0n,
    );

    const bondBreakdown = accumulator.amounts.map(
      (amount) =>
        (amount * parseUnits('1', DECIMALS_TOKEN)) / (wethToBeUsed + 1n),
    );

    setSqueezeResult({
      ids: accumulator.ids,
      amounts: accumulator.amounts,
      wethToBeUsed,
      totalWethAvailable,
      avgFee: averageFee,
      totalDelegatedWeth,
      bondBreakdown,
    });
  }, [delegatePositions, collateralRequired]);

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions]);

  useEffect(() => {
    squeezeAndFetchDelegates();
  }, [squeezeAndFetchDelegates]);

  return { squeezeAndFetchDelegates, squeezeDelegatesResult: squeezeResult };
};

export default useSqueezeDelegatedWeth;
