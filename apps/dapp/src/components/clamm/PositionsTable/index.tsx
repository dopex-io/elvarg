import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import getBuyPositions from 'utils/clamm/varrock/getBuyPosition';
import getLPPositions from 'utils/clamm/varrock/getLPPositions';

import ActionButton from './components/Positions/components/ActionButton';
import BuyPositions from './components/Positions/components/BuyPositions';
import LPPositions from './components/Positions/components/LPPositions';
import PositionsTypeSelector from './components/Positions/components/PositionsTypeSelector';

const PositionsTable = () => {
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const { selectedOptionsPool } = useClammStore();
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(0);
  const [lpPositions, setLpPositions] = useState<any>([]);
  const [buyPositions, setBuyPositions] = useState<any>([]);
  const [selectedPositions, setSelectedPositions] = useState<Map<number, any>>(
    new Map(),
  );

  const selectPosition = (key: number, positionInfo: any) => {
    setSelectedPositions((prev) => new Map(prev.set(key, positionInfo)));
  };
  const unselectPosition = (key: number, positionInfo: any) => {
    setSelectedPositions((prev) => {
      prev.delete(key);
      return new Map(prev);
    });
  };

  const resetPositions = () => {
    setSelectedPositions(new Map<number, any>());
  };

  const updatePositionsType = (index: number) => {
    const newMap = new Map<number, any | null>();
    setSelectedPositions(newMap);
    setPositionsTypeIndex(index);
  };

  useEffect(() => {
    if (!chain || !userAddress || !selectedOptionsPool) return;
    getLPPositions(
      chain.id,
      userAddress,
      selectedOptionsPool.callToken.address,
      1000,
      0,
      setLpPositions,
      toast.error,
    );
  }, [chain, selectedOptionsPool, userAddress]);

  useEffect(() => {
    if (!chain || !userAddress || !selectedOptionsPool) return;
    getBuyPositions(
      chain.id,
      userAddress,
      selectedOptionsPool.callToken.address,
      1000,
      0,
      setBuyPositions,
      toast.error,
    );
  }, [chain, selectedOptionsPool, userAddress]);

  return (
    <div className="w-full flex-col items-center justify-center space-y-[12px]">
      <div className="w-full flex flex-row items-center justify-between">
        <PositionsTypeSelector
          resetPositions={resetPositions}
          selectedIndex={positionsTypeIndex}
          buyPositionsLength={buyPositions.length}
          lpPositionsLength={lpPositions.length}
          setSelectedIndex={updatePositionsType}
        />
        <ActionButton
          positionsTypeIndex={positionsTypeIndex}
          selectedPositions={selectedPositions}
        />
      </div>
      <div className="w-full h-fit">
        {positionsTypeIndex === 0 ? (
          <BuyPositions
            positions={buyPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
          />
        ) : (
          <LPPositions
            positions={lpPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
          />
        )}
      </div>
    </div>
  );
};

export default PositionsTable;
