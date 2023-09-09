import { useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Skeleton } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import { ButtonGroup } from 'components/clamm/AsidePanel';

import OptionsPositions from './OptionsPositions';
import WritePositions from './WritePositions';

const Placeholder = () => {
  return (
    <div className="flex justify-center my-auto w-full bg-cod-gray rounded-lg py-8">
      <p className="text-sm text-stieglitz">Nothing to show</p>
    </div>
  );
};

const Positions = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const {
    loading,
    userClammPositions: { optionsPositions, writePositions },
    optionsPool,
    keys,
    tokenPrices,
    markPrice,
  } = useBoundStore();

  const filteredOptionsPositions = useMemo(() => {
    if (!optionsPool) return [];

    let positions = optionsPositions.map(
      ({
        callOrPut,
        tickLowerPrice,
        tickUpperPrice,
        amounts,
        expiry,
        exercisableAmount,
        exercised,
        tickLower,
        tickUpper,
      }) => {
        const sizeAmount = formatUnits(
          amounts[callOrPut ? keys.callAssetAmountKey : keys.putAssetAmountKey],
          optionsPool[
            callOrPut ? keys.callAssetDecimalsKey : keys.putAssetDecimalsKey
          ],
        );
        let size = {
          amount: sizeAmount,
          symbol:
            optionsPool[
              callOrPut ? keys.callAssetSymbolKey : keys.putAssetSymbolKey
            ],
        };

        let _pnl =
          (callOrPut
            ? markPrice - tickUpperPrice
            : tickLowerPrice - markPrice) * Number(sizeAmount);

        let usdValue = _pnl;
        _pnl = callOrPut ? _pnl : _pnl / markPrice;

        if (_pnl < 0) {
          _pnl = 0;
          usdValue = 0;
        }

        const pnl = {
          amount: _pnl.toString(),
          symbol:
            optionsPool[
              callOrPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey
            ],
          usdValue: usdValue,
        };

        return {
          tickLower,
          tickUpper,
          exercised,
          pnl,
          strike: callOrPut ? tickUpperPrice : tickLowerPrice,
          side: callOrPut ? 'Call' : 'Put',
          size,
          expiry,
          exercisableAmount,
        };
      },
    );

    positions = positions.filter(({ exercised }) => exercised === false);
    positions = positions.filter(({ size }) => size.amount !== '0');

    return positions;
  }, [
    markPrice,
    optionsPositions,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    optionsPool,
  ]);

  const filteredWritePositions = useMemo(() => {
    if (!optionsPool) return [];

    let positions = writePositions.map(
      ({
        shares,
        earned,
        size,
        tickLower,
        tickUpper,
        tickLowerPrice,
        tickUpperPrice,
      }) => {
        const sizeAmounts = {
          callAssetAmount: formatUnits(
            size[keys.callAssetAmountKey],
            optionsPool[keys.callAssetDecimalsKey],
          ),
          putAssetAmount: formatUnits(
            size[keys.putAssetAmountKey],
            optionsPool[keys.putAssetDecimalsKey],
          ),
          callAssetSymbol: optionsPool[keys.callAssetSymbolKey],
          putAssetSymbol: optionsPool[keys.putAssetSymbolKey],
        };

        const earnedAmounts = {
          callAssetAmount: formatUnits(
            earned[keys.callAssetAmountKey],
            optionsPool[keys.callAssetDecimalsKey],
          ),
          putAssetAmount: formatUnits(
            earned[keys.putAssetAmountKey],
            optionsPool[keys.putAssetDecimalsKey],
          ),
          callAssetSymbol: optionsPool[keys.callAssetSymbolKey],
          putAssetSymbol: optionsPool[keys.putAssetSymbolKey],
        };

        let side = 'Put';
        if (optionsPool.tick < tickLower) {
          side = 'Put';
          if (optionsPool.inversePrice) {
            side = 'Call';
          }
        } else if (optionsPool.tick > tickUpper) {
          side = 'Call';
          if (optionsPool.inversePrice) {
            side = 'Put';
          }
        }
        // if (optionsPool.inversePrice) { }

        return {
          tickLower,
          tickUpper,
          side,
          shares,
          size: sizeAmounts,
          earned: earnedAmounts,
          strike: side == 'Put' ? tickLowerPrice : tickUpperPrice,
        };
      },
    );

    positions = positions.filter(({ shares }) => shares !== 0n);

    return positions;
  }, [
    optionsPool,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.callAssetSymbolKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
    keys.putAssetSymbolKey,
    writePositions,
  ]);

  const buttonLabels = useMemo(() => {
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Buy Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{filteredOptionsPositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>LP Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{filteredWritePositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>History</span>
      </div>,
    ];
  }, [filteredOptionsPositions, filteredWritePositions]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const renderComponent = useMemo(() => {
    if (loading.positions) return;
    <div className="bg-cod-gray rounded-lg pt-3">
      <div className="grid grid-cols-1 gap-4 p-2">
        {Array.from(Array(4)).map((_, index) => {
          return (
            <Skeleton
              key={index}
              width="fitContent"
              height={70}
              color="carbon"
              variant="rounded"
            />
          );
        })}
      </div>
    </div>;
    if (activeIndex === 0)
      return <OptionsPositions optionsPositions={filteredOptionsPositions} />;
    else if (activeIndex === 1)
      return <WritePositions writePositions={filteredWritePositions} />;
    return <Placeholder />;
  }, [
    loading.positions,
    activeIndex,
    filteredOptionsPositions,
    filteredWritePositions,
  ]);

  // TODO: make these tables reusable
  return (
    <div className="space-y-2">
      <ButtonGroup
        active={activeIndex}
        labels={buttonLabels}
        handleClick={handleClick}
      />
      {renderComponent}
    </div>
  );
};
export default Positions;
