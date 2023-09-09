import { useCallback, useEffect, useState } from 'react';

import { Menu } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import {
  CLAMM_COLLATERAL_TOKENS_LIST,
  CLAMM_UNDERLYING_TOKENS_LIST,
} from 'constants/clamm';

export function PairSelector() {
  const { setSelectedOptionsPoolPair, markPrice } = useBoundStore();

  const [underlyingToken, setUnderlyingToken] = useState<string>('ARB');
  const [collateralToken, setCollateralToken] = useState<string>('USDC');

  const handleSelectedUnderlyingToken = useCallback(
    (e: any) => {
      const underlyingTokenSymbol = e.target.innerText;
      setUnderlyingToken(e.target.innerText);
      setSelectedOptionsPoolPair(underlyingTokenSymbol, collateralToken);
    },
    [collateralToken, setSelectedOptionsPoolPair],
  );

  const handleSelectedCollateralToken = useCallback(
    (e: any) => {
      const collateralTokenSymbol = e.target.innerText;
      setCollateralToken(collateralTokenSymbol);
      setSelectedOptionsPoolPair(underlyingToken, collateralTokenSymbol);
    },
    [setSelectedOptionsPoolPair, underlyingToken],
  );

  return (
    <>
      <span className="text-stieglitz text-md">Select Pair</span>
      <div className="flex space-x-4 mb-4 mt-2">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-8 h-8 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${underlyingToken.toLowerCase()}.svg`}
            alt={underlyingToken}
          />
          <img
            className="w-8 h-8 z-0"
            src={`/images/tokens/${collateralToken.toLowerCase()}.svg`}
            alt={collateralToken}
          />
        </div>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectedUnderlyingToken}
          selection={underlyingToken}
          data={CLAMM_UNDERLYING_TOKENS_LIST}
          showArrow
        />
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectedCollateralToken}
          selection={collateralToken}
          data={CLAMM_COLLATERAL_TOKENS_LIST}
          showArrow
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Mark Price"
          value={markPrice === 0 ? '...' : markPrice.toFixed(5)}
        />
        {/* <TitleItem
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
        /> */}
      </div>
    </>
  );
}
