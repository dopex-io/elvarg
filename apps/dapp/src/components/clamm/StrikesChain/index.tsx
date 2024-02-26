import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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

  const DEPRECATED_TO_NEW: any = {
    'WETH/USDC.e': 'WETH/USDC',
    'WBTC/USDC.e': 'WBTC/USDC',
    'ARB/USDC.e': 'ARB/USDC',
  };

  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md pb-[12px]">
      {selectedOptionsMarket?.deprecated ? (
        <div className="w-full bg-cod-gray h-[100px] flex flex-col items-center justify-center text-[13px]">
          <span className="flex items-center justify-center space-x-[6px]">
            <ExclamationTriangleIcon
              height={18}
              width={18}
              className="text-jaffa"
            />
            <span className="text-jaffa">Deprecation Notice</span>
          </span>
          <span className="text-stieglitz max-w-[500px] text-center">
            We are migrating the market&apos;s pair{' '}
            {selectedOptionsMarket.ticker} to{' '}
            {DEPRECATED_TO_NEW[selectedOptionsMarket.ticker]}. Please migrate
            any liquidity to the new pair&apos;s market{' '}
            <a
              href={`${DEPRECATED_TO_NEW[selectedOptionsMarket.ticker].replace('/', '-')}`}
              className="text-wave-blue underline"
            >
              click here
            </a>{' '}
            to head over to the new market
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-[12px]">
            <FilterPanel />
            <FilterSettingsButton
              filterSettings={filterSettings}
              setFilterSettings={setFilterSettings}
            />
          </div>
          <StrikesTable filterSettings={filterSettings} />
        </>
      )}
    </div>
  );
};

export default StrikesChain;
