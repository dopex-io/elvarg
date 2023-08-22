import { useMemo, useState } from 'react';

import { Skeleton } from '@dopex-io/ui';

import { ButtonGroup } from 'components/ssov-beta/AsidePanel';

import { longs, shorts } from 'constants/optionAmm/placeholders';

import LongPositions from './LongPositions';
import ShortPositions from './ShortPositions';

const Positions = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const isLoading = false;

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const buttonLabels = useMemo(() => {
    if (!longs || !longs) return [null, null];
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Long Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{longs.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Short Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{shorts.length}</span>
        </div>
      </div>,
    ];
  }, []);

  const renderComponent = useMemo(() => {
    if (isLoading)
      return (
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
        </div>
      );
    else {
      if (activeIndex === 0) return <LongPositions data={longs} />;
      else {
        return <ShortPositions data={shorts} />;
      }
    }
  }, [activeIndex, isLoading]);

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
