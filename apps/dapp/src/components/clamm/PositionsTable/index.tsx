import React, { useCallback, useEffect, useState } from 'react';

import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import getBuyPositions from 'utils/clamm/varrock/getBuyPosition';
import getLPPositions from 'utils/clamm/varrock/getLPPositions';
import { OptionsPositionsResponse } from 'utils/clamm/varrock/types';

import { DEFAULT_CHAIN_ID } from 'constants/env';

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
  const [buyPositions, setBuyPositions] = useState<OptionsPositionsResponse[]>(
    [],
  );
  const [selectedPositions, setSelectedPositions] = useState<Map<number, any>>(
    new Map(),
  );
  const [loading, setLoading] = useState({
    buyPositions: false,
    lpPositions: false,
  });

  const selectPosition = (key: number, positionInfo: any) => {
    setSelectedPositions((prev) => new Map(prev.set(key, positionInfo)));
  };
  const unselectPosition = (key: number) => {
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
    if (!userAddress || !selectedOptionsPool) return;
    const { optionsPoolAddress } = selectedOptionsPool;
    await getBuyPositions(
      {
        account: userAddress,
        optionMarket: optionsPoolAddress,
        first: 1000,
        skip: 0,
      },
      (data) => {
        setBuyPositions(
          data
            .filter(({ size }: any) => Number(size.amountInToken) > 0)
            .filter(
              ({ expiry }: any) => Number(expiry) > new Date().getTime() / 1000,
            ),
        );
      },
      (err) => {
        console.error(err);
      },
    );
  }, [selectedOptionsPool, userAddress]);

  const updateLPPositions = useCallback(async () => {
    if (!userAddress || !selectedOptionsPool) return;
    await getLPPositions(
      chain?.id ?? DEFAULT_CHAIN_ID,
      userAddress,
      selectedOptionsPool.optionsPoolAddress,
      1000,
      0,
      (data: any) => {
        setLpPositions(data);
      },
      (err) => {
        console.error(err);
      },
    );
  }, [chain, selectedOptionsPool, userAddress]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, buyPositions: true }));
    updateBuyPositions().finally(() =>
      setLoading((prev) => ({ ...prev, buyPositions: false })),
    );
  }, [updateBuyPositions]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, lpPositions: true }));
    updateLPPositions().finally(() =>
      setLoading((prev) => ({ ...prev, lpPositions: false })),
    );
  }, [updateLPPositions]);

  useEffect(() => {
    const interval = setInterval(() => updateBuyPositions(), 15000);
    return () => clearInterval(interval);
  }, [updateBuyPositions]);

  useEffect(() => {
    const interval = setInterval(() => updateLPPositions(), 15000);
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
          {positionsTypeIndex !== 0 && (
            <ActionButton
              positionsTypeIndex={positionsTypeIndex}
              selectedPositions={selectedPositions}
              updateLPPositions={updateLPPositions}
              updateBuyPositions={updateBuyPositions}
              resetPositions={resetPositions}
            />
          )}
        </div>
      </div>
      <div className="w-full h-fit  bg-cod-gray">
        {positionsTypeIndex === 0 ? (
          <BuyPositions
            positions={buyPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            loading={loading.buyPositions}
          />
        ) : (
          <LPPositions
            positions={lpPositions}
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            updatePositions={updateLPPositions}
            loading={loading.lpPositions}
          />
        )}
      </div>
    </div>
  );
};

export default PositionsTable;
