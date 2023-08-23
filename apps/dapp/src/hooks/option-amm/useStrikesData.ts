import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits } from 'viem';

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

type DurationToExpiryData = { [K in AmmDuration]: ExpiryData };

const mockExpiryData: DurationToExpiryData = {
  DAILY: {
    active: true,
    expired: false,
    strikeIncrement: 5_000000n, // 0.05 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [900_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 10000000000000000n, // 1e16
    expiry: 86400,
  },
  WEEKLY: {
    active: true,
    expired: false,
    strikeIncrement: 10_000000n, // 0.1 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [900_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 1000000000000000000n, // 1e16
    expiry: 604800,
  },
  MONTHLY: {
    active: true,
    expired: false,
    strikeIncrement: 25_000000n, // 0.2 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [600_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 1000000000000000000n, // 1e16
    expiry: 2592000, // 30 days
  },
};

interface Props {
  ammAddress: Address;
  duration: AmmDuration;
}

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
  // from struct
  longs: [bigint, bigint]; // [calls, puts]
  activeLongs: [bigint, bigint];
  shorts: [bigint, bigint];
  activeShorts: [bigint, bigint];
  premium: bigint;
  fees: bigint;
}

const NON_ZERO_DENOMINATOR = 1n;

const useStrikesData = (props: Props) => {
  const { ammAddress = '0x', duration } = props;

  const [_expiryData, setExpiryData] = useState<ExpiryData>();
  const [expiryStrikeData, setExpiryStrikeData] = useState<ExpiryStrike[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateExpiryData = useCallback(async () => {
    // contract call via duration
    // @dev expiry data
    // mapping(uint256 => ExpiryData) public expiryData;  // @ref: OptionAMMState.sol:L78
    if (!mockExpiryData[duration]) return;

    const expiryData = mockExpiryData[duration];

    const strikeRange = [
      ((100n + expiryData.maxOtmPercentage) * 100000000n) / 100n,
      ((100n - expiryData.maxOtmPercentage) * 100000000n) / 100n,
    ];

    const intervals =
      Number(strikeRange[0] - strikeRange[1]) /
        Number(expiryData.strikeIncrement) +
      1;

    /** @todo get all valid strikes from given spot price, strike increment, and strike otm percentage
     * lower_limit = ((100 - otm_percent) * spot) / 100
     * upper_limit = ((100 + otm_percent) * spot) / 100
     * nearest valid strike, NVS = spot - spot % strikeIncrement
     * array of lower_strikes = [NVS - strikeIncrement * 0, NVS - strikeIncrement * 1, NVS - 2 * strikeIncrement... NVS - strikeIncrement * i]
     * where i = 0,1,2,3,4...n, while NVS - strikeIncrement * i > lower_limit
     * for upper_strikes, NVS + strikeIncrement * i
     *
     * Replace the below logic with the correct approach
     **/
    let strikes = [];
    for (let i = 0; i < intervals; i++) {
      const strike = strikeRange[1] + BigInt(i) * expiryData.strikeIncrement;
      if (strike < strikeRange[1] || strike > strikeRange[0]) continue;
      strikes.push(strike);
    }

    setExpiryData({ ...mockExpiryData[duration], strikes });
  }, [duration]);

  const updateExpiryStrikes = useCallback(async () => {
    if (!_expiryData) return;

    const strikes = _expiryData.strikes;

    let promises: ExpiryStrike[] = [];
    for (let i = 0; i < strikes.length; i++) {
      // store promise
      promises.push({
        strike: strikes[i],
        iv: 25n + 5n * BigInt(i),
        longs: [0n, 0n],
        activeLongs: [0n, 0n],
        shorts: [0n, 0n],
        activeShorts: [0n, 0n],
        premium: 0n,
        fees: 0n,
      });
    }

    const res = await Promise.all(promises);
    setExpiryStrikeData(res);
  }, [_expiryData]);

  const strikeData = useMemo(() => {
    if (!expiryStrikeData) return [];

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
      // calcPremium(bool isPut, uint256 strike, uint256 expiry, uint256 amount);
      const premiumPerOption = 10000000000000000n; // 0.01 of underlying
      // calcOpeningFees(uint256 amount); // amount in quote decimals
      const purchaseFeePerOption = 100000000000000n; // fees for open; not settlement fee which is charged separately

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

    const greeksData = [];
    for (let i = 0; i < strikeData.length; i++) {
      const rand = Math.random();
      let isPut = rand > 0.5;

      const { delta, gamma, theta, vega } = computeOptionGreeks({
        spot: 1,
        strike: Number(formatUnits(strikeData[i].strike, DECIMALS_STRIKE)),
        expiryInYears: getTimeToExpirationInYears(
          Math.floor(new Date().getTime() / 1000) + 604800,
        ),
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
  }, [strikeData]);

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
