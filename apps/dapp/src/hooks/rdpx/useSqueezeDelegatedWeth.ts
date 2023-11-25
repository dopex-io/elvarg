import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, parseUnits } from 'viem';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { AlertSeverity } from 'components/common/Alert';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  user: Address;
  collateralRequired: bigint;
  bonds: string;
}
const useSqueezeDelegatedWeth = ({
  user,
  collateralRequired,
  bonds,
}: Props) => {
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
        curr.amount - curr.activeCollateral > parseUnits('1', 16)
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
        parseUnits('1', 16)
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
        (amount * parseUnits(bonds, DECIMALS_TOKEN)) / (wethToBeUsed + 1n),
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
  }, [delegatePositions, collateralRequired, bonds]);

  const averageFeeSeverity = useMemo(() => {
    if (squeezeResult.avgFee > parseUnits('15', DECIMALS_TOKEN + 8)) {
      return AlertSeverity.error;
    } else if (squeezeResult.avgFee > parseUnits('5', DECIMALS_TOKEN + 8)) {
      return AlertSeverity.warning;
    } else {
      return null;
    }
  }, [squeezeResult.avgFee]);

  const delegateeBondsReceivable = useMemo(() => {
    const avgFeePercent =
      squeezeResult.avgFee / parseUnits('1', DECIMALS_TOKEN); // avg fee % in 1e8 precision

    const delegateeShareOfBond =
      (parseUnits('0.25', DECIMALS_TOKEN) * parseUnits(bonds, DECIMALS_TOKEN)) /
      parseUnits('1', DECIMALS_TOKEN); // 25% share in 1e18 precision w/o fee

    // weighted average fee going to delegate(s)
    const delegateeShareLostFromFees =
      (delegateeShareOfBond * avgFeePercent) / parseUnits('1', 10); // fee % in 1e8 precision

    const delegateeShareAfterFee =
      delegateeShareOfBond - delegateeShareLostFromFees; // in 1e8 for better precision

    return delegateeShareAfterFee;
  }, [bonds, squeezeResult.avgFee]);

  useEffect(() => {
    updateUserDelegatePositions();
  }, [updateUserDelegatePositions]);

  useEffect(() => {
    squeezeAndFetchDelegates();
  }, [squeezeAndFetchDelegates]);

  return {
    squeezeAndFetchDelegates,
    squeezeDelegatesResult: squeezeResult,
    averageFeeSeverity,
    delegateeBondsReceivable,
  };
};

export default useSqueezeDelegatedWeth;
