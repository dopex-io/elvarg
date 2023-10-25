import React, { useState } from 'react';

import { useQueries } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import { VARROACK_BASE_API_URL } from '../../constants';
import ActionButton from './components/Positions/components/ActionButton';
import BuyPositions from './components/Positions/components/BuyPositions';
import LPPositions from './components/Positions/components/LPPositions';
import PositionsTypeSelector from './components/Positions/components/PositionsTypeSelector';

const PositionsTable = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(1);
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

  const [
    { data: buyPositionsData, isLoading: buyPositionsLoading },
    { data: depositPositionsData },
  ] = useQueries({
    queries: [
      {
        queryKey: ['clamm-user-buy-positions', selectedOptionsPool],
        initialData: [],
        refetchOnWindowFocus: true,
        queryFn: async () => {
          const queryUrl = new URL(
            `${VARROACK_BASE_API_URL}/clamm/positions/purchase`,
          );
          queryUrl.searchParams.set(
            'chainId',
            String(chain?.id ?? DEFAULT_CHAIN_ID),
          );
          return fetch(queryUrl).then((res) => res.json());
        },
      },
      {
        queryKey: ['clamm-user-deposit-positions', selectedOptionsPool],
        initialData: [],
        refetchOnWindowFocus: true,
        queryFn: async () => {
          const queryUrl = new URL(
            `${VARROACK_BASE_API_URL}/clamm/positions/deposit`,
          );
          queryUrl.searchParams.set(
            'chainId',
            String(chain?.id ?? DEFAULT_CHAIN_ID),
          );
          return fetch(queryUrl).then((res) => res.json());
        },
      },
    ],
  });

  return (
    <div className="w-full flex-col items-center justify-center space-y-[12px]">
      <div className="w-full flex flex-row items-center justify-between">
        <PositionsTypeSelector
          selectedIndex={positionsTypeIndex}
          buyPositionsLength={0}
          lpPositionsLength={0}
          setSelectedIndex={updatePositionsType}
        />
        <ActionButton
          positionsTypeIndex={positionsTypeIndex}
          selectedPositions={selectedPositions}
        />
      </div>
      <div className="w-full h-fit">
        {positionsTypeIndex === 0 && (
          <BuyPositions
            positions={
              buyPositionsData.error || !buyPositionsData
                ? []
                : buyPositionsData
            }
          />
        )}
        {positionsTypeIndex === 1 && (
          <LPPositions
            positions={
              depositPositionsData.error || !depositPositionsData
                ? []
                : depositPositionsData
            }
          />
        )}
      </div>
    </div>
  );
};

export default PositionsTable;
