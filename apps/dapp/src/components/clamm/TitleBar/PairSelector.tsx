import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Menu } from '@dopex-io/ui';

import useClammStore from 'hooks/clamm/useClammStore';

type Pair = {
  textContent: string;
  callToken: string;
  putToken: string;
};

const LAST_VISITED_CLAMM_POOL_KEY = 'last_clamm_pool';

const PairSelector = () => {
  const { setSelectedOptionsPool, optionsPools } = useClammStore();
  const params = useParams<{ pair: string[] }>();
  const router = useRouter();

  const [selectedPair, setSelectedPair] = useState<Pair>({
    callToken: '-',
    putToken: '-',
    textContent: '-',
  });

  const validPairs = useMemo(() => {
    if (!optionsPools || optionsPools.size === 0) return [];
    return Array.from(optionsPools, ([key, value]) => {
      const pairNameSplit = value.pairName.split('-');
      return {
        textContent: `${pairNameSplit[0]} - ${pairNameSplit[1]}`,
        callToken: value.callToken.symbol,
        putToken: value.putToken.symbol,
      };
    });
  }, [optionsPools]);

  useEffect(() => {
    /**
     * checks for pool name in URL or local storage and accordingly
     * selects a valid one or defaults to an existing one
     */
    if (!params || optionsPools.size === 0) return;
    let { pair } = params;
    if (!pair) {
      const pairInStore = localStorage.getItem(LAST_VISITED_CLAMM_POOL_KEY);
      if (pairInStore) {
        pair = [pairInStore];
      }
    }

    const optionsPoolInfo = optionsPools.get(pair ? pair[0] : '');
    let urlReplacement = '';
    if (optionsPoolInfo) {
      const pairNameSplit = optionsPoolInfo.pairName.split('-');
      urlReplacement = optionsPoolInfo.pairName;
      setSelectedPair({
        callToken: optionsPoolInfo.callToken.symbol,
        putToken: optionsPoolInfo.putToken.symbol,
        textContent: `${pairNameSplit[0]} - ${pairNameSplit[1]}`,
      });
    } else {
      const defaultPool = optionsPools.entries().next().value[1];
      const pairNameSplit = defaultPool
        ? defaultPool.pairName.split('-')
        : null;

      urlReplacement = defaultPool.pairName;
      setSelectedPair({
        callToken: defaultPool ? defaultPool.callToken.symbol : '-',
        putToken: defaultPool ? defaultPool.putToken.symbol : '-',
        textContent: pairNameSplit
          ? `${pairNameSplit[0]} - ${pairNameSplit[1]}`
          : '-',
      });
    }
  }, [params, optionsPools]);

  return (
    <div className="flex flex-col space-y-[8px]">
      <span className="text-md font-normal text-stieglitz">Select Pair</span>
      <div className="flex space-x-[12px]">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-[40px] h-[40px] z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPair.callToken.toLowerCase()}.svg`}
            alt={selectedPair.callToken.toLowerCase()}
          />
          <img
            className="w-[40px] h-[40px]"
            src={`/images/tokens/${selectedPair.putToken.toLowerCase()}.svg`}
            alt={selectedPair.putToken.toLowerCase()}
          />
        </div>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          setSelection={(T: Pair) => {
            const pairName = T.textContent.replaceAll(' ', '');
            router.replace(pairName);
            setSelectedPair(T);
            setSelectedOptionsPool(pairName);
            localStorage.setItem(LAST_VISITED_CLAMM_POOL_KEY, pairName);
          }}
          selection={selectedPair}
          data={validPairs.filter(
            ({ textContent }) => textContent !== selectedPair.textContent,
          )}
          showArrow
        />
      </div>
    </div>
  );
};

export default PairSelector;
