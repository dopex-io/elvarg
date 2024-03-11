import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import router from 'next/router';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import OverViewStats from 'components/clamm/TitleBar/OverViewStats';
import PairSelector from 'components/clamm/TitleBar/PairSelector';

import { Pair } from 'types/clamm';

const LAST_VISITED_CLAMM_POOL_KEY = 'last_clamm_pool';

const TitleBar = () => {
  const params = useParams<{ pair: string[] }>();

  const [selectedPair, setSelectedPair] = useState<Pair>({
    callToken: 'WETH',
    putToken: 'USDC',
    textContent: 'WETH - USDC',
  });

  const { reset } = useStrikesChainStore();
  const { optionMarkets, setSelectedOptionsMarket } = useClammStore();

  useEffect(() => {
    /**
     * checks for pool name in URL or local storage and accordingly
     * selects a valid one or defaults to an existing one
     */
    if (!params || optionMarkets.size === 0) return;
    let { pair } = params;

    const optionsPoolInfo = optionMarkets.get(pair ? pair[0] : '');
    let urlReplacement = '';
    if (optionsPoolInfo) {
      const pairNameSplit = optionsPoolInfo.pairName.split('-');
      urlReplacement = optionsPoolInfo.pairName;
      setSelectedPair({
        callToken: optionsPoolInfo.callToken.symbol,
        putToken: optionsPoolInfo.putToken.symbol,
        textContent: `${pairNameSplit[0]} - ${pairNameSplit[1]}`,
      });
      setSelectedOptionsMarket(optionsPoolInfo.pairName);
    } else {
      const defaultPool = optionMarkets.entries().next().value[1];
      const pairNameSplit = defaultPool
        ? defaultPool.pairName.split('-')
        : null;
      setSelectedOptionsMarket(defaultPool.pairName);
      urlReplacement = defaultPool.pairName;
      setSelectedPair({
        callToken: defaultPool ? defaultPool.callToken.symbol : '-',
        putToken: defaultPool ? defaultPool.putToken.symbol : '-',
        textContent: pairNameSplit
          ? `${pairNameSplit[0]} - ${pairNameSplit[1]}`
          : '-',
      });
    }
  }, [params, optionMarkets, setSelectedOptionsMarket]);

  useEffect(() => {
    const pairName = selectedPair.textContent.replaceAll(' ', '');
    setSelectedOptionsMarket(pairName);
  }, [selectedPair.textContent, setSelectedOptionsMarket]);

  const updateSelectedPairData = useCallback(
    (T: Pair) => {
      const pairName = T.textContent.replaceAll(' ', '');
      router.replace(pairName);
      setSelectedPair(T);
      setSelectedOptionsMarket(pairName);
      reset();
      localStorage.setItem(LAST_VISITED_CLAMM_POOL_KEY, pairName);
    },
    [reset, setSelectedOptionsMarket],
  );

  return (
    <>
      <PairSelector
        selectedPair={selectedPair}
        updateSelectedPairData={updateSelectedPairData}
      />
      <OverViewStats />
    </>
  );
};

export default TitleBar;
