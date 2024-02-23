import React, { useState } from 'react';

import LPPositions from 'components/clamm/PositionsTable/components/Positions/LPPositions';

import BuyPositions from './components/Positions/BuyPositions';
// import HistoryPositions from './components/Positions/components/HistoryPositions';
import PositionsTypeSelector from './components/Positions/components/PositionsTypeSelector';

const PositionsTable = () => {
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(0);
  const [buyPositionsLength, setBuyPositionsLength] = useState(0);
  const [lpPositionsLength, setLpPositionsLength] = useState(0);

  const updatePositionsType = (index: number) => {
    const newMap = new Map<number, any | null>();
    setPositionsTypeIndex(index);
  };

  return (
    <div className="w-full flex-col items-center justify-center space-y-[12px]">
      <div className="w-full flex items-center">
        <PositionsTypeSelector
          selectedIndex={positionsTypeIndex}
          buyPositionsLength={buyPositionsLength}
          lpPositionsLength={lpPositionsLength}
          setSelectedIndex={updatePositionsType}
        />
      </div>
      <div className="w-full h-fit  bg-cod-gray p-[6px] rounded-lg">
        {positionsTypeIndex === 0 && (
          <BuyPositions setBuyPositionsLength={setBuyPositionsLength} />
        )}
        {positionsTypeIndex === 1 && (
          <LPPositions setLpPositionsLength={setLpPositionsLength} />
        )}
        {/* {positionsTypeIndex === 2 && <HistoryPositions />} */}
      </div>
    </div>
  );
};

export default PositionsTable;
