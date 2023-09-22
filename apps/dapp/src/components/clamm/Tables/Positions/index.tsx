import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBoundStore } from 'store';

import { ButtonGroup } from 'components/clamm/AsidePanel';

import parseOptionsPosition from 'utils/clamm/parseOptionsPosition';
import parseWritePosition, {
  WritePosition,
} from 'utils/clamm/parseWritePosition';
import getUserOptionsExercises from 'utils/clamm/subgraph/getUserOptionsExercises';
import getUserOptionsPositions from 'utils/clamm/subgraph/getUserOptionsPositions';
import getUserOptionsPurchases from 'utils/clamm/subgraph/getUserOptionsPurchases';
import getUserWritePositions from 'utils/clamm/subgraph/getUserWritePositions';

import OptionsPositions from './OptionsPositions';
import TradeHistory from './TradeHistory';
import WritePositions from './WritePositions';

const Positions = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const {
    userClammPositions,
    ticksData,
    optionsPool,
    setLoading,
    setUserClammPositions,
    userAddress,
  } = useBoundStore();

  const updateUserWritePositions = useCallback(async () => {
    if (!optionsPool) return;
    if (ticksData.length === 0) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
      sqrtX96Price,
    } = optionsPool;

    setLoading('writePositions', true);
    const positions = await getUserWritePositions(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedPositions = positions
      .map((position) => {
        const tickData = ticksData.find((data) => {
          return (
            position.tickLower === data.tickLower &&
            position.tickUpper === data.tickUpper
          );
        });

        if (!tickData) return;
        return parseWritePosition(
          sqrtX96Price,
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          tickData,
          position,
        );
      })
      .filter((position): position is WritePosition => position !== undefined);

    setUserClammPositions('writePositions', parsedPositions);
    setLoading('writePositions', false);
  }, [optionsPool, ticksData, setUserClammPositions, setLoading, userAddress]);

  useEffect(() => {
    updateUserWritePositions();
  }, [updateUserWritePositions]);

  const updateUserOptionsPositions = useCallback(async () => {
    if (!optionsPool) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
    } = optionsPool;

    setLoading('optionsPositions', true);
    const positions = await getUserOptionsPositions(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedPositions = positions
      .map((position) => {
        return parseOptionsPosition(
          10 ** token0Decimals,
          10 ** token1Decimals,
          inversePrice,
          position,
        );
      })
      .filter(
        (position) =>
          position.expiry > BigInt((new Date().getTime() / 1000).toFixed(0)),
      );

    setUserClammPositions('optionsPositions', parsedPositions);
    setLoading('optionsPositions', false);
  }, [optionsPool, setUserClammPositions, setLoading, userAddress]);

  useEffect(() => {
    updateUserOptionsPositions();
  }, [updateUserOptionsPositions]);

  const updateUserPositionsHistory = useCallback(async () => {
    if (!optionsPool) return;

    const {
      uniswapV3PoolAddress,
      inversePrice,
      token0Decimals,
      token1Decimals,
    } = optionsPool;

    setLoading('positionsHistory', true);

    const optionsPurchased = await getUserOptionsPurchases(
      uniswapV3PoolAddress,
      userAddress,
    );

    console.log(optionsPurchased);

    const optionsExercised = await getUserOptionsExercises(
      uniswapV3PoolAddress,
      userAddress,
    );

    const parsedOptionsPurchased = optionsPurchased.map((position) => {
      const parsed = parseOptionsPosition(
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
        position,
      );

      return {
        ...parsed,
        timestamp: position.timestamp,
      };
    });

    const parsedOptionsExercised = optionsExercised.map((position) => {
      const parsed = parseOptionsPosition(
        10 ** token0Decimals,
        10 ** token1Decimals,
        inversePrice,
        position,
      );

      return {
        ...parsed,
        timestamp: position.timestamp,
      };
    });

    console.log('setting positions', parsedOptionsExercised);
    setUserClammPositions('optionsExercises', parsedOptionsExercised);
    setUserClammPositions('optionsPurchases', parsedOptionsPurchased);
    setLoading('positionsHistory', false);
  }, [optionsPool, setUserClammPositions, setLoading, userAddress]);

  useEffect(() => {
    updateUserPositionsHistory();
  }, [updateUserPositionsHistory]);

  const buttonLabels = useMemo(() => {
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Buy Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{userClammPositions.optionsPositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>LP Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{userClammPositions.writePositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Trade History</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>
            {userClammPositions.optionsExercises.length +
              userClammPositions.optionsPurchases.length}
          </span>
        </div>
      </div>,
    ];
  }, [
    userClammPositions.writePositions.length,
    userClammPositions.optionsPositions.length,
    userClammPositions.optionsExercises.length,
    userClammPositions.optionsPurchases.length,
  ]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-2 flex flex-col">
      <div className="w-full flex items-center justify-between">
        <ButtonGroup
          active={activeIndex}
          labels={buttonLabels}
          handleClick={handleClick}
        />
      </div>
      {activeIndex === 0 && <OptionsPositions />}
      {activeIndex === 1 && <WritePositions />}
      {activeIndex === 2 && <TradeHistory />}
    </div>
  );
};
export default Positions;
