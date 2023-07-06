import { useMemo, useState } from 'react';

import useFetchPositions from 'hooks/vaults/positions';
import useVaultState from 'hooks/vaults/state';

import { ButtonGroup } from 'components/vaults/AsidePanel';

import BuyPositions from './BuyPositions';
import WritePositions from './WritePositions';

const Positions = () => {
  const vault = useVaultState((vault) => vault.vault);

  const { writePositions, buyPositions, isLoading } = useFetchPositions({
    vaultAddress: vault.address,
    tokenSymbol: vault.base,
    isPut: vault.isPut,
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

  // TODO: make these tables reusable
  return (
    <div className="space-y-2">
      <ButtonGroup
        active={activeIndex}
        labels={buttonLabels}
        handleClick={handleClick}
      />
      {activeIndex === 0 ? (
        <BuyPositions positions={buyPositions} isLoading={isLoading} />
      ) : (
        <WritePositions positions={writePositions} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Positions;
