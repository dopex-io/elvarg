import React, { useCallback, useEffect, useState } from 'react';

import { useAccount, useNetwork } from 'wagmi';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import getBuyPositions from 'utils/clamm/varrock/getBuyPosition';
import getLPPositions from 'utils/clamm/varrock/getLPPositions';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import BuyPositions from './components/Positions/BuyPositions';
import HistoryPositions from './components/Positions/components/HistoryPositions';
import PositionsTypeSelector from './components/Positions/components/PositionsTypeSelector';
import LPPositions from 'pages/clamm-v2/components/LPPositions';

export type PositionsTableProps = {
  selectPosition: (key: number, positionInfo: any) => void;
  selectedPositions: Map<number, any>;
  unselectPosition: (key: number) => void;
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
  const { selectedOptionsMarket } = useClammStore();
  const [positionsTypeIndex, setPositionsTypeIndex] = useState(1);

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
    if (!userAddress || !selectedOptionsMarket) return;
    const { address } = selectedOptionsMarket;
    await getBuyPositions(
      {
        account: userAddress,
        optionMarket: address,
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
  }, [selectedOptionsMarket, userAddress, setBuyPositions]);

  const updateLPPositions = useCallback(async () => {
    // if (!userAddress || !selectedOptionsMarket) return;
    // await getLPPositions(
    //   chain?.id ?? DEFAULT_CHAIN_ID,
    //   userAddress,
    //   selectedOptionsMarket.address,
    //   1000,
    //   0,
    //   (data: any) => {
    //     setLPPositions(data);
    //   },
    //   (err) => {
    //     console.error(err);
    //   },
    // );
  }, [chain, selectedOptionsMarket, userAddress, setLPPositions]);

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
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        if (positionsTypeIndex === 0) {
          updateBuyPositions();
        } else {
          updateLPPositions();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateBuyPositions, updateLPPositions, positionsTypeIndex]);

  return (
    <div className="w-full flex-col items-center justify-center space-y-[12px]">
      <div className="w-full flex items-center">
        <PositionsTypeSelector
          resetPositions={resetPositions}
          selectedIndex={positionsTypeIndex}
          buyPositionsLength={buyPositions.length}
          lpPositionsLength={lpPositions.length}
          setSelectedIndex={updatePositionsType}
        />
      </div>
      <div className="w-full h-fit  bg-cod-gray p-[6px] rounded-lg">
        {/* {positionsTypeIndex === 0 && (
          <BuyPositions
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            loading={loading.buyPositions}
          />
        )} */}
        {/* {positionsTypeIndex === 1 && (
          <LPPositions
            selectPosition={selectPosition}
            unselectPosition={unselectPosition}
            selectedPositions={selectedPositions}
            loading={loading.lpPositions}
          />
        )} */}
        {positionsTypeIndex === 1 && (
          <LPPositions />
        )}
        {/* {positionsTypeIndex === 2 && <HistoryPositions />} */}
      </div>
    </div>
  );
};

export default PositionsTable;
