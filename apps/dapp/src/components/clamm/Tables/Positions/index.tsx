import { useMemo, useState } from 'react';

import { useBoundStore } from 'store';

import ButtonGroup from 'components/clamm/AsidePanel/components/ButtonGroup';

import OptionsPositions from './OptionsPositions';
import TradeHistory from './TradeHistory';
import WritePositions from './WritePositions';

const Positions = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { userClammPositions } = useBoundStore();

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
