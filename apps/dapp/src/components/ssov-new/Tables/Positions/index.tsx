import { useMemo, useState } from 'react';

import { Skeleton } from '@dopex-io/ui';

import useSsovPositions from 'hooks/ssov/useSsovPositions';
import useVaultStore from 'hooks/ssov/useVaultStore';

import { ButtonGroup } from 'components/ssov-new/AsidePanel';

import BuyPositions from './BuyPositions';
import WritePositions from './WritePositions';

const Positions = () => {
  const vault = useVaultStore((vault) => vault.vault);

  const { writePositions, buyPositions, isLoading } = useSsovPositions({
    market: vault.underlyingSymbol.toUpperCase(),
  });

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
        <span>Sell Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{writePositions.length}</span>
        </div>
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
    else {
      if (activeIndex === 0) return <BuyPositions positions={buyPositions} />;
      else {
        return <WritePositions positions={writePositions} />;
      }
    }
  }, [activeIndex, buyPositions, isLoading, writePositions]);

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
