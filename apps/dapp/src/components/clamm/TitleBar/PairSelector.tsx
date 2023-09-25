import { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Menu } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

import { formatAmount } from 'utils/general';

import {
  CLAMM_COLLATERAL_TOKENS_LIST,
  CLAMM_UNDERLYING_TOKENS_LIST,
} from 'constants/clamm';

export function PairSelector() {
  const {
    setSelectedOptionsPoolPair,
    markPrice,
    ticksData,
    optionsPool,
    keys,
    tokenPrices,
  } = useBoundStore();

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

  const stats = useMemo(() => {
    if (!optionsPool)
      return {
        TVL: 0,
        openInterest: 0,
      };
    const putAssetSymbol = optionsPool[keys.putAssetSymbolKey];
    const callAssetSymbol = optionsPool[keys.callAssetSymbolKey];

    const putAssetPrice =
      tokenPrices.find(
        (data) => data.name.toLowerCase() === putAssetSymbol.toLowerCase(),
      )?.price ?? 0;
    const callAssetPrice =
      tokenPrices.find(
        (data) => data.name.toLowerCase() === callAssetSymbol.toLowerCase(),
      )?.price ?? 0;

    let TVL = 0;
    let openInterest = 0;

    for (let i = 0; i < ticksData.length; i++) {
      // ticksData[i].totalLiquidity;
      const callAssetDecimals = optionsPool[keys.callAssetDecimalsKey];
      const putAssetDecimals = optionsPool[keys.putAssetDecimalsKey];

      const callAssetsValue =
        Number(
          formatUnits(
            ticksData[i].totalLiquidity[keys.callAssetAmountKey],
            callAssetDecimals,
          ),
        ) * callAssetPrice;
      const putAssetsValue =
        Number(
          formatUnits(
            ticksData[i].totalLiquidity[keys.putAssetAmountKey],
            putAssetDecimals,
          ),
        ) * putAssetPrice;

      TVL += callAssetsValue + putAssetsValue;

      const callAssetsUsedValue =
        Number(
          formatUnits(
            ticksData[i].totalLiquidity[keys.callAssetAmountKey] -
              ticksData[i].liquidityAvailable[keys.callAssetAmountKey],
            callAssetDecimals,
          ),
        ) * callAssetPrice;

      const putAssetsUsedValue =
        Number(
          formatUnits(
            ticksData[i].totalLiquidity[keys.putAssetAmountKey] -
              ticksData[i].liquidityAvailable[keys.putAssetAmountKey],
            putAssetDecimals,
          ),
        ) * putAssetPrice;

      openInterest += callAssetsUsedValue + putAssetsUsedValue;
    }

    return {
      TVL,
      openInterest,
    };
  }, [
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    optionsPool,
    ticksData,
    tokenPrices,
  ]);

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
          className="z-10"
          showArrow
        />
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectedCollateralToken}
          selection={collateralToken}
          data={CLAMM_COLLATERAL_TOKENS_LIST}
          className="z-10"
          showArrow
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Mark Price"
          value={markPrice === 0 ? '...' : markPrice.toFixed(5)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Open Interest"
          value={formatAmount(stats.openInterest, 3, true)}
        />
        <TitleItem
          symbol="$"
          symbolPrefixed
          label="Total Deposits"
          value={formatAmount(stats.TVL, 3, true)}
        />
      </div>
    </>
  );
}
