import { useCallback, useEffect, useState } from 'react';

import { DurationType } from 'hooks/vaults/state';
import queryClient from 'queryClient';
import { useBoundStore } from 'store';

import { DOPEX_API_BASE_URL } from 'constants/env';

interface Props {
  vaultSymbol: string;
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
  tvl: string;
  type: string;
  underlyingPrice: string;
  underlyingSymbol: string;
  version: number;
}

interface VaultData {
  isPut: boolean;
  durationType: DurationType;
  contractAddress: string;
  underlyingSymbol: string;
  collateralPrecision: number;
  rewards: {
    amount: string;
    rewardToken: string;
  }[];
  symbol: string;
  olp: string;
  totalEpochDeposits: string;
  tvl: string;
  apy: string;
  currentPrice: string;
  currentEpoch: number;
  epochTimes: {
    startTime: string;
    expiry: string;
  };
}

export const fetchSsovs = async (keys: string[], cacheTime: number) => {
  const query = async () =>
    (await fetch(`${DOPEX_API_BASE_URL}/v2/ssov`)).json();
  return await queryClient.fetchQuery(keys, query, {
    cacheTime,
  });
};

const useVaultQuery = (props: Props) => {
  const { vaultSymbol } = props;
  const { chainId } = useBoundStore();

  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [selectedVault, setSelectedVault] = useState<VaultData>();

  const updateVaults = useCallback(async () => {
    const data = await fetchSsovs([vaultSymbol], 3600);
    if (!vaultSymbol || !chainId || !data || !data[chainId]) return [];
    const filteredData = data[chainId].filter((item: RawVaultQueryData) =>
      String(item.symbol).includes(vaultSymbol)
    );
    console.log(filteredData);
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
        filteredData[i].tvl,
        filteredData[i].underlyingPrice,
        filteredData[i].apy,
        Number(filteredData[i].currentEpoch),
        filteredData[i].epochTimes,
      ];
      _vaults.push({
        symbol: vaultSymbol,
        isPut,
        underlyingSymbol,
        collateralPrecision,
        durationType: duration.toUpperCase() as DurationType,
        contractAddress,
        olp,
        rewards,
        totalEpochDeposits,
        tvl,
        currentPrice: underlyingPrice,
        apy,
        currentEpoch,
        epochTimes,
      });
    }
    setVaults(_vaults);
  }, [chainId, vaultSymbol]);

  const updateSelectedVault = useCallback(
    (duration: DurationType, isPut: boolean) => {
      const selected = vaults.find(
        (vault) => duration === vault.durationType && isPut === vault.isPut
      );
      if (!selected) return;

      setSelectedVault(selected);
    },
    [vaults]
  );

  useEffect(() => {
    updateVaults();
  }, [updateVaults]);

  return {
    vaults,
    updateVaults,
    selectedVault,
    updateSelectedVault,
  };
};

export default useVaultQuery;
