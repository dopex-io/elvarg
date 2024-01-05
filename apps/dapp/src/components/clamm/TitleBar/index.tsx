import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import router from 'next/router';
import { checksumAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import { formatDistanceToNow } from 'date-fns';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useMerklRewards from 'hooks/clamm/useMerklRewards';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import OverViewStats from 'components/clamm/TitleBar/OverViewStats';
import PairSelector from 'components/clamm/TitleBar/PairSelector';

import { TOKENS } from 'constants/tokens';

import { Pair } from 'types/clamm';

const LAST_VISITED_CLAMM_POOL_KEY = 'last_clamm_pool';

const TitleBar = () => {
  const params = useParams<{ pair: string[] }>();

  const [selectedPair, setSelectedPair] = useState<Pair>({
    callToken: 'WETH',
    putToken: 'USDC',
    textContent: 'WETH - USDC',
  });

  const { chain } = useNetwork();
  const { address: user } = useAccount();

  const { reset } = useStrikesChainStore();
  const { setSelectedOptionsPool, optionsPools, selectedOptionsPool } =
    useClammStore();
  const { data, claim, claimed, claimable, refetch } = useMerklRewards({
    user,
    chainId: chain?.id || 42161,
    rewardToken: TOKENS[chain?.id || 42161].find(
      (token) => token.symbol.toUpperCase() === 'ARB',
    ),
    pool: checksumAddress(selectedOptionsPool?.primePool || '0x'),
  });

  useEffect(() => {
    /**
     * checks for pool name in URL or local storage and accordingly
     * selects a valid one or defaults to an existing one
     */
    if (!params || optionsPools.size === 0) return;
    let { pair } = params;

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
      setSelectedOptionsPool(optionsPoolInfo.pairName);
    } else {
      const defaultPool = optionsPools.entries().next().value[1];
      const pairNameSplit = defaultPool
        ? defaultPool.pairName.split('-')
        : null;
      setSelectedOptionsPool(defaultPool.pairName);
      urlReplacement = defaultPool.pairName;
      setSelectedPair({
        callToken: defaultPool ? defaultPool.callToken.symbol : '-',
        putToken: defaultPool ? defaultPool.putToken.symbol : '-',
        textContent: pairNameSplit
          ? `${pairNameSplit[0]} - ${pairNameSplit[1]}`
          : '-',
      });
    }
  }, [params, optionsPools, setSelectedOptionsPool]);

  useEffect(() => {
    const pairName = selectedPair.textContent.replaceAll(' ', '');
    setSelectedOptionsPool(pairName);
  }, [selectedPair.textContent, setSelectedOptionsPool]);

  const updateSelectedPairData = useCallback(
    (T: Pair) => {
      const pairName = T.textContent.replaceAll(' ', '');
      router.replace(pairName);
      setSelectedPair(T);
      setSelectedOptionsPool(pairName);
      reset();
      localStorage.setItem(LAST_VISITED_CLAMM_POOL_KEY, pairName);
    },
    [reset, setSelectedOptionsPool],
  );

  return (
    <>
      <PairSelector
        selectedPair={selectedPair}
        updateSelectedPairData={updateSelectedPairData}
      />
      <OverViewStats />
      <div className="flex justify-end space-x-2">
        <div className="flex w-fit rounded-md p-1 border border-orange-200 bg-gradient-to-r from-[#fdceaa] via-[#b9aafd] to-[#76a0fc]">
          <Button
            className="bg-transparent merklButton disabled:cursor-not-allowed"
            size="xsmall"
            onClick={() =>
              claim()
                .then(() => console.log('claimed'))
                .catch((e) => console.error(e))
                .finally(() => refetch())
            }
            disabled={claimable}
          >
            <p className="text-black">Claim Rewards</p>
          </Button>
        </div>
        {claimed[1] === 0n ? (
          <span className="flex flex-col justify-between text-sm font-medium">
            <p>{formatDistanceToNow(Number(claimed[1]) * 1000)}</p>
            <p className="text-stieglitz">Last Claimed</p>
          </span>
        ) : null}
      </div>
    </>
  );
};

export default TitleBar;
