import React, { useEffect, useState } from 'react';

import { useQueries } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import getBuyPositions from '../../utils/varrock/getBuyPosition';
import getLPPositions from '../../utils/varrock/getLPPositions';
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
  const [selectedPositions, setSelectedPositions] = useState<
    Map<number, any | null>
  >(new Map());

  const selectPosition = (key: number, positionId: number) => {
    setSelectedPositions((prev) => {
      prev.set(key, positionId);
      return prev;
    });
  };

  const deselectposition = (key: number, positionId: number) => {
    setSelectedPositions((prev) => {
      prev.set(key, null);
      return prev;
    });
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
          <BuyPositions positions={buyPositions} />
        ) : (
          <LPPositions positions={lpPositions} />
        )}
      </div>
    </div>
  );
};

export default PositionsTable;
