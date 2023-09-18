import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { OptionAmm__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { AmmDuration } from 'constants/optionAmm/markets';

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

interface StrikeDataForExpiry {
  strike: bigint;
  iv: bigint;
  premiumPerOption: bigint;
  longs: readonly [bigint, bigint]; // [calls, puts]
  activeLongs: readonly [bigint, bigint];
  shorts: readonly [bigint, bigint];
  activeShorts: readonly [bigint, bigint];
  premium: bigint;
  feePerOption: bigint;
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
}; // todo: automate this instead of repeatedly updating after every bootstrap

const useStrikesData = (props: Props) => {
  const { ammAddress = '0x', duration = 'DAILY', isPut } = props;

  const [_expiryData, setExpiryData] = useState<ExpiryData>();
  const [strikeData, setStrikeData] = useState<StrikeData[]>();
  const [strikeDataForExpiry, setStrikeDataForExpiry] =
    useState<StrikeDataForExpiry[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateExpiryData = useCallback(async () => {
    if (ammAddress === '0x') return;

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
    const strikeRange = [
      ((100n + maxOtmPercentage) * markPrice) / 100n,
      ((100n - maxOtmPercentage) * markPrice) / 100n,
    ];
    const upperBound = strikeRange[0] - (strikeRange[0] % strikeIncrement);

    let i = 0;
    let nextLowerTick = upperBound;
    let strikes = [];

    while (nextLowerTick > strikeRange[1]) {
      nextLowerTick = upperBound - BigInt(i + 1) * strikeIncrement;
      strikes.push(nextLowerTick);
      i++;
    }

    setExpiryData({
      strikeIncrement,
      maxOtmPercentage,
      strikeDeltas: [],
      strikes,
      premium,
      fees,
      expiry: Number(expiry),
      expired,
      active,
    });
  }, [ammAddress, duration]);

  const updateStrikeDataForExpiry = useCallback(async () => {
    if (!_expiryData || !ammAddress) return;

    const strikes = _expiryData.strikes;

    const config = { abi: OptionAmm__factory.abi, address: ammAddress };

    let ivPromises = [];
    let feePromises = [];
    let ppoPromises = []; // premium per option
    let strikeDataPromises = [];
    try {
      for (let i = 0; i < strikes.length; i++) {
        const [iv, premiumPerOption, feePerOption, strikeData] = [
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
            functionName: 'calcOpeningFees',
            args: [strikes[i] * BigInt(_expiryData.expiry)],
          }),
          readContract({
            ...config,
            functionName: 'getExpiryStrikeData',
            args: [strikes[i], BigInt(_expiryData.expiry)],
          }),
        ];
        ivPromises.push(iv);
        feePromises.push(feePerOption);
        ppoPromises.push(premiumPerOption);
        strikeDataPromises.push(strikeData);
      }

      const ivs = await Promise.all(ivPromises);
      const strikeData = await Promise.all(strikeDataPromises);
      const ppos = await Promise.all(ppoPromises);
      const feePerOption = await Promise.all(feePromises);

      const _strikeDataForExpiry = [];
      for (let i = 0; i < strikes.length; i++) {
        _strikeDataForExpiry.push({
          strike: strikes[i],
          iv: ivs[i],
          premiumPerOption: ppos[i],
          feePerOption: feePerOption[i],
          longs: strikeData[i][0],
          activeLongs: strikeData[i][1],
          shorts: strikeData[i][2],
          activeShorts: strikeData[i][3],
          premium: strikeData[i][4],
          fees: strikeData[i][5],
        });
      }

      setStrikeDataForExpiry(_strikeDataForExpiry);
    } catch (e) {
      console.error('Error mounting strike data for expiry...', e);
    }
  }, [_expiryData, ammAddress, isPut]);

  const updateStrikeData = useCallback(async () => {
    if (!strikeDataForExpiry) return [];

    let totalAvailableCollateral = 0n;

    let _strikeData: StrikeData[] = [];
    for (let i = 0; i < strikeDataForExpiry.length; i++) {
      const iv = strikeDataForExpiry[i].iv;
      const strike = strikeDataForExpiry[i].strike;
      const totalPurchased =
        strikeDataForExpiry[i].longs[0] + strikeDataForExpiry[i].longs[1];
      const activeCollateral =
        strikeDataForExpiry[i].activeLongs[0] +
        strikeDataForExpiry[i].activeLongs[1] +
        strikeDataForExpiry[i].activeShorts[0] +
        strikeDataForExpiry[i].activeShorts[1];
      const totalCollateral =
        strikeDataForExpiry[i].longs[0] +
        strikeDataForExpiry[i].longs[1] +
        strikeDataForExpiry[i].shorts[0] +
        strikeDataForExpiry[i].shorts[1];
      const utilization =
        (Number(formatUnits(activeCollateral, DECIMALS_TOKEN)) /
          Number(
            formatUnits(totalCollateral + NON_ZERO_DENOMINATOR, DECIMALS_TOKEN),
          )) *
        100;
      const availableCollateral = totalCollateral - activeCollateral;
      const premiumAccrued = strikeDataForExpiry[i].premium;
      const premiumPerOption = strikeDataForExpiry[i].premiumPerOption;
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
    setStrikeData(_strikeData);
  }, [strikeDataForExpiry]);

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
    updateStrikeDataForExpiry();
  }, [updateStrikeDataForExpiry]);

  useEffect(() => {
    updateStrikeData();
  }, [updateStrikeData, strikeDataForExpiry]);

  useEffect(() => {
    if (!strikeDataForExpiry || !_expiryData || !strikeData) return;
    setLoading(false);
  }, [_expiryData, strikeData, strikeDataForExpiry, updateStrikeData]);

  return {
    strikeDataForExpiry,
    updateStrikeData,
    expiryData: _expiryData,
    strikeData,
    greeks,
    loading,
  };
};

export default useStrikesData;
