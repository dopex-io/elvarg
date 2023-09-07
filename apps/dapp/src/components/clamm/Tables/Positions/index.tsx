import { useMemo, useState } from 'react';

import { Skeleton } from '@dopex-io/ui';

import useClammPositions from 'hooks/clamm/useClammPositions';

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

  const { writePositions, optionsPositions, isLoading } = useClammPositions();

  const buttonLabels = useMemo(() => {
    if (!optionsPositions || !writePositions) return [null, null];
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Buy Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{optionsPositions.length}</span>
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
  }, [optionsPositions, writePositions]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const renderComponent = useMemo(() => {
    if (
      isLoading &&
      writePositions.length === 0 &&
      optionsPositions.length === 0
    )
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
    if (activeIndex === 0)
      return <OptionsPositions optionsPositions={optionsPositions} />;
    else if (activeIndex === 1)
      return <WritePositions writePositions={writePositions} />;
    return <Placeholder />;
  }, [isLoading, activeIndex, optionsPositions, writePositions]);

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
