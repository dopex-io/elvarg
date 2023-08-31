import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatUnits } from 'viem';

import { Menu } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import { MARKETS_MENU } from 'constants/clamm/markets';
import { DECIMALS_TOKEN } from 'constants/index';

export function TitleBar() {
  const router = useRouter();

  const {
    clammMarkPrice,
    clammOpenInterest,
    clammTotalVolume,
    tokenA,
    updateTokenA,
    updateTokenDeps,
  } = useBoundStore();

  useEffect(() => {
    const { tokenA: tokenASymbol } = router.query;
    if (tokenASymbol) {
      updateTokenA(tokenASymbol as string);
      updateTokenDeps();
    }
  }, [router, updateTokenA, updateTokenDeps]);

  const handleSelectedPair = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedPair = e.target.innerText.split('-')[0].trim();
      router.query.tokenA = selectedPair;
      router.push(router);
      updateTokenA(selectedPair);
      updateTokenDeps();
    },
    [router, updateTokenA, updateTokenDeps],
  );

  return (
    <>
      <span className="text-stieglitz text-md">Select Pair</span>
      <div className="flex space-x-4 mb-4 mt-2">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-8 h-8 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${tokenA.toLowerCase()}.svg`}
            alt={tokenA}
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
          selection={`${tokenA} - USDC`}
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
          value={formatAmount(
            formatUnits(clammOpenInterest, DECIMALS_TOKEN),
            3,
            true,
          )}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Total Volume"
          value={formatAmount(
            formatUnits(clammTotalVolume, DECIMALS_TOKEN),
            3,
            true,
          )}
        />
      </div>
    </>
  );
}
