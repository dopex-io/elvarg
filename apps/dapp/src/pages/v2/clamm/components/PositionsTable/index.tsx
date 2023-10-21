import React, { useCallback, useState } from 'react';

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

  // Load positions with useEffect using API
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <PositionsTypeSelector
        selectedIndex={positionsTypeIndex}
        buyPositionsLength={0}
        lpPositionsLength={0}
        setSelectedIndex={updatePositionsType}
      />
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
