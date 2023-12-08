import React, { useState } from 'react';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import RangeSelector from '../RangeSelector';
import SelectedStrikeItem from '../SelectedStrikeItem';
import Panel from './components/Panel';
import StrikeSelector from './components/StrikeSelector';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();
  const { isTrade } = useClammStore();
  const [editAllMode, setEditAllMode] = useState(false);
  const [rangeSelectorMode, setRangeSelectorMode] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');
  return (
    <div className="w-full h-fit p-[12px] bg-umbra flex flex-col space-y-[10px]">
      <Panel
        rangeSelectorMode={rangeSelectorMode}
        setRangeSelectorMode={() => {
          setRangeSelectorMode((prev) => !prev);
        }}
        editAllMode={editAllMode}
        setEditAllMode={() => {
          setEditAllMode((prev) => !prev);
        }}
      />
      {rangeSelectorMode && !isTrade && <RangeSelector />}
      <div className="flex flex-col w-full space-y-[10px]">
        {Array.from(selectedStrikes).map(([strikeIndex, strikeData], index) => (
          <SelectedStrikeItem
            disabledInput={editAllMode && index !== 0}
            key={index}
            strikeData={strikeData}
            strikeIndex={strikeIndex}
            editAllMode={editAllMode}
            commonInputAmount={inputAmount}
            commonSetInputAmount={setInputAmount}
          />
        ))}
      </div>
      <StrikeSelector />
    </div>
  );
};

export default StrikesSection;
