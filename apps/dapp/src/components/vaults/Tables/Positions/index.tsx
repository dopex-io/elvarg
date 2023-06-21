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
        <p className="flex">Buy Positions</p>
        <p className="px-[5px] rounded-full bg-carbon">{buyPositions.length}</p>
      </div>,
      <div className="flex space-x-2" key="buy-positions">
        <p className="flex">Sell Positions</p>
        <p className="px-[5px] rounded-full bg-carbon">
          {writePositions.length}
        </p>
      </div>,
    ];
  }, [buyPositions, writePositions]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  // todo: make these tables reusable
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
