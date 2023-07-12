import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

import queryClient from 'queryClient';

import { useBoundStore } from 'store';

import { DOPEX_API_BASE_URL } from 'constants/env';

import { SsovDuration } from 'types/ssov';

interface Props {
  market: string;
}

interface RawVaultQueryData {
  address: string;
  apy: string;
  chainId: number;
  collateralDecimals: number;
  currentEpoch: string;
  duration: string;
  epochTimes: { startTime: string; expiry: string };
  olp: string;
  retired: boolean;
  rewards: {
    amount: string;
    rewardToken: string;
  }[];
  symbol: string;
  totalEpochDeposits: string;
  totalEpochPurchases: string;
  tvl: string;
  type: string;
  underlyingPrice: string;
  underlyingSymbol: string;
  version: number;
}

interface VaultData {
  isPut: boolean;
  duration: SsovDuration;
  contractAddress: Address;
  underlyingSymbol: string;
  collateralPrecision: number;
  rewards: {
    amount: string;
    rewardToken: string;
  }[];
  symbol: string;
  olp: string;
  totalEpochDeposits: string;
  totalEpochPurchases: string;
  tvl: string;
  apy: string;
  currentPrice: string;
  currentEpoch: number;
  epochTimes: {
    startTime: string;
    expiry: string;
  };
}

interface AggregatedStats {
  oi: number;
  apy: number;
  currentPrice: number;
  volume: number;
}

export const fetchSsovs = async (keys: string[], cacheTime: number) => {
  const query = async () =>
    (await fetch(`${DOPEX_API_BASE_URL}/v2/ssov`)).json();
  return await queryClient.fetchQuery(keys, query, {
    cacheTime,
  });
};

const useVaultsData = (props: Props) => {
  const { market } = props;
  const { chainId } = useBoundStore();

  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [aggregatedStats, setAggregatedStats] = useState<AggregatedStats>();

  const updateVaults = useCallback(async () => {
    const data = await fetchSsovs([market, 'dopex-api-ssov'], 3600);

    if (!market || !chainId || !data || !data[chainId]) return [];
    const filteredData: RawVaultQueryData[] = data[chainId].filter(
      (item: RawVaultQueryData) =>
        String(item.underlyingSymbol).toLowerCase() === market.toLowerCase() &&
        !item.retired
    );

    if (filteredData.length === 0) return;

    const _vaults: VaultData[] = [];
    for (let i = 0; i < filteredData.length; i++) {
      const [
        isPut,
        underlyingSymbol,
        collateralPrecision,
        duration,
        contractAddress,
        olp,
        rewards,
        totalEpochDeposits,
        totalEpochPurchases,
        tvl,
        underlyingPrice,
        apy,
        currentEpoch,
        epochTimes,
      ] = [
        filteredData[i].type === 'put',
        filteredData[i].underlyingSymbol,
        filteredData[i].collateralDecimals,
        filteredData[i].duration.toUpperCase(),
        filteredData[i].address,
        filteredData[i].olp,
        filteredData[i].rewards,
        filteredData[i].totalEpochDeposits,
        filteredData[i].totalEpochPurchases,
        filteredData[i].tvl,
        filteredData[i].underlyingPrice,
        filteredData[i].apy,
        Number(filteredData[i].currentEpoch),
        filteredData[i].epochTimes,
      ];
      _vaults.push({
        symbol: market,
        isPut,
        underlyingSymbol,
        collateralPrecision,
        duration: duration.toUpperCase() as SsovDuration,
        contractAddress: contractAddress as Address,
        olp,
        rewards,
        totalEpochDeposits,
        totalEpochPurchases,
        tvl,
        currentPrice: underlyingPrice,
        apy,
        currentEpoch,
        epochTimes,
      });
    }
    setVaults(_vaults);
  }, [chainId, market]);

  const updateAggregatedStats = useCallback(() => {
    if (vaults.length === 0) return;
    const avgApy = vaults.reduce(
      (prev, curr) =>
        prev + (typeof curr.apy === 'string' ? Number(curr.apy) : 0),
      0
    );
    const totalPurchases = vaults.reduce(
      (prev, curr) => prev + Number(curr.totalEpochPurchases),
      0
    );

    setAggregatedStats({
      currentPrice: Number(vaults[0].currentPrice),
      apy: avgApy,
      oi: totalPurchases * Number(vaults[0].currentPrice),
      volume: 0,
    });
  }, [vaults]);

  useEffect(() => {
    updateVaults();
  }, [updateVaults]);

  useEffect(() => {
    updateAggregatedStats();
  }, [updateAggregatedStats]);

  return {
    vaults,
    updateVaults,
    aggregatedStats,
  };
};

export default useVaultsData;
