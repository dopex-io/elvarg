import { useMemo, useState } from 'react';

import { Skeleton } from '@dopex-io/ui';

import { useBoundStore } from 'store';

import { ButtonGroup } from 'components/clamm/AsidePanel';

import BuyPositions from './BuyPositions';
import WritePositions from './WritePositions';

const Positions = () => {
  const isLoading = false;

  const { buyPositions, writePositions } = useBoundStore();

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const buttonLabels = useMemo(() => {
    if (!buyPositions || !writePositions) return [null, null];
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Buy Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{buyPositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>LP Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{writePositions.length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>History</span>
      </div>,
    ];
  }, [buyPositions, writePositions]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

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
    if (activeIndex === 0) return <BuyPositions buyPositions={buyPositions} />;
    else if (activeIndex === 1)
      return <WritePositions writePositions={writePositions} />;
    return null;
  }, [isLoading, activeIndex, buyPositions, writePositions]);

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
