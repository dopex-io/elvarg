import React, { useState } from 'react';

import ActionButton from './components/ActionButton';
import Positions from './components/Positions';
import PositionsTypeSelector from './components/PositionsTypeSelector';

const PositionsTable = () => {
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(0);
  const [selectedPositions, setSelectedPositions] = useState<
    Map<number, any | null>
  >(new Map());

  const selectPosition = (key: number, positionId: number) => {
    setSelectedPositions((prev) => {
      prev.set(key, positionId);
      return prev;
    });
  };

  const deselectposition = (key: number, positionId: number) => {
    setSelectedPositions((prev) => {
      prev.set(key, null);
      return prev;
    });
  };

  const updatePositionsType = (index: number) => {
    const newMap = new Map<number, any | null>();
    setSelectedPositions(newMap);
    setPositionsTypeIndex(index);
  };

  return (
    <div className="w-full flex-col items-center justify-center space-y-[12px]">
      <div className="w-full flex flex-row items-center justify-between">
        <PositionsTypeSelector
          selectedIndex={positionsTypeIndex}
          buyPositionsLength={0}
          lpPositionsLength={0}
          setSelectedIndex={updatePositionsType}
        />
        <ActionButton
          positionsTypeIndex={positionsTypeIndex}
          selectedPositions={selectedPositions}
        />
      </div>
      <Positions
        deselectPosition={deselectposition}
        positionsTypeIndex={positionsTypeIndex}
        selectPosition={selectPosition}
        selectedPositions={selectedPositions}
      />
    </div>
  );
};

export default PositionsTable;
