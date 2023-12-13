import React, { useMemo, useState } from 'react';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import RangeSelector from '../RangeSelector';
import SelectedStrikeItem from '../SelectedStrikeItem';
import Panel from './components/Panel';
import StrikeSelector from './components/StrikeSelector/StrikeSelector';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();
  const { isTrade, rangeSelectorMode, setRangeSelectorMode } = useClammStore();
  const [editAllMode, setEditAllMode] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>('');
  const showStrikeItems = useMemo(() => {
    if (isTrade) {
      return true;
    } else {
      return !rangeSelectorMode;
    }
  }, [rangeSelectorMode, isTrade]);

  const showStrikeSelector = useMemo(() => {
    if (isTrade) {
      return true;
    } else {
      return rangeSelectorMode === false;
    }
  }, [rangeSelectorMode, isTrade]);

  return (
    <div className="w-full h-fit p-[12px] bg-umbra flex flex-col space-y-[10px]">
      <Panel
        rangeSelectorMode={rangeSelectorMode}
        setRangeSelectorMode={() => {
          setRangeSelectorMode(!rangeSelectorMode);
        }}
        editAllMode={editAllMode}
        setEditAllMode={() => {
          setEditAllMode((prev) => !prev);
        }}
      />
      <div className="flex flex-col w-full space-y-[10px]">
        {!isTrade && rangeSelectorMode && <RangeSelector />}
        {showStrikeItems &&
          Array.from(selectedStrikes).map(
            ([strikeIndex, strikeData], index) => (
              <SelectedStrikeItem
                disabledInput={editAllMode && index !== 0}
                key={index}
                strikeData={strikeData}
                strikeIndex={strikeIndex}
                editAllMode={editAllMode}
                commonInputAmount={inputAmount}
                commonSetInputAmount={setInputAmount}
              />
            ),
          )}
      </div>
      {showStrikeSelector && <StrikeSelector />}
    </div>
  );
};

export default StrikesSection;
