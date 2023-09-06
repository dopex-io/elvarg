import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Menu } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import useStats from 'hooks/clamm/useStats';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { MARKETS_MENU } from 'constants/clamm/markets';

export function TitleBar() {
  const router = useRouter();

  const { clammMarkPrice, selectedPair, updateSelectedPair } = useBoundStore();

  const { openInterest, totalVolume } = useStats();

  useEffect(() => {
    const { tokenA: tokenASymbol } = router.query;
    if (tokenASymbol) {
      updateSelectedPair(tokenASymbol as string);
    }
  }, [router, updateSelectedPair]);

  const handleSelectedPair = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedPair = e.target.innerText;
      router.query.tokenA = selectedPair;
      router.push(router);
      updateSelectedPair(selectedPair);
    },
    [router, updateSelectedPair],
  );

  const underlyingTokenSymbol = selectedPair.split('-')[0].trim();

  return (
    <>
      <span className="text-stieglitz text-md">Select Pair</span>
      <div className="flex space-x-4 mb-4 mt-2">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-8 h-8 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${underlyingTokenSymbol.toLowerCase()}.svg`}
            alt={underlyingTokenSymbol}
          />
          <img
            className="w-8 h-8 z-0"
            src="/images/tokens/usdc.svg"
            alt="USDC"
          />
        </div>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectedPair}
          selection={selectedPair}
          data={MARKETS_MENU}
          className="z-20"
          showArrow
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Mark Price"
          value={formatAmount(clammMarkPrice, 3)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Open Interest"
          value={formatAmount(openInterest, 3, true)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Total Volume"
          value={formatAmount(totalVolume, 3, true)}
        />
      </div>
    </>
  );
}
