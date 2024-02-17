import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore, {
  StrikesChainMappingArray,
} from 'hooks/clamm/useStrikesChainStore';

import {
  DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  FilterSettingsType,
} from 'constants/clamm';
import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import FilterPanel from './components/FilterPanel';
import FilterSettingsButton from './components/FilterSettings/components/FilterSettingsButton';
import StrikesTable from './components/StrikesTable';

const StrikesChain = () => {
  const { setUpdateStrikes, initialize } = useStrikesChainStore();
  const { setLoading } = useLoadingStates();
  const { chain } = useNetwork();
  const { selectedOptionsMarket, markPrice } = useClammStore();

  const [filterSettings, setFilterSettings] = useState<FilterSettingsType>(
    DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  );

  const {
    data: strikesChain,
    refetch,
    isLoading,
    isRefetching,
  } = useQuery<StrikesChainMappingArray>({
    queryKey: [
      'clamm-strikes-chain',
      selectedOptionsMarket?.address,
      chain?.id,
      markPrice,
    ],
    queryFn: async () => {
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/strikes-chain`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );
      url.searchParams.set(
        'optionMarket',
        selectedOptionsMarket?.address ?? zeroAddress,
      );
      url.searchParams.set('callsReach', '100');
      url.searchParams.set('putsReach', '100');
      if (!selectedOptionsMarket?.deprecated) {
      return fetch(url).then((res) => res.json());
      } else {
        return [];
      }
    },
  });

  useEffect(() => {
    setLoading('strikes-chain', isRefetching);
  }, [isRefetching, setLoading]);

  useEffect(() => {
    if (!strikesChain) return;
    setLoading('strikes-chain', true);
    setUpdateStrikes(refetch);
    initialize(strikesChain, chain?.id ?? DEFAULT_CHAIN_ID);
    setLoading('strikes-chain', false);
  }, [
    setLoading,
    initialize,
    strikesChain,
    chain?.id,
    setUpdateStrikes,
    refetch,
  ]);

  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md pb-[12px]">
      <div className="flex items-center justify-between p-[12px]">
        <FilterPanel />
        <FilterSettingsButton
          filterSettings={filterSettings}
          setFilterSettings={setFilterSettings}
        />
      </div>
      <StrikesTable filterSettings={filterSettings} />
    </div>
  );
};

export default StrikesChain;
