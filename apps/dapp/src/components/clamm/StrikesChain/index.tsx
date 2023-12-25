import React, { useCallback, useEffect, useState } from 'react';

import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import getStrikesChain from 'utils/clamm/varrock/getStrikesChain';

import {
  DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  FilterSettingsType,
} from 'constants/clamm';

import FilterPanel from './components/FilterPanel';
import FilterSettingsButton from './components/FilterSettingsButton';
import StrikesTable from './components/StrikesTable';

const StrikesChain = () => {
  const { setUpdateStrikes, initialize } = useStrikesChainStore();
  const { setLoading } = useLoadingStates();
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();

  const [filterSettings, setFilterSettings] = useState<FilterSettingsType>(
    DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  );

  const loadStrikes = useCallback(async () => {
    if (!selectedOptionsPool) return;
    const chainId = chain?.id ?? 42161;

    const data = await getStrikesChain(
      chainId,
      selectedOptionsPool.optionsPoolAddress,
      1000,
      0,
    );
    const strikes = (data ?? []).sort((a, b) => a.strike - b.strike);
    initialize(strikes, chainId);
  }, [initialize, chain, , selectedOptionsPool]);

  useEffect(() => {
    setLoading('strikes-chain', true);
    setUpdateStrikes(loadStrikes);
    loadStrikes().finally(() => {
      setLoading('strikes-chain', false);
    });
  }, [loadStrikes, setUpdateStrikes, setLoading]);

  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md">
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
