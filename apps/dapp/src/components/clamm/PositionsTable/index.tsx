import React, { useCallback, useEffect, useState } from 'react';

import toast, { LoaderIcon } from 'react-hot-toast';
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
  const [loading, setLoading] = useState(true);

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

  const updateBuyPositions = useCallback(async () => {
    if (!chain || !userAddress || !selectedOptionsPool) return;
    setLoading(true);
    await getBuyPositions(
      chain.id,
      userAddress,
      selectedOptionsPool.callToken.address,
      1000,
      0,
      (data) => {
        console.log(data);
        setBuyPositions(
          data
            .filter(({ size }: any) => Number(size.amountInToken) > 0)
            .filter(
              ({ expiry }: any) => Number(expiry) > new Date().getTime() / 1000,
            ),
        );
      },
      toast.error,
    );
    setLoading(false);
  }, [chain, selectedOptionsPool, userAddress]);

  const updateLPPositions = useCallback(async () => {
    if (!chain || !userAddress || !selectedOptionsPool) return;
    setLoading(true);
    await getLPPositions(
      chain.id,
      userAddress,
      selectedOptionsPool.callToken.address,
      1000,
      0,
      setLpPositions,
      toast.error,
    );
    setLoading(false);
  }, [chain, selectedOptionsPool, userAddress]);

  useEffect(() => {
    const interval = setInterval(() => updateBuyPositions(), 5000);
    return () => clearInterval(interval);
  }, [updateBuyPositions]);

  useEffect(() => {
    const interval = setInterval(() => updateLPPositions(), 5000);
    return () => clearInterval(interval);
  }, [updateLPPositions]);

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
        <div className="flex space-x-[4px]">
          {loading && <LoaderIcon className="w-[14px] h-[14px]" />}
          {positionsTypeIndex !== 0 && (
            <ActionButton
              positionsTypeIndex={positionsTypeIndex}
              selectedPositions={selectedPositions}
              updateLPPositions={updateLPPositions}
              updateBuyPositions={updateBuyPositions}
            />
          )}
        </div>
      </div>
      <div className="w-full h-fit">
        {positionsTypeIndex === 0 ? (
          <BuyPositions
            positions={buyPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            updatePositions={updateBuyPositions}
          />
        ) : (
          <LPPositions
            positions={lpPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            updatePositions={updateLPPositions}
          />
        )}
      </div>
    </div>
  );
};

export default PositionsTable;
