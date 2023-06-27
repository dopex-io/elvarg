import { useCallback, useEffect, useMemo, useState } from 'react';

import { SsovV3__factory } from '@dopex-io/sdk';
import { formatUnits, parseUnits } from 'viem';
import { readContracts, useContractReads } from 'wagmi';

import {
  getDelta,
  getGamma,
  getRho,
  getTheta,
  getVega,
} from 'utils/math/blackScholes/greeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  contractAddress?: string;
  epoch?: number;
  args?: (string | bigint | number)[];
}

export interface EpochStrikeData {
  strike: number;
  totalCollateral: bigint;
  availableCollateral: bigint;
  activeCollateral: bigint;
  premiumsAccrued: bigint;
  premiumPerOption: bigint;
  availableCollateralPercentage: number;
  totalAvailableCollateral: number;
  totalPurchased: number;
}

export interface Greeks {
  delta: number;
  gamma: number;
  rho: number;
  iv: number;
  theta: number;
  vega: number;
  strike: number;
  spot: number;
}

export interface ContractData {
  collateral: string;
}

const useContractData = (props: Props) => {
  const { contractAddress, epoch } = props;
  const { data, isLoading, error } = useContractReads({
    contracts: [
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as `0x${string}`,
        functionName: 'getEpochData',
        args: [BigInt(epoch || 1)],
      },
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as `0x${string}`,
        functionName: 'getUnderlyingPrice',
      },
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as `0x${string}`,
        functionName: 'isPut',
      },
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as `0x${string}`,
        functionName: 'collateralToken',
      },
    ],
  });

  const [ivs, setIvs] = useState<bigint[]>([]);
  const [epochStrikeData, setEpochStrikeData] = useState<
    (EpochStrikeData & Greeks)[]
  >([]);
  const [contractData, setContractData] = useState<ContractData>();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const updateIvs = useCallback(async () => {
    if (!contractAddress || !data || !data[0]) return;
    const ivs = [];
    for (let i = 0; i < (data[0] as any).strikes.length; i++) {
      const iv = (
        await readContracts({
          contracts: [
            {
              address: contractAddress as any,
              abi: SsovV3__factory.abi,
              functionName: 'getVolatility',
              args: [(data[0] as any).strikes[i]],
            },
          ],
        })
      )[0];
      iv.result && ivs.push(iv.result);
    }
    setIvs(ivs);
  }, [contractAddress, data]);

  const greeks: Greeks[] | undefined = useMemo(() => {
    if (
      !data ||
      !data[0] ||
      (data[0] as any).expiry === null ||
      !contractAddress ||
      !ivs
    )
      return [];

    try {
      return (data[0] as any).strikes.map((strike: any, index: number) => {
        const _strike = Number(formatUnits(strike, DECIMALS_STRIKE));
        const expiryInYears =
          (data[0] as any).expiry.sub((data[0] as any).startTime).toNumber() /
          31556926;
        const spot = Number(formatUnits(data[1] as any, DECIMALS_STRIKE));
        const isPut = data[2];
        const iv = Number(ivs[index]);

        const delta = getDelta(spot, _strike, expiryInYears, iv, 0, isPut);
        const gamma = getGamma(spot, _strike, expiryInYears, iv, 0);
        const vega = getVega(spot, _strike, expiryInYears, iv, 0);
        const theta = getTheta(spot, _strike, expiryInYears, iv, 0, isPut, 365);
        const rho = getRho(spot, _strike, expiryInYears, iv, 0, isPut, 100);

        return {
          delta,
          gamma,
          theta,
          vega,
          rho,
          iv,
          strike: _strike,
          spot,
        };
      });
    } catch (e) {
      console.log('Something went wrong fetching strikes', e);
      return;
    }
  }, [data, contractAddress, ivs]);

  const constructEpochStrikeChain = useCallback(async () => {
    if (
      !epoch ||
      ivs.length === 0 ||
      !greeks ||
      greeks.length === 0 ||
      !greeks ||
      !data ||
      !(data[0] as any).expiry
    )
      return;

    const strikes = (data[0] as any).strikes;
    const config = {
      address: contractAddress as any,
      abi: SsovV3__factory.abi,
    };
    let _epochStrikeData: (Greeks & EpochStrikeData)[] = [];
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
            args: [strikes[i], parseUnits('1', 18), (data[0] as any).expiry],
          },
        ],
      });
      if (!strikeData.result || !data[0].result) return;

      const availableCollateralPercentage =
        ((Number(
          formatUnits(strikeData.result.totalCollateral, DECIMALS_TOKEN)
        ) -
          Number(
            formatUnits(strikeData.result.activeCollateral, DECIMALS_TOKEN)
          )) /
          Number(
            formatUnits(strikeData.result.totalCollateral, DECIMALS_TOKEN)
          )) *
          100 || 0;
      const totalAvailable = Number(
        formatUnits(
          (strikeData.result.totalCollateral -
            strikeData.result.activeCollateral) /
            (data[0].result.collateralExchangeRate ?? '1'),
          10
        )
      );
      const totalPurchased = Number(
        formatUnits(
          strikeData.result.activeCollateral /
            (data[0].result.collateralExchangeRate ?? 1n),
          10
        )
      );
      _epochStrikeData.push({
        totalCollateral: strikeData.result.totalCollateral,
        availableCollateral:
          strikeData.result.totalCollateral -
          strikeData.result.activeCollateral,
        activeCollateral: strikeData.result.activeCollateral,
        premiumsAccrued: strikeData.result.totalPremiums,
        premiumPerOption: premiumPerOption.result!,
        availableCollateralPercentage,
        totalAvailableCollateral: totalAvailable,
        totalPurchased: totalPurchased,
        ...greeks[i],
      });
    }
    setEpochStrikeData(_epochStrikeData);
    setActiveIndex(0);
  }, [contractAddress, data, epoch, greeks, ivs, setActiveIndex]);

  const updateContractData = useCallback(() => {
    // todo: load any additional contract state via this handler
    if (!data || !data[3] || !contractAddress) return;
    setContractData({
      collateral: data[3].result as string,
    });
  }, [data, contractAddress]);

  useEffect(() => {
    updateIvs();
  }, [updateIvs]);

  useEffect(() => {
    constructEpochStrikeChain();
  }, [constructEpochStrikeChain]);

  useEffect(() => {
    updateContractData();
  }, [updateContractData]);

  return {
    data,
    isLoading,
    error,
    epochStrikeData,
    constructEpochStrikeChain,
    activeIndex,
    setActiveIndex,
    contractData,
  };
};

export default useContractData;
