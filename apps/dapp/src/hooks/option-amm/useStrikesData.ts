import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { OptionAmm__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { AmmDuration } from 'constants/optionAmm/markets';
import { mockExpiryData } from 'constants/optionAmm/placeholders';

interface ExpiryData {
  active: boolean;
  expired: boolean;
  strikeIncrement: bigint;
  maxOtmPercentage: bigint;
  strikes: bigint[];
  strikeDeltas: { [key: number]: [bigint, bigint, bigint] };
  premium: bigint;
  fees: bigint;
  expiry: number;
}

export type DurationToExpiryData = { [K in AmmDuration]: ExpiryData };

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface StrikeData {
  iv: bigint;
  strike: bigint;
  utilization: number;
  totalPurchased: bigint;
  totalCollateral: bigint;
  totalAvailableCollateral: bigint;
  availableCollateral: bigint;
  activeCollateral: bigint;
  premiumsAccrued: bigint;
  premiumPerOption: bigint;
  purchaseFeePerOption: bigint;
}

interface ExpiryStrike {
  strike: bigint;
  iv: bigint;
  premiumPerOption: bigint;
  // from struct
  longs: readonly [bigint, bigint]; // [calls, puts]
  activeLongs: readonly [bigint, bigint];
  shorts: readonly [bigint, bigint];
  activeShorts: readonly [bigint, bigint];
  premium: bigint;
  fees: bigint;
}

interface Props {
  ammAddress: Address;
  duration: AmmDuration;
  isPut: boolean;
}

const NON_ZERO_DENOMINATOR = 1n;

export const durationToExpiryMapping = {
  DAILY: 1695110401n,
  WEEKLY: 1695974401n,
  MONTHLY: 1695974400n,
};

const useStrikesData = (props: Props) => {
  const { ammAddress = '0x', duration = 'DAILY', isPut } = props;

  const [_expiryData, setExpiryData] = useState<ExpiryData>();
  const [expiryStrikeData, setExpiryStrikeData] = useState<ExpiryStrike[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateExpiryData = useCallback(async () => {
    // contract call via duration
    // @dev expiry data
    // mapping(uint256 => ExpiryData) public expiryData;  // @ref: OptionAMMState.sol:L78
    if (!mockExpiryData[duration] || ammAddress === '0x') return;

    const selectedExpiryTimestamp = durationToExpiryMapping[duration];

    const [
      active,
      expired,
      strikeIncrement,
      maxOtmPercentage,
      premium,
      fees,
      expiry,
    ] = await readContract({
      abi: OptionAmm__factory.abi,
      address: ammAddress,
      functionName: 'getExpiryData',
      args: [selectedExpiryTimestamp],
    });

    const markPrice = await readContract({
      abi: OptionAmm__factory.abi,
      address: ammAddress,
      functionName: 'getMarkPrice',
    });

    const expiryData = mockExpiryData[duration];

    const strikeRange = [
      ((100n + maxOtmPercentage) * markPrice) / 100n,
      ((100n - maxOtmPercentage) * markPrice) / 100n,
    ];

    const upperBound =
      strikeRange[0] - (strikeRange[0] % expiryData.strikeIncrement);

    let i = 0;
    let nextLowerTick = upperBound;
    let strikes = [];

    while (nextLowerTick > strikeRange[1]) {
      nextLowerTick = upperBound - BigInt(i + 1) * strikeIncrement;
      strikes.push(nextLowerTick);
      i++;
    }

    setExpiryData({
      ...mockExpiryData[duration],
      strikes,
      premium,
      fees,
      expiry: Number(expiry),
      expired,
      active,
    });
  }, [ammAddress, duration]);

  const updateExpiryStrikes = useCallback(async () => {
    if (!_expiryData || !ammAddress) return;

    const strikes = _expiryData.strikes;

    const config = { abi: OptionAmm__factory.abi, address: ammAddress };

    let ivPromises = [];
    let ppoPromises = []; // premium per option
    let strikeDataPromises = [];
    try {
      for (let i = 0; i < strikes.length; i++) {
        const [iv, premiumPerOption, strikeData] = [
          readContract({
            ...config,
            functionName: 'getVolatility',
            args: [strikes[i], BigInt(_expiryData.expiry)],
          }),
          readContract({
            ...config,
            functionName: 'calcPremium',
            args: [
              isPut,
              strikes[i],
              BigInt(_expiryData.expiry),
              parseUnits('1', DECIMALS_TOKEN),
            ],
          }),
          readContract({
            ...config,
            functionName: 'getExpiryStrikeData',
            args: [strikes[i], BigInt(_expiryData.expiry)],
          }),
        ];
        ivPromises.push(iv);
        ppoPromises.push(premiumPerOption);
        strikeDataPromises.push(strikeData);
      }
    } catch (e) {
      console.log('error');
    }

    const ivs = await Promise.all(ivPromises);
    const strikeData = await Promise.all(strikeDataPromises);
    const ppos = await Promise.all(ppoPromises);
    const expiryStrikeData = [];
    for (let i = 0; i < strikes.length; i++) {
      expiryStrikeData.push({
        strike: strikes[i],
        iv: ivs[i],
        premiumPerOption: ppos[i],
        longs: strikeData[i][0],
        activeLongs: strikeData[i][1],
        shorts: strikeData[i][2],
        activeShorts: strikeData[i][3],
        premium: strikeData[i][4],
        fees: strikeData[i][5],
      });
    }

    setExpiryStrikeData(expiryStrikeData);
  }, [_expiryData, ammAddress, isPut]);

  const strikeData = useMemo(() => {
    if (!expiryStrikeData) return [];

    // todo: fix, failing to update

    let totalAvailableCollateral = 0n;

    let _strikeData: StrikeData[] = [];
    for (let i = 0; i < expiryStrikeData.length; i++) {
      const iv = expiryStrikeData[i].iv;
      const strike = expiryStrikeData[i].strike;
      const totalPurchased =
        expiryStrikeData[i].longs[0] + expiryStrikeData[i].longs[1];
      const activeCollateral =
        expiryStrikeData[i].activeLongs[0] +
        expiryStrikeData[i].activeLongs[1] +
        expiryStrikeData[i].activeShorts[0] +
        expiryStrikeData[i].activeShorts[1];
      const totalCollateral =
        expiryStrikeData[i].longs[0] +
        expiryStrikeData[i].longs[1] +
        expiryStrikeData[i].shorts[0] +
        expiryStrikeData[i].shorts[1];
      const utilization =
        (Number(formatUnits(activeCollateral, DECIMALS_TOKEN)) /
          Number(
            formatUnits(totalCollateral + NON_ZERO_DENOMINATOR, DECIMALS_TOKEN),
          )) *
        100;
      const availableCollateral = totalCollateral - activeCollateral;
      const premiumAccrued = expiryStrikeData[i].premium;
      const premiumPerOption = expiryStrikeData[i].premiumPerOption;
      const purchaseFeePerOption = 0n; // todo: get fees

      totalAvailableCollateral += availableCollateral;
      _strikeData.push({
        iv,
        strike,
        utilization,
        totalPurchased,
        totalCollateral,
        totalAvailableCollateral,
        availableCollateral,
        activeCollateral,
        premiumsAccrued: premiumAccrued,
        premiumPerOption,
        purchaseFeePerOption,
      });
    }

    return _strikeData;
  }, [expiryStrikeData]);

  const greeks = useMemo(() => {
    if (!strikeData) return [];

    // mock expiries
    let durationInSeconds;
    if (duration === 'DAILY') {
      durationInSeconds = Math.ceil(new Date().getTime() / 1000) + 86400;
    } else if (duration === 'WEEKLY') {
      durationInSeconds = Math.ceil(new Date().getTime() / 1000) + 7 * 86400;
    } else {
      durationInSeconds = Math.ceil(new Date().getTime() / 1000) + 30 * 86400;
    }

    const greeksData = [];
    for (let i = 0; i < strikeData.length; i++) {
      const { delta, gamma, theta, vega } = computeOptionGreeks({
        spot: 1,
        strike: Number(formatUnits(strikeData[i].strike, DECIMALS_STRIKE)),
        expiryInYears: getTimeToExpirationInYears(durationInSeconds),
        ivInDecimals: Number(strikeData[i].iv) / 100,
        isPut,
      });
      greeksData.push({
        delta: Number(delta),
        gamma,
        theta,
        vega,
        iv: Number(strikeData[i].iv),
      });
    }

    return greeksData;
  }, [duration, isPut, strikeData]);

  useEffect(() => {
    updateExpiryData();
  }, [updateExpiryData]);

  useEffect(() => {
    updateExpiryStrikes();
  }, [updateExpiryStrikes]);

  useEffect(() => {
    if (!expiryStrikeData || !_expiryData) return;
    setLoading(false);
  }, [_expiryData, expiryStrikeData]);

  return {
    expiryStrikeData,
    expiryData: _expiryData,
    strikeData,
    greeks,
    loading,
  };
};

export default useStrikesData;
