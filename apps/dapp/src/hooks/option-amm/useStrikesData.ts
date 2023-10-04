import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { OptionAmm__factory } from '@dopex-io/sdk';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { AmmDuration } from 'constants/optionAmm/markets';

interface ExpiryData {
  markPrice: bigint;
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
  DAILY: 1696492801n,
  WEEKLY: 1696579201n,
  MONTHLY: 1698048001n,
};

const useStrikesData = (props: Props) => {
  const { ammAddress = '0x', duration = 'DAILY', isPut } = props;

  const { address } = useAccount();

  const [_expiryData, setExpiryData] = useState<ExpiryData>();
  const [strikeData, setStrikeData] = useState<StrikeData[]>();
  const [strikeDataForExpiry, setStrikeDataForExpiry] =
    useState<StrikeDataForExpiry[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateExpiryData = useCallback(async () => {
    const selectedExpiryTimestamp: bigint = durationToExpiryMapping[duration];
    if (ammAddress === '0x') return;

    try {
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
        strikes.push(nextLowerTick);
        nextLowerTick = upperBound - BigInt(i + 1) * strikeIncrement;
        ++i;
      }

      setExpiryData({
        markPrice,
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
    } catch (e) {
      console.error(e);
    }
  }, [ammAddress, duration]);

  const updateStrikesData = useCallback(async () => {
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
            args: [strikes[i] * parseUnits('1', DECIMALS_TOKEN)],
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

      if (!_strikeDataForExpiry) return;

      let totalAvailableCollateral = 0n;

      let _strikeData: StrikeData[] = [];
      for (let i = 0; i < _strikeDataForExpiry.length; i++) {
        const iv = _strikeDataForExpiry[i].iv;
        const strike = _strikeDataForExpiry[i].strike;
        const totalPurchased =
          _strikeDataForExpiry[i].longs[0] + _strikeDataForExpiry[i].longs[1];
        const activeCollateral =
          _strikeDataForExpiry[i].activeLongs[0] +
          _strikeDataForExpiry[i].activeLongs[1] +
          _strikeDataForExpiry[i].activeShorts[0] +
          _strikeDataForExpiry[i].activeShorts[1];
        const totalCollateral =
          _strikeDataForExpiry[i].longs[0] +
          _strikeDataForExpiry[i].longs[1] +
          _strikeDataForExpiry[i].shorts[0] +
          _strikeDataForExpiry[i].shorts[1];
        const utilization =
          (Number(formatUnits(activeCollateral, DECIMALS_TOKEN)) /
            Number(
              formatUnits(
                totalCollateral + NON_ZERO_DENOMINATOR,
                DECIMALS_TOKEN,
              ),
            )) *
          100;
        const availableCollateral = totalCollateral - activeCollateral;
        const premiumAccrued = _strikeDataForExpiry[i].premium;
        const premiumPerOption = _strikeDataForExpiry[i].premiumPerOption;
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
    } catch (e) {
      console.error(e);
    }
  }, [_expiryData, ammAddress, isPut]);

  const greeks = useMemo(() => {
    if (!strikeData || !_expiryData) return [];

    let durationInSeconds = durationToExpiryMapping[duration];

    const greeksData = [];
    for (let i = 0; i < strikeData.length; i++) {
      const { delta, gamma, theta, vega } = computeOptionGreeks({
        spot: Number(formatUnits(_expiryData.markPrice, DECIMALS_STRIKE)),
        strike: Number(formatUnits(strikeData[i].strike, DECIMALS_STRIKE)),
        expiryInYears: getTimeToExpirationInYears(Number(durationInSeconds)),
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
  }, [_expiryData, duration, isPut, strikeData]);

  useEffect(() => {
    if (!strikeDataForExpiry || !_expiryData || !strikeData) return;
    setLoading(false);
  }, [_expiryData, strikeData, strikeDataForExpiry]);

  useEffect(() => {
    updateExpiryData();
  }, [updateExpiryData]);

  useEffect(() => {
    if (!address) return;
    updateStrikesData();
  }, [address, updateStrikesData]);

  return {
    updateStrikesData,
    updateExpiryData,
    strikeDataForExpiry,
    expiryData: _expiryData,
    strikeData,
    greeks,
    loading,
  };
};

export default useStrikesData;
