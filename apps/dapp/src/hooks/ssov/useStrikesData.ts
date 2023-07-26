import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContracts, useContractReads } from 'wagmi';

import getTimeToExpirationInYears from 'utils/date/getTimeToExpirationInYears';
import computeOptionGreeks from 'utils/ssov/computeOptionGreeks';
import getSsovPurchaseFees from 'utils/ssov/getSsovPurchaseFees';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  ssovAddress: Address;
  epoch?: number;
}

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface StrikeData extends Greeks {
  iv: number;
  strike: number;
  utilization: number;
  totalPurchased: number;
  totalCollateral: bigint;
  totalAvailableCollateral: number;
  availableCollateral: bigint;
  activeCollateral: bigint;
  premiumsAccrued: bigint;
  premiumPerOption: bigint;
  purchaseFeePerOption: bigint;
}

const useStrikesData = (props: Props) => {
  const { ssovAddress, epoch } = props;
  const { data } = useContractReads({
    contracts: [
      {
        abi: SsovV3__factory.abi,
        address: ssovAddress,
        functionName: 'getEpochData',
        args: [BigInt(epoch || 1)],
      },
      {
        abi: SsovV3__factory.abi,
        address: ssovAddress,
        functionName: 'getUnderlyingPrice',
      },
      {
        abi: SsovV3__factory.abi,
        address: ssovAddress,
        functionName: 'isPut',
      },
      {
        abi: SsovV3__factory.abi,
        address: ssovAddress,
        functionName: 'collateralToken',
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);

  const [strikesData, setStrikesData] = useState<StrikeData[]>([]);

  const constructEpochStrikeChain = useCallback(async () => {
    if (!epoch || !data || !data[0].result) return;

    setIsLoading(true);

    const strikes = data[0].result.strikes;

    const contracts = strikes.map((s) => {
      return {
        address: ssovAddress,
        abi: SsovV3__factory.abi,
        functionName: 'getVolatility',
        args: [s],
      };
    });

    const ivsPayload = await readContracts({
      contracts,
    });

    const ivs = ivsPayload.map((o) => o.result);

    const config = {
      address: ssovAddress,
      abi: SsovV3__factory.abi,
    };

    let _strikesData: StrikeData[] = [];

    for (let i = 0; i < strikes.length; i++) {
      const [strikeData, premiumPerOption] = await readContracts({
        contracts: [
          {
            ...config,
            functionName: 'getEpochStrikeData',
            args: [BigInt(epoch), strikes[i]],
          },
          {
            ...config,
            functionName: 'calculatePremium',
            args: [strikes[i], parseUnits('1', 18), data[0].result.expiry],
          },
        ],
      });
      if (!strikeData.result || !data[0].result) return;

      const strike = Number(formatUnits(strikes[i], DECIMALS_STRIKE));

      const iv = Number(ivs[i]);

      const { delta, gamma, theta, vega } = computeOptionGreeks({
        spot: Number(formatUnits(data[1].result!, DECIMALS_STRIKE)),
        strike,
        expiryInYears: getTimeToExpirationInYears(
          Number(data[0].result!.expiry),
        ),
        ivInDecimals: iv / 100,
        isPut: data[2].result ?? false,
      });

      const utilization =
        100 -
        Number(
          ((strikeData.result.totalCollateral -
            strikeData.result.activeCollateral) *
            100n) /
            strikeData.result.totalCollateral,
        );

      const totalAvailable = Number(
        formatUnits(
          (strikeData.result.totalCollateral -
            strikeData.result.activeCollateral) /
            (data[0].result.collateralExchangeRate ?? 1n),
          10,
        ),
      );
      const totalPurchased = Number(
        formatUnits(
          strikeData.result.activeCollateral /
            (data[0].result.collateralExchangeRate ?? 1n),
          10,
        ),
      );

      const purchaseFeePerOption = await getSsovPurchaseFees({
        ssov: ssovAddress,
        strike: strikes[i],
        amount: parseUnits('1', DECIMALS_TOKEN),
      });

      _strikesData.push({
        totalCollateral: strikeData.result.totalCollateral,
        availableCollateral:
          strikeData.result.totalCollateral -
          strikeData.result.activeCollateral,
        activeCollateral: strikeData.result.activeCollateral,
        premiumsAccrued: strikeData.result.totalPremiums,
        premiumPerOption: premiumPerOption.result!,
        purchaseFeePerOption,
        utilization,
        totalAvailableCollateral: totalAvailable,
        totalPurchased: totalPurchased,
        delta,
        gamma,
        theta,
        vega,
        iv,
        strike,
      });
    }
    setStrikesData(_strikesData);
    setIsLoading(false);
  }, [ssovAddress, data, epoch]);

  useEffect(() => {
    constructEpochStrikeChain();
  }, [constructEpochStrikeChain]);

  return {
    strikesData,
    isLoading,
  };
};

export default useStrikesData;
