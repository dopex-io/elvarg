import React, { useCallback, useEffect, useState } from 'react';

import { useAccount, useNetwork } from 'wagmi';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import getBuyPositions from 'utils/clamm/varrock/getBuyPosition';
import getLPPositions from 'utils/clamm/varrock/getLPPositions';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import ActionButton from './components/Positions/components/ActionButton';
import BuyPositions from './components/Positions/components/BuyPositions';
import HistoryPositions from './components/Positions/components/HistoryPositions';
import LPPositions from './components/Positions/components/LPPositions';
import PositionsTypeSelector from './components/Positions/components/PositionsTypeSelector';

export type PositionsTableProps = {
  selectPosition: (key: number, positionInfo: any) => void;
  selectedPositions: Map<number, any>;
  unselectPosition: (key: number) => void;
  removePosition: (index: number) => void;
  loading: boolean;
};

const PositionsTable = () => {
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const {
    setUpdateBuyPositions,
    setUpdateLPPositions,
    buyPositions,
    lpPositions,
    setBuyPositions,
    setLPPositions,
  } = useClammPositions();
  const { selectedOptionsPool } = useClammStore();
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(0);

  const [selectedPositions, setSelectedPositions] = useState<Map<number, any>>(
    new Map(),
  );
  const [loading, setLoading] = useState({
    buyPositions: false,
    lpPositions: false,
  });

  const removeLpPosition = useCallback(
    (indexToRemove: number) => {
      setLPPositions(lpPositions.filter((_, index) => indexToRemove !== index));
    },
    [setLPPositions, lpPositions],
  );

  const removeBuyPosition = useCallback(
    (indexToRemove: number) => {
      setBuyPositions(
        buyPositions.filter((_, index) => indexToRemove !== index),
      );
    },
    [setBuyPositions, buyPositions],
  );

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
  }, [selectedOptionsPool, userAddress, setBuyPositions]);

  const updateLPPositions = useCallback(async () => {
    if (!userAddress || !selectedOptionsPool) return;
    await getLPPositions(
      chain?.id ?? DEFAULT_CHAIN_ID,
      userAddress,
      selectedOptionsPool.optionsPoolAddress,
      1000,
      0,
      (data: any) => {
        setLPPositions(data);
      },
      (err) => {
        console.error(err);
      },
    );
  }, [chain, selectedOptionsPool, userAddress, setLPPositions]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, buyPositions: true }));
    setUpdateBuyPositions(updateBuyPositions);
    updateBuyPositions().finally(() =>
      setLoading((prev) => ({ ...prev, buyPositions: false })),
    );
  }, [updateBuyPositions, setUpdateBuyPositions]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, lpPositions: true }));
    setUpdateLPPositions(updateLPPositions);
    updateLPPositions().finally(() =>
      setLoading((prev) => ({ ...prev, lpPositions: false })),
    );
  }, [updateLPPositions, setUpdateLPPositions]);

  useEffect(() => {
    const interval = setInterval(
      () => setUpdateLPPositions(updateLPPositions),
      15000,
    );
    return () => clearInterval(interval);
  }, [setUpdateLPPositions, updateLPPositions]);

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
          {positionsTypeIndex === 1 && (
            <ActionButton
              positionsTypeIndex={positionsTypeIndex}
              selectedPositions={selectedPositions}
              resetPositions={resetPositions}
            />
          )}
        </div>
      </div>
      <div className="w-full h-fit  bg-cod-gray">
        {positionsTypeIndex === 0 && (
          <BuyPositions
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            loading={loading.buyPositions}
            removePosition={removeBuyPosition}
          />
        )}
        {positionsTypeIndex === 1 && (
          <LPPositions
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            loading={loading.lpPositions}
            removePosition={removeLpPosition}
          />
        )}
        {positionsTypeIndex === 2 && <HistoryPositions />}
      </div>
    </div>
  );
};

export default PositionsTable;
